const model = require("../models/announcementModel");
const { sendEmail } = require("./emailService");
const announcementEmail = require("../templates/emails/announcementEmail");
const env = require("../config/env");

const ROLE_ADMIN = 1;
const ROLE_PASTOR = 2;
const ROLE_LEADER = 4;

const MAX_RECIPIENTS = Number(process.env.ANNOUNCEMENT_MAX_RECIPIENTS) || 300;
const DAILY_LIMIT = Number(process.env.ANNOUNCEMENT_DAILY_LIMIT) || 400;
const SEND_DELAY_MS = Number(process.env.ANNOUNCEMENT_SEND_DELAY_MS) || 1000;
const BATCH_SIZE = 10;
const MEMBER_PAGE_SIZE = 25;
const PAGE_SIZE = 20;

// Announcements currently being sent by this server process.
const running = new Set();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const httpError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const churchName = () => process.env.CHURCH_NAME || "our church";

const fullName = (first, last) => `${first || ""} ${last || ""}`.trim();

const normalizeDelivery = (value) =>
  ["both", "dashboard", "email"].includes(value) ? value : "both";

/*
 * Turns a raw mail-server error into a short, readable reason.
 * The raw error stays in the database for troubleshooting.
 */
const friendlyReason = (raw) => {
  const text = String(raw || "").toLowerCase();

  if (!text) return "";

  if (text.includes("not configured")) {
    return "Email sending is not set up on the server.";
  }

  if (/auth|535|credentials|invalid login|username and password/.test(text)) {
    return "The server could not sign in to the email account.";
  }

  if (/quota|rate limit|too many|452|421|daily/.test(text)) {
    return "The sending limit was reached. Try again later.";
  }

  if (/timeout|timed out|econn|enotfound|network|socket/.test(text)) {
    return "The connection to the mail server failed. Try again.";
  }

  if (/invalid|recipient|mailbox|550|553|user unknown|no such user|rejected/.test(text)) {
    return "The mail server rejected this address. It may be misspelled or no longer exist.";
  }

  return "The email could not be delivered.";
};

const skippedReason = (row, delivery) => {
  if (delivery === "dashboard") return "";

  if (!row.email_verified_at) {
    return "Email not verified, so they only see it in the dashboard.";
  }

  if (Number(row.announcement_emails) === 0) {
    return "Turned off announcement emails. They still see it in the dashboard.";
  }

  return "No email was sent.";
};

/*
 * What this person is allowed to do.
 * Admin and Pastor: everyone. Ministry Leader: only the ministries they lead.
 */
const getScope = async (user) => {
  const roleId = Number(user.roleId);

  if (roleId === ROLE_ADMIN || roleId === ROLE_PASTOR) {
    return { unrestricted: true, led: null, ledMinistryIds: null };
  }

  if (roleId === ROLE_LEADER) {
    const led = await model.getLedMinistries(user.id);

    if (led.length === 0) {
      throw httpError(
        "You are not assigned as the leader of an active ministry.",
        403
      );
    }

    return {
      unrestricted: false,
      led,
      ledMinistryIds: led.map((ministry) => ministry.id),
    };
  }

  throw httpError("Access denied.", 403);
};

/*
 * Staff can manage any announcement; leaders only their own.
 */
const assertCanManage = async (user, id) => {
  const scope = await getScope(user);
  const announcement = await model.getAnnouncementBasic(id);

  if (!announcement) {
    throw httpError("Announcement not found.", 404);
  }

  if (!scope.unrestricted && announcement.created_by !== user.id) {
    throw httpError("Access denied.", 403);
  }

  return announcement;
};

const toIds = (value) =>
  Array.isArray(value)
    ? [
        ...new Set(
          value.map(Number).filter((id) => Number.isInteger(id) && id > 0)
        ),
      ]
    : [];

