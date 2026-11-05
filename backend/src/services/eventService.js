const crypto = require("crypto");

const model = require("../models/eventModel");
const time = require("../utils/churchTime");
const { uploadImage, deleteImage } = require("./storageService");

const ROLE_ADMIN = 1;
const ROLE_PASTOR = 2;
const ROLE_ELDER = 3;
const ROLE_LEADER = 4;

const CATEGORIES = [
  "Worship",
  "Prayer",
  "Conference",
  "Youth",
  "Children",
  "Outreach",
  "Fellowship",
  "Training",
  "Other",
];

const VISIBILITIES = ["public", "members", "ministry"];
const PAGE_SIZE = 12;

const httpError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const clean = (value) => (typeof value === "string" ? value.trim() : "");

/* ---------------------------------------------------------------- */
/* Access                                                            */
/* ---------------------------------------------------------------- */

const getAccess = async (user) => {
  const roleId = Number(user.roleId);
  const { memberMinistryIds, ledMinistryIds } = await model.getMinistryAccess(
    user.id
  );

  return {
    roleId,
    isStaff: roleId === ROLE_ADMIN || roleId === ROLE_PASTOR,
    isLeader: roleId === ROLE_LEADER,
    viewsAll: [ROLE_ADMIN, ROLE_PASTOR, ROLE_ELDER].includes(roleId),
    memberMinistryIds,
    ledMinistryIds,
  };
};

const canManage = (row, user, access) => {
  if (access.isStaff) return true;

  if (access.isLeader) {
    return (
      row.created_by === user.id ||
      (row.ministry_id !== null &&
        access.ledMinistryIds.includes(row.ministry_id))
    );
  }

  return false;
};

/* Which events this signed-in person is allowed to see. */
const viewerClause = (user, access) => {
  if (access.viewsAll) return { clauseSql: "1 = 1", clauseParams: [] };

  let sql = "(e.visibility IN ('public', 'members') OR e.created_by = ?";
  const params = [user.id];

  if (access.memberMinistryIds.length > 0) {
    sql += " OR (e.visibility = 'ministry' AND e.ministry_id IN (?))";
    params.push(access.memberMinistryIds);
  }

  sql += ")";

  return { clauseSql: sql, clauseParams: params };
};

/* ---------------------------------------------------------------- */
/* Mapping                                                           */
/* ---------------------------------------------------------------- */

const fullName = (first, last) => `${first || ""} ${last || ""}`.trim();

const toEvent = (row, occurrence, extras = {}) => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  category: row.category,
  description: row.description,
  location: row.location,
  startAt: occurrence.start,
  endAt: occurrence.end,
  firstStartAt: row.start_at,
  firstEndAt: row.end_at,
  imageUrl: row.image_url,
  visibility: row.visibility,
  ministryId: row.ministry_id,
  ministryName: row.ministry_name || "",
  repeatType: row.repeat_type,
  repeatUntil: row.repeat_until,
  featured: Boolean(row.featured),
  status: row.status,
  cancelled: row.status === "cancelled",
  ongoing: occurrence.ongoing,
  ended: occurrence.ended,
  ...extras,
});

/* What the public website is allowed to know about an event. */
const toPublic = (row, occurrence) => ({
  slug: row.slug,
  title: row.title,
  category: row.category,
  description: row.description,
  location: row.location,
  startAt: occurrence.start,
  endAt: occurrence.end,
  imageUrl: row.image_url,
  ministryName: row.ministry_name || "",
  repeatType: row.repeat_type,
  repeatUntil: row.repeat_until,
  featured: Boolean(row.featured),
  cancelled: row.status === "cancelled",
  ongoing: occurrence.ongoing,
  ended: occurrence.ended,
});

const withOccurrences = (rows, nowStr) =>
  rows
    .map((row) => ({ row, occurrence: time.computeOccurrence(row, nowStr) }))
    .filter((entry) => !entry.occurrence.ended)
    .sort((a, b) => a.occurrence.start.localeCompare(b.occurrence.start));

