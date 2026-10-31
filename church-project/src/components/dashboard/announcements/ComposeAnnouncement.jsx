"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Bell,
  Loader2,
  Mail,
  Megaphone,
  Send,
  Users,
} from "lucide-react";

import MemberPicker from "./MemberPicker";
import {
  getAudienceOptions,
  previewAudience,
  createAnnouncement,
  sendTestAnnouncement,
} from "@/lib/announcementApi";

const MAX_MESSAGE = 5000;

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10";

const DELIVERY_OPTIONS = [
  {
    value: "both",
    label: "Dashboard + email",
    description: "Shown in each member's dashboard and sent by email too.",
    icon: Megaphone,
  },
  {
    value: "dashboard",
    label: "Dashboard only",
    description:
      "Shown in the dashboard and notification bell. No emails are sent.",
    icon: Bell,
  },
  {
    value: "email",
    label: "Email only",
    description: "Sent by email. It does not appear in the dashboard.",
    icon: Mail,
  },
];

const people = (count) => (count === 1 ? "person" : "people");

function statsNote(stats, delivery) {
  if (!stats) return "";

  const reachable =
    delivery === "email" ? stats.active - stats.notVerified : stats.active;

  const parts = [];

  if (reachable < stats.total) {
    parts.push(
      `${reachable} of ${stats.total} members can ${
        delivery === "email"
          ? "receive announcement emails"
          : "see announcements in the dashboard"
      }.`
    );
  }

  if (delivery !== "dashboard" && stats.notVerified > 0) {
    parts.push(
      delivery === "both"
        ? `${stats.notVerified} ${
            stats.notVerified === 1 ? "has" : "have"
          } not verified their email and will only see it in the dashboard.`
        : `${stats.notVerified} ${
            stats.notVerified === 1 ? "has" : "have"
          } not verified their email.`
    );
  }

  if (stats.inactive > 0) {
    parts.push(
      `${stats.inactive} ${stats.inactive === 1 ? "is" : "are"} inactive.`
    );
  }

  return parts.join(" ");
}