const normalizeAudience = (audience, scope) => {
  const type = audience?.type;

  if (!["everyone", "ministries", "members"].includes(type)) {
    throw httpError("Choose who should receive this announcement.", 400);
  }

  if (type === "everyone") {
    if (!scope.unrestricted) {
      throw httpError("You can only send to members of your ministries.", 403);
    }

    return { type };
  }

  if (type === "ministries") {
    const ministryIds = toIds(audience.ministryIds);

    if (ministryIds.length === 0) {
      throw httpError("Select at least one ministry.", 400);
    }

    if (
      !scope.unrestricted &&
      ministryIds.some((id) => !scope.ledMinistryIds.includes(id))
    ) {
      throw httpError("You can only send to ministries you lead.", 403);
    }

    return { type, ministryIds };
  }

  const memberIds = toIds(audience.memberIds);

  if (memberIds.length === 0) {
    throw httpError("Select at least one member.", 400);
  }

  if (memberIds.length > MAX_RECIPIENTS) {
    throw httpError(
      `You can select up to ${MAX_RECIPIENTS} members at a time.`,
      400
    );
  }

  return { type, memberIds };
};

const buildLabel = async (audience, reachCount) => {
  let label;

  if (audience.type === "everyone") {
    label = "Everyone";
  } else if (audience.type === "ministries") {
    const names = await model.getMinistryNames(audience.ministryIds);
    label = `Ministries: ${names.join(", ")}`;
  } else {
    label = `${reachCount} selected member${reachCount === 1 ? "" : "s"}`;
  }

  return label.length > 250 ? `${label.slice(0, 247)}...` : label;
};

/*
 * Works out who is reached and who also gets an email.
 *  - "dashboard": everyone reached, no emails
 *  - "both": everyone reached, email only to verified members who opted in
 *  - "email": only verified members who opted in
 */
const resolveAudience = async (user, audienceInput, deliveryInput) => {
  const delivery = normalizeDelivery(deliveryInput);
  const scope = await getScope(user);
  const audience = normalizeAudience(audienceInput, scope);

  const rows = await model.resolveRecipients({
    ...audience,
    delivery,
    restrictMinistryIds: scope.unrestricted ? null : scope.ledMinistryIds,
  });

  const people = rows.map((row) => {
    const verified = Boolean(row.email_verified_at);
    const optedIn = Number(row.announcement_emails) === 1;

    return {
      userId: row.user_id,
      verified,
      optedIn,
      emailOk: verified && optedIn,
    };
  });

  const wantsEmail = delivery !== "dashboard";

  const emailPeople = wantsEmail ? people.filter((p) => p.emailOk) : [];

  const optedOut = wantsEmail
    ? people.filter((p) => p.verified && !p.optedIn).length
    : 0;

  const unverified =
    delivery === "both" ? people.filter((p) => !p.verified).length : 0;

  const reach = delivery === "email" ? emailPeople : people;

  return { audience, delivery, people, reach, emailPeople, optedOut, unverified };
};

const getAudienceOptions = async (user) => {
  const scope = await getScope(user);
  const restrict = scope.unrestricted ? null : scope.ledMinistryIds;

  const [ministries, stats] = await Promise.all([
    model.getMinistries(restrict),
    model.getMemberStats({ restrictMinistryIds: restrict }),
  ]);

  return {
    role: scope.unrestricted ? "staff" : "leader",
    canSendToEveryone: scope.unrestricted,
    ministries: ministries.map((ministry) => ({
      id: ministry.id,
      name: ministry.name,
      memberCount: Number(ministry.member_count || 0),
    })),
    stats,
  };
};

const unavailableReason = (row, delivery) => {
  if (row.member_status !== "Active") {
    return "This member is marked inactive.";
  }

  if (row.is_active !== null && Number(row.is_active) === 0) {
    return "This account is disabled.";
  }

  return delivery === "email"
    ? "Email not verified yet. They need to confirm their 6-digit code first."
    : "This member cannot be reached right now.";
};