/* ---------------------------------------------------------------- */
/* Public website                                                    */
/* ---------------------------------------------------------------- */

const publicClause = { clauseSql: "e.visibility = 'public'", clauseParams: [] };

const listPublic = async ({ limit }) => {
  const size = Math.min(50, Math.max(1, Number(limit) || 12));
  const nowStr = time.nowInChurch();

  const rows = await model.findUpcoming({ ...publicClause, nowStr, search: "" });

  return withOccurrences(rows, nowStr)
    .slice(0, size)
    .map((entry) => toPublic(entry.row, entry.occurrence));
};

const getPublicFeatured = async () => {
  const nowStr = time.nowInChurch();

  const rows = await model.findUpcoming({ ...publicClause, nowStr, search: "" });

  const upcoming = withOccurrences(
    rows.filter((row) => row.status === "published"),
    nowStr
  );

  const chosen =
    upcoming.find((entry) => entry.row.featured) || upcoming[0] || null;

  return chosen ? toPublic(chosen.row, chosen.occurrence) : null;
};

const getPublicBySlug = async (slug) => {
  const row = await model.findBySlug(String(slug || ""));

  if (!row || row.visibility !== "public") {
    throw httpError("Event not found.", 404);
  }

  return toPublic(row, time.computeOccurrence(row, time.nowInChurch()));
};

/* ---------------------------------------------------------------- */
/* Dashboard                                                         */
/* ---------------------------------------------------------------- */

const listForUser = async (user, { scope, search, page }) => {
  const access = await getAccess(user);
  const nowStr = time.nowInChurch();
  const clause = viewerClause(user, access);
  const term = String(search || "").trim();
  const pageNumber = Math.max(1, Number(page) || 1);
  const offset = (pageNumber - 1) * PAGE_SIZE;

  const extras = (row) => ({
    canManage: canManage(row, user, access),
    createdBy: fullName(row.creator_first_name, row.creator_last_name),
  });

  if (scope === "past") {
    const { rows, total } = await model.findPast({
      ...clause,
      nowStr,
      search: term,
      limit: PAGE_SIZE,
      offset,
    });

    return {
      items: rows.map((row) =>
        toEvent(row, time.lastOccurrence(row), extras(row))
      ),
      total,
      hasMore: offset + rows.length < total,
    };
  }

  const rows = await model.findUpcoming({ ...clause, nowStr, search: term });
  const all = withOccurrences(rows, nowStr);
  const slice = all.slice(offset, offset + PAGE_SIZE);

  return {
    items: slice.map((entry) =>
      toEvent(entry.row, entry.occurrence, extras(entry.row))
    ),
    total: all.length,
    hasMore: offset + slice.length < all.length,
  };
};

const getOptions = async (user) => {
  const access = await getAccess(user);

  if (!access.isStaff && !access.isLeader) {
    throw httpError("Access denied.", 403);
  }

  const ministries = await model.getMinistries(
    access.isStaff ? null : access.ledMinistryIds
  );

  if (access.isLeader && ministries.length === 0) {
    throw httpError(
      "You are not assigned as the leader of an active ministry.",
      403
    );
  }

  return {
    role: access.isStaff ? "staff" : "leader",
    canPublic: access.isStaff,
    canFeature: access.isStaff,
    categories: CATEGORIES,
    ministries: ministries.map((ministry) => ({
      id: ministry.id,
      name: ministry.name,
    })),
  };
};

const getForEdit = async (user, id) => {
  const access = await getAccess(user);
  const row = await model.findById(id);

  if (!row) throw httpError("Event not found.", 404);

  if (!canManage(row, user, access)) {
    throw httpError("You can't edit this event.", 403);
  }

  return toEvent(row, time.computeOccurrence(row, time.nowInChurch()), {
    canManage: true,
  });
};