export default function ComposeAnnouncement({ onSent }) {
  const [options, setOptions] = useState(null);
  const [optionsError, setOptionsError] = useState("");

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [delivery, setDelivery] = useState("both");
  const [audienceType, setAudienceType] = useState("everyone");
  const [ministryIds, setMinistryIds] = useState([]);
  const [members, setMembers] = useState([]);

  const [preview, setPreview] = useState({
    loading: false,
    data: null,
    error: "",
  });

  const [confirming, setConfirming] = useState(false);
  const [sending, setSending] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let cancelled = false;

    getAudienceOptions()
      .then((data) => {
        if (cancelled) return;

        setOptions(data);

        if (data.role === "leader") {
          setAudienceType("ministries");
          setMinistryIds(data.ministries.map((ministry) => ministry.id));
        }
      })
      .catch((err) => {
        if (!cancelled) setOptionsError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const isLeader = options?.role === "leader";
  const singleMinistry = isLeader && options.ministries.length === 1;

  const audience = useMemo(() => {
    if (audienceType === "everyone") return { type: "everyone" };

    if (audienceType === "ministries") {
      return ministryIds.length > 0
        ? { type: "ministries", ministryIds }
        : null;
    }

    return members.length > 0
      ? { type: "members", memberIds: members.map((member) => member.id) }
      : null;
  }, [audienceType, ministryIds, members]);

  useEffect(() => {
    setConfirming(false);

    if (!audience) {
      setPreview({ loading: false, data: null, error: "" });
      return;
    }

    let cancelled = false;

    setPreview((current) => ({ ...current, loading: true, error: "" }));

    const timer = setTimeout(async () => {
      try {
        const data = await previewAudience(audience, delivery);
        if (!cancelled) setPreview({ loading: false, data, error: "" });
      } catch (err) {
        if (!cancelled) {
          setPreview({ loading: false, data: null, error: err.message });
        }
      }
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [audience, delivery]);

  const choices = isLeader
    ? [
        {
          value: "ministries",
          label: singleMinistry
            ? `All members of ${options.ministries[0].name}`
            : "All members of my ministries",
        },
        { value: "members", label: "Selected members" },
      ]
    : [
        { value: "everyone", label: "Everyone" },
        { value: "ministries", label: "Selected ministries" },
        { value: "members", label: "Selected members" },
      ];

  function toggleMinistry(id) {
    setMinistryIds((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id]
    );
  }

  const data = preview.data;
  const reached = data ? (delivery === "email" ? data.emails : data.reach) : 0;

  const messageOk = message.trim().length >= 10;
  const subjectOk = subject.trim().length > 0;

  const canSend =
    subjectOk &&
    messageOk &&
    reached > 0 &&
    !data?.tooMany &&
    !preview.loading &&
    !sending;

  async function handleTest() {
    if (testing) return;

    setError("");
    setNotice("");

    if (!subjectOk || !messageOk) {
      setError("Enter a subject and a message of at least 10 characters first.");
      return;
    }

    setTesting(true);

    try {
      await sendTestAnnouncement({
        subject: subject.trim(),
        message: message.trim(),
      });
      setNotice("A test email was sent to your own address.");
    } catch (err) {
      setError(err.message);
    } finally {
      setTesting(false);
    }
  }

  async function handleSend() {
    if (!canSend) return;

    setSending(true);
    setError("");
    setNotice("");

    try {
      const result = await createAnnouncement({
        subject: subject.trim(),
        message: message.trim(),
        audience,
        delivery,
      });

      setSubject("");
      setMessage("");
      setMembers([]);
      setConfirming(false);

      if (!isLeader) {
        setAudienceType("everyone");
        setMinistryIds([]);
      }

      onSent(result);
    } catch (err) {
      setError(err.message);
      setConfirming(false);
    } finally {
      setSending(false);
    }
  }

  if (optionsError) {
    return (
      <div
        role="alert"
        className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700"
      >
        {optionsError}
      </div>
    );
  }

  if (!options) {
    return (
      <div
        role="status"
        className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-16 text-sm text-slate-500"
      >
        <Loader2 size={18} className="animate-spin" />
        Loading...
      </div>
    );
  }

  const note = statsNote(options.stats, delivery);

  return (
    <div className="space-y-6">
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
        >
          {notice}
        </div>
      )}

      {/* Audience */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <fieldset>
          <legend className="text-lg font-semibold text-slate-900">
            Who should receive it?
          </legend>

          <div className="mt-4 flex flex-wrap gap-2">
            {choices.map((choice) => (
              <label
                key={choice.value}
                className={`cursor-pointer rounded-xl border px-4 py-2.5 text-sm font-semibold transition focus-within:ring-2 focus-within:ring-indigo-500 ${
                  audienceType === choice.value
                    ? "border-slate-950 bg-slate-950 text-white"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  name="audience"
                  value={choice.value}
                  checked={audienceType === choice.value}
                  onChange={() => setAudienceType(choice.value)}
                  className="sr-only"
                />
                {choice.label}
              </label>
            ))}
          </div>
        </fieldset>

        {note && (
          <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-600">
            {note}
          </p>
        )}

        {audienceType === "ministries" && !singleMinistry && (
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium text-slate-700">
                Choose one or more ministries
              </p>

              <div className="flex gap-3 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() =>
                    setMinistryIds(options.ministries.map((m) => m.id))
                  }
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  Select all
                </button>
                <button
                  type="button"
                  onClick={() => setMinistryIds([])}
                  className="text-slate-500 hover:text-slate-700"
                >
                  Clear
                </button>
              </div>
            </div>

            {options.ministries.length === 0 ? (
              <p className="text-sm text-slate-500">
                There are no active ministries yet.
              </p>
            ) : (
              <ul className="grid gap-2 sm:grid-cols-2">
                {options.ministries.map((ministry) => (
                  <li key={ministry.id}>
                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-3.5 py-3 transition hover:bg-slate-50">
                      <input
                        type="checkbox"
                        checked={ministryIds.includes(ministry.id)}
                        onChange={() => toggleMinistry(ministry.id)}
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800">
                        {ministry.name}
                      </span>
                      <span className="text-xs text-slate-400">
                        {ministry.memberCount}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {audienceType === "members" && (
          <div className="mt-5">
            <MemberPicker
              selected={members}
              onChange={setMembers}
              ministries={options.ministries}
              delivery={delivery}
            />
          </div>
        )}
      </section>

      {/* Delivery */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <fieldset>
          <legend className="text-lg font-semibold text-slate-900">
            How should it be delivered?
          </legend>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {DELIVERY_OPTIONS.map((option) => {
              const Icon = option.icon;
              const selected = delivery === option.value;

              return (
                <label
                  key={option.value}
                  className={`flex cursor-pointer flex-col gap-2 rounded-xl border p-4 transition focus-within:ring-2 focus-within:ring-indigo-500 ${
                    selected
                      ? "border-slate-950 bg-slate-950 text-white"
                      : "border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value={option.value}
                    checked={selected}
                    onChange={() => setDelivery(option.value)}
                    className="sr-only"
                  />

                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <Icon size={16} aria-hidden="true" />
                    {option.label}
                  </span>

                  <span
                    className={`text-xs leading-5 ${
                      selected ? "text-white/75" : "text-slate-500"
                    }`}
                  >
                    {option.description}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {delivery !== "email" && (
          <p className="mt-3 text-xs text-slate-500">
            Members who turned off announcement emails still see announcements
            in their dashboard.
          </p>
        )}

        {/* Preview */}
        <div
          aria-live="polite"
          className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-sm"
        >
          {!audience && (
            <p className="text-slate-500">
              Choose at least one{" "}
              {audienceType === "members" ? "member" : "ministry"} to see how
              many people this will reach.
            </p>
          )}

          {audience && preview.loading && (
            <p className="flex items-center gap-2 text-slate-500">
              <Loader2 size={15} className="animate-spin" />
              Counting recipients...
            </p>
          )}

          {audience && preview.error && (
            <p className="text-red-600">{preview.error}</p>
          )}

          {audience && data && !preview.loading && (
            <div className="space-y-1">
              <p className="flex items-center gap-2 font-semibold text-slate-900">
                <Users size={16} aria-hidden="true" />
                {delivery === "email"
                  ? data.emails === 0
                    ? "No eligible recipients"
                    : `This will email ${data.emails} ${people(data.emails)}`
                  : data.reach === 0
                  ? "No eligible recipients"
                  : delivery === "dashboard"
                  ? `This will reach ${data.reach} ${people(data.reach)} in their dashboard`
                  : `This will reach ${data.reach} ${people(data.reach)} in the dashboard and email ${data.emails}`}
              </p>

              {data.optedOut > 0 && (
                <p className="text-slate-500">
                  {data.optedOut}{" "}
                  {data.optedOut === 1 ? "member has" : "members have"} turned
                  off announcement emails
                  {delivery === "both"
                    ? ". They will still see it in the dashboard."
                    : " and will be skipped."}
                </p>
              )}

              {data.unverified > 0 && (
                <p className="text-slate-500">
                  {data.unverified}{" "}
                  {data.unverified === 1 ? "member has" : "members have"} not
                  verified their email. They will only see it in the dashboard.
                </p>
              )}

              {data.tooMany && (
                <p className="flex items-start gap-2 text-red-600">
                  <AlertTriangle
                    size={16}
                    className="mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  The email limit is {data.maxRecipients} people per
                  announcement. Send it in smaller groups, or choose
                  &quot;Dashboard only&quot;.
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Message */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Message</h2>

        <div className="mt-5 space-y-5">
          <div>
            <label
              htmlFor="announcement-subject"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Subject <span className="text-red-500">*</span>
            </label>

            <input
              id="announcement-subject"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              maxLength={150}
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="announcement-message"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Message <span className="text-red-500">*</span>
            </label>

            <textarea
              id="announcement-message"
              rows={9}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              maxLength={MAX_MESSAGE}
              className={inputClass}
            />

            <p className="mt-1 flex justify-between text-xs text-slate-400">
              <span>Plain text. Line breaks are kept.</span>
              <span>
                {message.length} / {MAX_MESSAGE}
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Actions */}
      {confirming ? (
        <div
          role="alertdialog"
          aria-label="Confirm sending"
          className="rounded-2xl border border-amber-200 bg-amber-50 p-5"
        >
          <p className="text-sm font-semibold text-amber-900">
            Send this announcement to {reached} {people(reached)}?
          </p>

          <p className="mt-1 text-sm text-amber-800">
            {delivery === "dashboard"
              ? "It will appear in their dashboards. You can delete it later to remove it for everyone."
              : delivery === "both"
              ? `It will appear in their dashboards and ${data?.emails || 0} will also receive an email. Emails can't be recalled once they are sent.`
              : "Emails can't be recalled once they are sent."}
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={sending}
              className="rounded-xl border border-amber-300 bg-white px-5 py-2.5 text-sm font-semibold text-amber-900 transition hover:bg-amber-100 disabled:opacity-60"
            >
              Go back
            </button>

            <button
              type="button"
              onClick={handleSend}
              disabled={sending}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:opacity-60"
            >
              {sending && <Loader2 size={16} className="animate-spin" />}
              {sending ? "Sending..." : "Yes, send it"}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          {delivery !== "dashboard" && (
            <button
              type="button"
              onClick={handleTest}
              disabled={testing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {testing ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Mail size={16} aria-hidden="true" />
              )}
              {testing ? "Sending test..." : "Send test to myself"}
            </button>
          )}

          <button
            type="button"
            onClick={() => setConfirming(true)}
            disabled={!canSend}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send size={16} aria-hidden="true" />
            Send announcement
          </button>
        </div>
      )}
    </div>
  );
}