const searchMembers = async (user, { search, ministryId, page, delivery }) => {
  const scope = await getScope(user);
  const mode = normalizeDelivery(delivery);

  const pageNumber = Math.max(1, Number(page) || 1);
  const ministry = Number(ministryId) || null;

  if (
    ministry &&
    !scope.unrestricted &&
    !scope.ledMinistryIds.includes(ministry)
  ) {
    throw httpError("You can only browse ministries you lead.", 403);
  }

  const ministryIds = ministry
    ? [ministry]
    : scope.unrestricted
    ? null
    : scope.ledMinistryIds;

  const offset = (pageNumber - 1) * MEMBER_PAGE_SIZE;
  const term = String(search || "").trim();

  const { rows, total } = await model.searchMembers({
    search: term,
    ministryIds,
    limit: MEMBER_PAGE_SIZE,
    offset,
    delivery: mode,
  });

  let unavailable = [];

  if (term && pageNumber === 1) {
    const blocked = await model.searchIneligibleMembers({
      search: term,
      ministryIds,
      delivery: mode,
    });

    unavailable = blocked.map((row) => ({
      id: row.id,
      name: fullName(row.first_name, row.last_name),
      email: row.email,
      reason: unavailableReason(row, mode),
    }));
  }

  return {
    items: rows.map((row) => ({
      id: row.id,
      name: fullName(row.first_name, row.last_name),
      memberNumber: row.member_number || "",
      email: row.email,
    })),
    total,
    hasMore: offset + rows.length < total,
    unavailable,
  };
};

const previewAudience = async (user, audienceInput, deliveryInput) => {
  const resolved = await resolveAudience(user, audienceInput, deliveryInput);

  return {
    delivery: resolved.delivery,
    reach: resolved.reach.length,
    emails: resolved.emailPeople.length,
    optedOut: resolved.optedOut,
    unverified: resolved.unverified,
    maxRecipients: MAX_RECIPIENTS,
    tooMany: resolved.emailPeople.length > MAX_RECIPIENTS,
  };
};

const sendTest = async (user, { subject, message }) => {
  await getScope(user);

  const me = await model.getUserContact(user.id);

  if (!me) {
    throw httpError("Account not found.", 404);
  }

  const content = announcementEmail({
    firstName: me.first_name,
    subject: `[Test] ${subject}`,
    message,
    senderName: fullName(me.first_name, me.last_name),
    senderRole: "",
    churchName: churchName(),
    settingsUrl: `${env.FRONTEND_URL}/dashboard/settings`,
    isTest: true,
  });

  try {
    await sendEmail({
      to: me.email,
      subject: content.subject,
      text: content.text,
      html: content.html,
    });
  } catch (error) {
    console.error("Announcement test email failed:", error.message);
    throw httpError("We couldn't send the test email. Please try again.", 502);
  }
};

/*
 * Temporary problems (dropped connection, timeout, 4xx server reply)
 * are worth retrying. Permanent ones (rejected address) are not.
 */
const isTransient = (error) => {
  const code = String(error?.code || "").toUpperCase();
  const responseCode = Number(error?.responseCode || 0);

  if (
    [
      "ETIMEDOUT",
      "ECONNECTION",
      "ECONNRESET",
      "ESOCKET",
      "EDNS",
      "ENOTFOUND",
      "EAI_AGAIN",
    ].includes(code)
  ) {
    return true;
  }

  return responseCode >= 400 && responseCode < 500;
};

const sendWithRetry = async (payload, attempts = 3) => {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await sendEmail(payload);
    } catch (error) {
      lastError = error;

      if (!isTransient(error) || attempt === attempts) break;

      await sleep(attempt * 3000);
    }
  }

  throw lastError;
};