/* ---------------------------------------------------------------- */
/* Validation                                                        */
/* ---------------------------------------------------------------- */

const parseDateTime = (value) => {
  const match = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})(?::\d{2})?$/.exec(
    String(value || "").trim()
  );

  if (!match) return null;

  const normalized = `${match[1]} ${match[2]}:00`;
  const date = time.parseNaive(normalized);

  return date && time.formatNaive(date) === normalized ? normalized : null;
};

const parseDateOnly = (value) => {
  const text = String(value || "").trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return null;

  const date = time.parseNaive(`${text} 00:00:00`);

  return date && time.formatNaive(date) === `${text} 00:00:00` ? text : null;
};

const parseInput = async (body, user, access) => {
  const title = clean(body.title);
  const description = clean(body.description);
  const location = clean(body.location);
  const category = clean(body.category) || "Other";

  if (title.length < 3 || title.length > 150) {
    throw httpError("The title must be between 3 and 150 characters.", 400);
  }

  if (description.length < 10 || description.length > 5000) {
    throw httpError(
      "The description must be between 10 and 5000 characters.",
      400
    );
  }

  if (location.length < 2 || location.length > 255) {
    throw httpError("The location must be between 2 and 255 characters.", 400);
  }

  if (!CATEGORIES.includes(category)) {
    throw httpError("Choose a valid category.", 400);
  }

  const startAt = parseDateTime(body.startAt);

  if (!startAt) throw httpError("Enter a valid start date and time.", 400);

  let endAt = null;

  if (clean(body.endAt)) {
    endAt = parseDateTime(body.endAt);

    if (!endAt) throw httpError("Enter a valid end date and time.", 400);

    if (endAt <= startAt) {
      throw httpError("The end time must be after the start time.", 400);
    }
  }

  const visibility = clean(body.visibility) || "public";

  if (!VISIBILITIES.includes(visibility)) {
    throw httpError("Choose who can see this event.", 400);
  }

  if (access.isLeader && visibility === "public") {
    throw httpError(
      "Only pastors and administrators can publish events on the public website.",
      403
    );
  }

  const repeatType = clean(body.repeatType) === "weekly" ? "weekly" : "none";

  let repeatUntil = null;

  if (repeatType === "weekly" && clean(body.repeatUntil)) {
    repeatUntil = parseDateOnly(body.repeatUntil);

    if (!repeatUntil) {
      throw httpError("Enter a valid date for the last repeat.", 400);
    }

    if (repeatUntil < startAt.slice(0, 10)) {
      throw httpError(
        "The last repeat can't be before the first date.",
        400
      );
    }
  }

  let ministryId = null;

  if (clean(body.ministryId)) {
    ministryId = Number(body.ministryId);

    if (!Number.isInteger(ministryId) || ministryId < 1) {
      throw httpError("Choose a valid ministry.", 400);
    }
  }

  if (access.isLeader) {
    if (!ministryId) {
      throw httpError("Choose one of the ministries you lead.", 400);
    }

    if (!access.ledMinistryIds.includes(ministryId)) {
      throw httpError("You can only add events for ministries you lead.", 403);
    }
  }

  if (visibility === "ministry" && !ministryId) {
    throw httpError("Choose the ministry for a ministry-only event.", 400);
  }

  if (ministryId && access.isStaff) {
    const found = await model.getMinistries([ministryId]);

    if (found.length === 0) throw httpError("That ministry was not found.", 400);
  }

  const wantsFeatured = body.featured === true || body.featured === "true";

  return {
    title,
    category,
    description,
    location,
    startAt,
    endAt,
    visibility,
    ministryId,
    repeatType,
    repeatUntil,
    // Only staff can feature an event on the homepage, and only public ones.
    featured: Boolean(access.isStaff && wantsFeatured && visibility === "public"),
  };
};

/* ---------------------------------------------------------------- */
/* Images and slugs                                                  */
/* ---------------------------------------------------------------- */

const getCloudinaryPublicId = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== "string") return null;

  try {
    const url = new URL(imageUrl);
    const marker = "/upload/";
    const index = url.pathname.indexOf(marker);

    if (index === -1) return null;

    const path = url.pathname
      .substring(index + marker.length)
      .replace(/^v\d+\//, "")
      .replace(/\.[^/.]+$/, "");

    return decodeURIComponent(path);
  } catch {
    return null;
  }
};

const removeStoredImage = async (imageUrl) => {
  const publicId = getCloudinaryPublicId(imageUrl);

  if (!publicId) return;

  try {
    await deleteImage(publicId);
  } catch (error) {
    console.error("Failed to delete old event image:", error.message);
  }
};

const slugify = (text) =>
  String(text)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "event";

const makeSlug = async (title) => {
  const base = slugify(title);

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const slug = `${base}-${crypto.randomBytes(3).toString("hex")}`;

    if (!(await model.slugExists(slug))) return slug;
  }

  return `${base}-${crypto.randomBytes(6).toString("hex")}`;
};

/* ---------------------------------------------------------------- */
/* Changes                                                           */
/* ---------------------------------------------------------------- */

const createEvent = async (user, body, file) => {
  const access = await getAccess(user);

  if (!access.isStaff && !access.isLeader) {
    throw httpError("Access denied.", 403);
  }

  const data = await parseInput(body, user, access);

  let uploaded = null;

  if (file) {
    uploaded = await uploadImage(file.buffer, { folder: "chms/events" });
  }

  try {
    const slug = await makeSlug(data.title);

    const id = await model.insertEvent({
      ...data,
      slug,
      imageUrl: uploaded?.secureUrl || null,
      createdBy: user.id,
    });

    return { id, slug };
  } catch (error) {
    if (uploaded?.publicId) {
      await deleteImage(uploaded.publicId).catch(() => {});
    }

    throw error;
  }
};

const updateEvent = async (user, id, body, file) => {
  const access = await getAccess(user);
  const existing = await model.findById(id);

  if (!existing) throw httpError("Event not found.", 404);

  if (!canManage(existing, user, access)) {
    throw httpError("You can't edit this event.", 403);
  }

  const data = await parseInput(body, user, access);

  const removeRequested =
    body.removeImage === true || body.removeImage === "true";

  let imageUrl = existing.image_url;
  let uploaded = null;

  if (file) {
    uploaded = await uploadImage(file.buffer, { folder: "chms/events" });
    imageUrl = uploaded.secureUrl;
  } else if (removeRequested) {
    imageUrl = null;
  }

  try {
    await model.updateEvent(id, { ...data, imageUrl });
  } catch (error) {
    if (uploaded?.publicId) {
      await deleteImage(uploaded.publicId).catch(() => {});
    }

    throw error;
  }

  if (existing.image_url && (uploaded || removeRequested)) {
    await removeStoredImage(existing.image_url);
  }

  return { id, slug: existing.slug };
};

const changeStatus = async (user, id, status) => {
  const access = await getAccess(user);
  const existing = await model.findById(id);

  if (!existing) throw httpError("Event not found.", 404);

  if (!canManage(existing, user, access)) {
    throw httpError("You can't change this event.", 403);
  }

  await model.setStatus(id, status);
};

const deleteEvent = async (user, id) => {
  const access = await getAccess(user);
  const existing = await model.findById(id);

  if (!existing) throw httpError("Event not found.", 404);

  if (!canManage(existing, user, access)) {
    throw httpError("You can't delete this event.", 403);
  }

  await model.softDelete(id);
};

module.exports = {
  listPublic,
  getPublicFeatured,
  getPublicBySlug,
  listForUser,
  getOptions,
  getForEdit,
  createEvent,
  updateEvent,
  changeStatus,
  deleteEvent,
};