const processAnnouncement = async (announcementId) => {
  if (running.has(announcementId)) return;

  running.add(announcementId);

  try {
    const announcement = await model.getAnnouncementForSend(announcementId);

    if (!announcement) return;

    const senderName = fullName(
      announcement.sender_first_name,
      announcement.sender_last_name
    );

    const settingsUrl = `${env.FRONTEND_URL}/dashboard/settings`;

    let batch = await model.getPendingBatch(announcementId, BATCH_SIZE);

    while (batch.length > 0) {
      for (const recipient of batch) {
        try {
          const content = announcementEmail({
            firstName: recipient.first_name,
            subject: announcement.subject,
            message: announcement.message,
            senderName,
            senderRole: announcement.sender_role,
            churchName: churchName(),
            settingsUrl,
          });

          await sendWithRetry({
            to: recipient.email,
            subject: content.subject,
            text: content.text,
            html: content.html,
            replyTo: announcement.sender_email
              ? { name: senderName, address: announcement.sender_email }
              : undefined,
          });

          await model.markRecipient(recipient.id, true);
        } catch (error) {
          const detail = `${error.code ? `${error.code}: ` : ""}${error.message}`;

          await model.markRecipient(recipient.id, false, detail);

          console.error(
            `Announcement #${announcementId} failed for recipient ${recipient.id}:`,
            detail
          );
        }

        await sleep(SEND_DELAY_MS);
      }

      await model.refreshCounts(announcementId);

      batch = await model.getPendingBatch(announcementId, BATCH_SIZE);
    }

    const counts = await model.refreshCounts(announcementId);

    const status =
      counts.failed === 0 ? "sent" : counts.sent === 0 ? "failed" : "partial";

    await model.finishAnnouncement(announcementId, status);
  } catch (error) {
    console.error(
      `Announcement #${announcementId} processing error:`,
      error.message
    );
  } finally {
    running.delete(announcementId);
  }
};

const createAnnouncement = async (
  user,
  { subject, message, audience, delivery }
) => {
  const resolved = await resolveAudience(user, audience, delivery);
  const mode = resolved.delivery;

  if (resolved.reach.length === 0) {
    throw httpError(
      mode === "email"
        ? "There are no eligible recipients. Members need a verified email and must not have opted out."
        : "There are no active members in this audience.",
      400
    );
  }

  if (resolved.emailPeople.length > MAX_RECIPIENTS) {
    throw httpError(
      `This would email ${resolved.emailPeople.length} people. The limit is ${MAX_RECIPIENTS} per announcement. Send it in smaller groups, or choose "Dashboard only".`,
      400
    );
  }

  if (resolved.emailPeople.length > 0) {
    const plannedToday = await model.countPlannedToday();

    if (plannedToday + resolved.emailPeople.length > DAILY_LIMIT) {
      const remaining = Math.max(0, DAILY_LIMIT - plannedToday);

      throw httpError(
        `The daily email limit would be exceeded. You can email about ${remaining} more people today. "Dashboard only" has no limit.`,
        429
      );
    }
  }

  const recipients =
    mode === "email"
      ? resolved.emailPeople.map((person) => ({
          userId: person.userId,
          emailStatus: "pending",
          read: false,
        }))
      : resolved.people.map((person) => ({
          userId: person.userId,
          emailStatus: mode === "both" && person.emailOk ? "pending" : "skipped",
          // The sender does not need to be notified about their own message.
          read: person.userId === user.id,
        }));

  const emailTotal = recipients.filter(
    (recipient) => recipient.emailStatus === "pending"
  ).length;

  const audienceLabel = await buildLabel(
    resolved.audience,
    resolved.reach.length
  );

  const id = await model.createAnnouncementWithRecipients({
    createdBy: user.id,
    subject,
    message,
    audienceLabel,
    delivery: mode,
    recipients,
    emailTotal,
    skippedOptedOut: resolved.optedOut,
  });

  // Emails continue in the background. The dashboard copy is already live.
  if (emailTotal > 0) {
    processAnnouncement(id);
  }

  return {
    id,
    delivery: mode,
    total: resolved.reach.length,
    emails: emailTotal,
    optedOut: resolved.optedOut,
  };
};

const retryAnnouncement = async (user, id) => {
  await assertCanManage(user, id);

  if (running.has(id)) {
    throw httpError("This announcement is still being sent.", 409);
  }

  await model.resetFailedToPending(id);

  processAnnouncement(id);
};

const retryRecipient = async (user, id, recipientId) => {
  await assertCanManage(user, id);

  if (running.has(id)) {
    throw httpError("This announcement is still being sent.", 409);
  }

  const changed = await model.resetRecipientToPending(id, recipientId);

  if (!changed) {
    throw httpError("This email is not waiting for a retry.", 400);
  }

  processAnnouncement(id);
};

const toSummary = (row) => {
  const emailTotal = Number(row.email_total || 0);

  const pending = Math.max(
    0,
    emailTotal - row.sent_count - row.failed_count
  );

  return {
    id: row.id,
    subject: row.subject,
    message: row.message,
    audience: row.audience_label,
    delivery: row.delivery,
    status: row.status,
    total: row.total_recipients,
    emailTotal,
    sent: row.sent_count,
    failed: row.failed_count,
    pending,
    optedOut: row.skipped_opted_out,
    readCount: Number(row.read_count || 0),
    sender: fullName(row.first_name, row.last_name),
    createdAt: row.created_at,
    completedAt: row.completed_at,
    canRetry: !running.has(row.id) && pending + row.failed_count > 0,
  };
};

const listAnnouncements = async (user, { search, page } = {}) => {
  const scope = await getScope(user);

  const pageNumber = Math.max(1, Number(page) || 1);
  const offset = (pageNumber - 1) * PAGE_SIZE;

  const { rows, total } = await model.listAnnouncements({
    createdBy: scope.unrestricted ? null : user.id,
    search: String(search || "").trim(),
    limit: PAGE_SIZE,
    offset,
  });

  return {
    items: rows.map(toSummary),
    total,
    hasMore: offset + rows.length < total,
  };
};

const getAnnouncementDetails = async (user, id) => {
  await assertCanManage(user, id);

  const row = await model.getAnnouncementById(id);

  if (!row) {
    throw httpError("Announcement not found.", 404);
  }

  const recipientRows = await model.getRecipients(id);

  const recipients = recipientRows.map((recipient) => ({
    id: recipient.id,
    name: fullName(recipient.first_name, recipient.last_name),
    email: recipient.email,
    status: recipient.status,
    reason:
      recipient.status === "failed"
        ? friendlyReason(recipient.error)
        : recipient.status === "skipped"
        ? skippedReason(recipient, row.delivery)
        : "",
    sentAt: recipient.sent_at,
    read: Boolean(recipient.read_at),
    readAt: recipient.read_at,
  }));

  const count = (status) =>
    recipients.filter((recipient) => recipient.status === status).length;

  const sent = count("sent");
  const failed = count("failed");
  const pending = count("pending");
  const skipped = count("skipped");
  const readCount = recipients.filter((recipient) => recipient.read).length;
  const isRunning = running.has(id);

  return {
    ...toSummary(row),
    sent,
    failed,
    pending,
    skipped,
    readCount,
    isRunning,
    canRetry: !isRunning && failed + pending > 0,
    recipients,
  };
};

const deleteAnnouncement = async (user, id) => {
  await assertCanManage(user, id);

  if (running.has(id)) {
    throw httpError(
      "This announcement is still being sent. Please wait until it finishes.",
      409
    );
  }

  await model.softDeleteAnnouncement(id);
};

module.exports = {
  getAudienceOptions,
  searchMembers,
  previewAudience,
  sendTest,
  createAnnouncement,
  retryAnnouncement,
  retryRecipient,
  listAnnouncements,
  getAnnouncementDetails,
  deleteAnnouncement,
};