/**
 * Sample data for the dashboards, until the backend exists.
 *
 * Everything the dashboard pages show comes from here, already formatted for
 * the request's locale (Europe/Berlin time), so client components get plain
 * strings and server/client renders always match. Times are relative to "now",
 * so the demo always looks current. Replace `getBusinessData` /
 * `getCustomerData` with real queries later; the returned shapes stay the same.
 */

type Locale = "en" | "de";
type L = { en: string; de: string };

const TZ = "Europe/Berlin";
const DAY = 24 * 60;

export type Urgency = "today" | "week" | "flexible";
export type JobStatus = "new" | "proposed" | "booked" | "done";
export type CallOutcome = "job" | "waiting" | "calledBack";

/** Same shape as the onboarding answers (kept local: lib/onboarding reads cookies). */
type SampleProfileBase = {
  businessName?: string;
  trade?: string;
  employees?: string;
  phone?: string;
  mobile?: string;
  emergencyPhone?: string;
  street?: string;
  postcode?: string;
  city?: string;
  serviceRadius?: string;
  website?: string;
  days?: string[];
  start?: string;
  end?: string;
  services?: string[];
  customService?: string;
};

/* ── Time helpers ──────────────────────────────────────────── */

const WEEKDAY_INDEX: Record<string, number> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };

/** Calendar parts of a moment, in Berlin time. */
function berlin(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "0";
  return {
    utcDay: Date.UTC(Number(get("year")), Number(get("month")) - 1, Number(get("day"))),
    weekday: WEEKDAY_INDEX[get("weekday")] ?? 0,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

const toMinutes = (hhmm: string) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5));

function clock(totalMinutes: number) {
  const m = ((totalMinutes % DAY) + DAY) % DAY;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

/** Formatting bound to one request: "now", the locale and the Berlin calendar. */
function createClock(locale: Locale) {
  const now = new Date();
  const today = berlin(now);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto", style: "short" });
  const rtfDay = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const weekdayFmt = new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" });
  const dateFmt = new Intl.DateTimeFormat(locale, { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
  const longFmt = new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
  const yearFmt = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  /** UTC midnight of the Berlin day `offset` days from today. */
  const dayAt = (offset: number) => new Date(today.utcDay + offset * DAY * 60_000);

  /** "Today", "Tomorrow", or "Thu 16 Oct" for a day offset. */
  const dayLabel = (offset: number) =>
    Math.abs(offset) <= 1
      ? cap(rtfDay.format(offset, "day"))
      : (offset < -300 ? yearFmt : dateFmt).format(dayAt(offset));
  const offsetAgo = (minutesAgo: number) => -Math.ceil(Math.max(0, minutesAgo - today.minutes) / DAY);

  return {
    today,
    dayAt,
    dayLabel,
    /** Day label plus time, e.g. "Tomorrow, 08:00". */
    slot: (offset: number, time: string) => `${dayLabel(offset)}, ${time}`,
    weekday: (offset: number) => weekdayFmt.format(dayAt(offset)),
    longDate: (offset: number) => longFmt.format(dayAt(offset)),
    dayNumber: (offset: number) => dayAt(offset).getUTCDate(),
    /** "12 min ago" under a day, otherwise the date. */
    ago(minutesAgo: number) {
      if (minutesAgo < 1) return cap(rtf.format(0, "minute"));
      if (minutesAgo < 60) return rtf.format(-Math.round(minutesAgo), "minute");
      if (minutesAgo < DAY) return rtf.format(-Math.round(minutesAgo / 60), "hour");
      return dayLabel(offsetAgo(minutesAgo));
    },
    /** Time of day for something that happened `minutesAgo`. */
    timeAgo: (minutesAgo: number) => clock(today.minutes - minutesAgo),
    /** Day offset (0 = today, -1 = yesterday) for something `minutesAgo`. */
    offsetAgo,
    /** Has (offset, time) already passed? */
    isPast: (offset: number, time: string) => offset < 0 || (offset === 0 && toMinutes(time) <= today.minutes),
  };
}

const pick = (text: L, locale: Locale) => text[locale];

/* ── Business (Handwerker) data ────────────────────────────── */

type RawCustomer = { id: string; name: string; phone: string; street: string; city: string; since: number; note?: L };

const customers: RawCustomer[] = [
  { id: "c1", name: "Ralf Domke", phone: "+49 355 4718 220", street: "Sandower Str. 14", city: "Cottbus", since: 0 },
  { id: "c2", name: "Sabine Kowalski", phone: "+49 152 2390 4471", street: "Thiemstr. 22", city: "Cottbus", since: 0 },
  { id: "c3", name: "Marco Wendt", phone: "+49 170 8823 105", street: "Am Spreeufer 3", city: "Burg (Spreewald)", since: 0 },
  {
    id: "c4",
    name: "Ines Mattke",
    phone: "+49 355 2874 916",
    street: "Karl-Liebknecht-Str. 87",
    city: "Cottbus",
    since: 410,
    note: { en: "Ring twice, the bell upstairs is quiet.", de: "Zweimal klingeln, die Klingel oben ist leise." },
  },
  {
    id: "c5",
    name: "Uwe Pietsch",
    phone: "+49 3573 66 1290",
    street: "Bahnhofstr. 9",
    city: "Senftenberg",
    since: 690,
    note: { en: "Property manager, 6 rental flats. Invoice to the office.", de: "Hausverwaltung, 6 Mietwohnungen. Rechnung an das Büro." },
  },
  { id: "c6", name: "Katrin Schulze", phone: "+49 160 9145 382", street: "Straße der Jugend 112", city: "Cottbus", since: 120 },
  { id: "c7", name: "Dieter Lehmann", phone: "+49 3563 59 0187", street: "Lindenstr. 5", city: "Spremberg", since: 0 },
  { id: "c8", name: "Petra Zech", phone: "+49 175 3302 649", street: "Mühlenweg 18", city: "Peitz", since: 0 },
  {
    id: "c9",
    name: "Jörg Hentschel",
    phone: "+49 355 4920 733",
    street: "Berliner Str. 41",
    city: "Cottbus",
    since: 980,
    note: { en: "Prefers mornings. Dog in the yard.", de: "Lieber vormittags. Hund im Hof." },
  },
  { id: "c10", name: "Hannelore Krautz", phone: "+49 355 3811 054", street: "Ostrower Damm 6", city: "Cottbus", since: 1460 },
  {
    id: "c11",
    name: "Tobias Rademacher",
    phone: "+49 3562 69 4410",
    street: "Gubener Str. 27",
    city: "Forst (Lausitz)",
    since: 1800,
    note: { en: "Yearly check of the system in March.", de: "Jährliche Prüfung der Anlage im März." },
  },
];

type RawJob = {
  id: string;
  customer: string;
  title: L;
  problem: L;
  urgency: Urgency;
  status: JobStatus;
  source: "sms" | "voice";
  minutesAgo: number;
  /** Proposed or booked time: day offset from today + start time. */
  at?: { offset: number; time: string; minutes: number };
};

const jobs: RawJob[] = [
  {
    id: "j1",
    customer: "c1",
    title: { en: "Power out after the storm", de: "Stromausfall nach Gewitter" },
    problem: {
      en: "Half the house has no power since the storm last night. The main fuses look fine.",
      de: "Seit dem Gewitter gestern Abend hat das halbe Haus keinen Strom. Die Hauptsicherungen sehen okay aus.",
    },
    urgency: "today",
    status: "new",
    source: "sms",
    minutesAgo: 12,
  },
  {
    id: "j2",
    customer: "c2",
    title: { en: "Fuse trips with washing machine", de: "Sicherung fliegt bei Waschmaschine" },
    problem: {
      en: "The fuse trips every time the washing machine starts heating. Started last week.",
      de: "Die Sicherung fliegt jedes Mal, wenn die Waschmaschine anfängt zu heizen. Seit letzter Woche.",
    },
    urgency: "week",
    status: "new",
    source: "sms",
    minutesAgo: 48,
  },
  {
    id: "j3",
    customer: "c3",
    title: { en: "Wallbox in the garage", de: "Wallbox in der Garage" },
    problem: {
      en: "Would like an 11 kW wallbox installed in the garage. Fuse box is in the basement next to it.",
      de: "Hätte gern eine 11-kW-Wallbox in der Garage. Der Sicherungskasten ist im Keller direkt daneben.",
    },
    urgency: "flexible",
    status: "new",
    source: "voice",
    minutesAgo: 160,
  },
  {
    id: "j4",
    customer: "c4",
    title: { en: "Kitchen sockets without power", de: "Küchensteckdosen ohne Strom" },
    problem: {
      en: "Two sockets in the kitchen stopped working yesterday. Nothing else is affected.",
      de: "Zwei Steckdosen in der Küche gehen seit gestern nicht mehr. Sonst ist alles normal.",
    },
    urgency: "week",
    status: "proposed",
    source: "sms",
    minutesAgo: 300,
    at: { offset: 2, time: "10:00", minutes: 60 },
  },
  {
    id: "j5",
    customer: "c5",
    title: { en: "E-check before new tenants", de: "E-Check vor Mieterwechsel" },
    problem: {
      en: "E-check needed for a 3-room rental flat before the new tenants move in on the 1st.",
      de: "E-Check für eine 3-Zimmer-Mietwohnung, bevor die neuen Mieter zum Ersten einziehen.",
    },
    urgency: "flexible",
    status: "proposed",
    source: "sms",
    minutesAgo: DAY + 95,
    at: { offset: 3, time: "13:00", minutes: 120 },
  },
  {
    id: "j6",
    customer: "c6",
    title: { en: "Outdoor light flickers", de: "Außenlampe flackert" },
    problem: {
      en: "The light by the front door flickers and the switch gets warm.",
      de: "Die Lampe an der Haustür flackert und der Schalter wird warm.",
    },
    urgency: "week",
    status: "booked",
    source: "sms",
    minutesAgo: DAY + 230,
    at: { offset: 0, time: "13:30", minutes: 60 },
  },
  {
    id: "j7",
    customer: "c7",
    title: { en: "Quote for a new fuse box", de: "Angebot für neuen Verteiler" },
    problem: {
      en: "Old fuse box with screw-in fuses. Need a quote for a new distribution board.",
      de: "Alter Sicherungskasten mit Schraubsicherungen. Brauche ein Angebot für einen neuen Verteiler.",
    },
    urgency: "flexible",
    status: "booked",
    source: "voice",
    minutesAgo: 2 * DAY + 40,
    at: { offset: 1, time: "08:00", minutes: 90 },
  },
  {
    id: "j8",
    customer: "c8",
    title: { en: "Smoke detectors for 4 rooms", de: "Rauchmelder für 4 Zimmer" },
    problem: {
      en: "Smoke detectors for a 4-room flat, mounted and tested.",
      de: "Rauchmelder für eine 4-Zimmer-Wohnung, montiert und geprüft.",
    },
    urgency: "flexible",
    status: "booked",
    source: "sms",
    minutesAgo: 3 * DAY + 10,
    at: { offset: 2, time: "14:30", minutes: 90 },
  },
  {
    id: "j9",
    customer: "c9",
    title: { en: "Doorbell not working", de: "Klingel geht nicht" },
    problem: { en: "The doorbell stopped working, the button lights up but no sound.", de: "Die Klingel geht nicht mehr. Der Taster leuchtet, aber es klingelt nicht." },
    urgency: "week",
    status: "done",
    source: "sms",
    minutesAgo: 4 * DAY + 60,
    at: { offset: -1, time: "09:00", minutes: 60 },
  },
  {
    id: "j10",
    customer: "c10",
    title: { en: "Three spots in the hallway", de: "Drei Spots im Flur" },
    problem: { en: "Replace the hallway ceiling light with three LED spots.", de: "Die Flurlampe gegen drei LED-Spots tauschen." },
    urgency: "flexible",
    status: "done",
    source: "sms",
    minutesAgo: 6 * DAY,
    at: { offset: -2, time: "14:00", minutes: 120 },
  },
];

/** Booked work that didn't come through HandyPlan (regular customers). */
const extraEvents: { id: string; customer: string; title: L; offset: number; time: string; minutes: number }[] = [
  { id: "e1", customer: "c11", title: { en: "Yearly system check", de: "Jährliche Anlagenprüfung" }, offset: 0, time: "08:00", minutes: 150 },
  { id: "e2", customer: "c5", title: { en: "Stairwell lighting", de: "Treppenhausbeleuchtung" }, offset: 1, time: "13:00", minutes: 120 },
  { id: "e3", customer: "c9", title: { en: "Garden sockets", de: "Gartensteckdosen" }, offset: 3, time: "08:30", minutes: 120 },
  { id: "e4", customer: "c4", title: { en: "Ceiling light, bedroom", de: "Deckenlampe Schlafzimmer" }, offset: -3, time: "10:00", minutes: 60 },
  { id: "e5", customer: "c10", title: { en: "Cooker connection", de: "Herdanschluss" }, offset: 4, time: "09:00", minutes: 90 },
  { id: "e6", customer: "c11", title: { en: "Follow-up visit", de: "Nachtermin" }, offset: 8, time: "10:00", minutes: 60 },
];

/** Past work per customer (before HandyPlan), for the customer history. */
const pastWork: { customer: string; title: L; daysAgo: number }[] = [
  { customer: "c4", title: { en: "Ceiling light, bedroom", de: "Deckenlampe Schlafzimmer" }, daysAgo: 3 },
  { customer: "c5", title: { en: "Intercom, building B", de: "Gegensprechanlage, Haus B" }, daysAgo: 64 },
  { customer: "c9", title: { en: "New sockets, workshop", de: "Neue Steckdosen, Werkstatt" }, daysAgo: 210 },
  { customer: "c10", title: { en: "Cooker repair", de: "Herd repariert" }, daysAgo: 400 },
  { customer: "c11", title: { en: "Yearly system check", de: "Jährliche Anlagenprüfung" }, daysAgo: 365 },
];

type RawCall = { id: string; minutesAgo: number; customer?: string; phone?: string; outcome: CallOutcome; job?: string; ringSec: number; viaVoice?: boolean };

const calls: RawCall[] = [
  { id: "k1", minutesAgo: 13, customer: "c1", outcome: "job", job: "j1", ringSec: 21 },
  { id: "k2", minutesAgo: 27, phone: "+49 160 4471 902", outcome: "waiting", ringSec: 9 },
  { id: "k3", minutesAgo: 50, customer: "c2", outcome: "job", job: "j2", ringSec: 18 },
  { id: "k4", minutesAgo: 162, customer: "c3", outcome: "job", job: "j3", ringSec: 14, viaVoice: true },
  { id: "k5", minutesAgo: 190, phone: "+49 355 7739 118", outcome: "waiting", ringSec: 25 },
  { id: "k6", minutesAgo: 245, customer: "c11", outcome: "calledBack", ringSec: 30 },
  { id: "k7", minutesAgo: 302, customer: "c4", outcome: "job", job: "j4", ringSec: 16 },
  { id: "k8", minutesAgo: DAY + 97, customer: "c5", outcome: "job", job: "j5", ringSec: 22 },
  { id: "k9", minutesAgo: DAY + 180, phone: "+49 176 2208 551", outcome: "calledBack", ringSec: 12 },
  { id: "k10", minutesAgo: DAY + 232, customer: "c6", outcome: "job", job: "j6", ringSec: 19 },
  { id: "k11", minutesAgo: 2 * DAY + 42, customer: "c7", outcome: "job", job: "j7", ringSec: 27, viaVoice: true },
  { id: "k12", minutesAgo: 2 * DAY + 300, phone: "+49 3561 50 2276", outcome: "waiting", ringSec: 8 },
  { id: "k13", minutesAgo: 3 * DAY + 12, customer: "c8", outcome: "job", job: "j8", ringSec: 15 },
  { id: "k14", minutesAgo: 4 * DAY + 62, customer: "c9", outcome: "job", job: "j9", ringSec: 20 },
];

type RawMessage = { from: "auto" | "them" | "me"; minutesAgo: number; text?: L; kind?: "reply" | "confirm" };

const threads: { id: string; customer: string; job?: string; unread: number; messages: RawMessage[] }[] = [
  {
    id: "t1",
    customer: "c1",
    job: "j1",
    unread: 1,
    messages: [
      { from: "auto", minutesAgo: 13, kind: "reply" },
      {
        from: "them",
        minutesAgo: 12,
        text: {
          en: "Half the house has no power since the storm last night. Main fuses look fine. Sandower Str. 14.",
          de: "Seit dem Gewitter gestern hat das halbe Haus keinen Strom. Hauptsicherungen sehen okay aus. Sandower Str. 14.",
        },
      },
    ],
  },
  {
    id: "t2",
    customer: "c2",
    job: "j2",
    unread: 1,
    messages: [
      { from: "auto", minutesAgo: 50, kind: "reply" },
      {
        from: "them",
        minutesAgo: 48,
        text: { en: "Fuse trips whenever the washing machine heats up. Not urgent, but this week would be good.", de: "Die Sicherung fliegt, sobald die Waschmaschine heizt. Nicht dringend, aber diese Woche wäre gut." },
      },
    ],
  },
  {
    id: "t3",
    customer: "c4",
    job: "j4",
    unread: 0,
    messages: [
      { from: "auto", minutesAgo: 302, kind: "reply" },
      { from: "them", minutesAgo: 300, text: { en: "Two kitchen sockets stopped working yesterday.", de: "Zwei Steckdosen in der Küche gehen seit gestern nicht." } },
      { from: "me", minutesAgo: 240, text: { en: "I can come on {slot}. Does that work for you?", de: "Ich kann am {slot} kommen. Passt Ihnen das?" } },
    ],
  },
  {
    id: "t4",
    customer: "c6",
    job: "j6",
    unread: 0,
    messages: [
      { from: "auto", minutesAgo: DAY + 232, kind: "reply" },
      { from: "them", minutesAgo: DAY + 230, text: { en: "Front door light flickers and the switch gets warm.", de: "Lampe an der Haustür flackert, Schalter wird warm." } },
      { from: "me", minutesAgo: DAY + 120, text: { en: "Better not use that switch for now. I can come today at 13:30.", de: "Den Schalter bitte erstmal nicht benutzen. Ich kann heute um 13:30 kommen." } },
      { from: "them", minutesAgo: DAY + 110, text: { en: "Perfect, thank you!", de: "Perfekt, danke!" } },
      { from: "auto", minutesAgo: DAY + 110, kind: "confirm" },
    ],
  },
  {
    id: "t5",
    customer: "c9",
    job: "j9",
    unread: 0,
    messages: [
      { from: "auto", minutesAgo: 4 * DAY + 62, kind: "reply" },
      { from: "them", minutesAgo: 4 * DAY + 60, text: { en: "Doorbell is dead, the button still lights up.", de: "Klingel ist tot, der Taster leuchtet noch." } },
      { from: "auto", minutesAgo: 4 * DAY, kind: "confirm" },
      { from: "them", minutesAgo: DAY + 500, text: { en: "Works again, thanks for the quick help.", de: "Geht wieder, danke für die schnelle Hilfe." } },
    ],
  },
];

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter((w) => /^[A-Za-zÄÖÜäöü]/.test(w))
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");

export type JobCard = {
  id: string;
  customerId: string;
  name: string;
  initials: string;
  phone: string;
  address: string;
  title: string;
  problem: string;
  urgency: Urgency;
  status: JobStatus;
  source: "sms" | "voice";
  received: string;
  receivedTime: string;
  /** Proposed or booked time, e.g. "Tomorrow, 08:00". */
  when?: string;
};

export type CalendarEvent = {
  id: string;
  jobId?: string;
  title: string;
  name: string;
  address: string;
  dayKey: number;
  start: number;
  end: number;
  time: string;
  status: "upcoming" | "now" | "done";
  /** Booked through HandyPlan (from a job card). */
  fromJob: boolean;
};

export type CalendarDay = { key: number; weekday: string; day: number; label: string; isToday: boolean; weekdayIndex: number };

export type CallEntry = {
  id: string;
  name?: string;
  initials: string;
  phone: string;
  time: string;
  ago: string;
  group: "today" | "yesterday" | "earlier";
  dayLabel: string;
  outcome: CallOutcome;
  jobId?: string;
  jobTitle?: string;
  ringSec: number;
  viaVoice: boolean;
};

export type CustomerEntry = {
  id: string;
  name: string;
  initials: string;
  phone: string;
  address: string;
  note?: string;
  jobs: number;
  last: string;
  lastMinutes: number;
  isNew: boolean;
  open: number;
  history: { title: string; date: string; status: JobStatus | "past" }[];
};

export type Thread = {
  id: string;
  name: string;
  initials: string;
  subtitle: string;
  jobId?: string;
  unread: number;
  last: string;
  preview: string;
  messages: { id: string; from: "auto" | "them" | "me"; text: string; time: string }[];
};

/** Message templates the mock threads need from the translation files. */
export type MessageTemplates = { reply: string; confirm: (when: string) => string };

/**
 * Everything the business dashboard shows. `workStart`/`workEnd` come from the
 * onboarding hours; free slots are suggested only inside them.
 */
export function getBusinessData(
  locale: Locale,
  templates: MessageTemplates,
  hours: { start?: string; end?: string; days?: string[] } = {},
) {
  const c = createClock(locale);
  const byId = new Map(customers.map((x) => [x.id, x]));
  const cust = (id: string) => byId.get(id)!;
  const address = (x: RawCustomer) => `${x.street}, ${x.city}`;

  const jobCards: JobCard[] = jobs.map((j) => {
    const x = cust(j.customer);
    return {
      id: j.id,
      customerId: x.id,
      name: x.name,
      initials: initials(x.name),
      phone: x.phone,
      address: address(x),
      title: pick(j.title, locale),
      problem: pick(j.problem, locale),
      urgency: j.urgency,
      status: j.status,
      source: j.source,
      received: c.ago(j.minutesAgo),
      receivedTime: c.timeAgo(j.minutesAgo),
      when: j.at ? c.slot(j.at.offset, j.at.time) : undefined,
    };
  });

  // Calendar: booked jobs + regular work, for last, this and next week.
  const rawEvents = [
    ...jobs
      .filter((j) => j.at && (j.status === "booked" || j.status === "done"))
      .map((j) => ({ id: `ev-${j.id}`, jobId: j.id, customer: j.customer, title: j.title, ...j.at! })),
    ...extraEvents.map((e) => ({ ...e, jobId: undefined })),
  ];
  const events: CalendarEvent[] = rawEvents
    .map((e) => {
      const x = cust(e.customer);
      const start = toMinutes(e.time);
      const end = start + e.minutes;
      const past = c.isPast(e.offset, clock(end));
      const started = c.isPast(e.offset, e.time);
      return {
        id: e.id,
        jobId: e.jobId,
        title: pick(e.title, locale),
        name: x.name,
        address: address(x),
        dayKey: e.offset,
        start,
        end,
        time: `${e.time} - ${clock(end)}`,
        status: past ? "done" : started ? "now" : "upcoming",
        fromJob: Boolean(e.jobId),
      } satisfies CalendarEvent;
    })
    .sort((a, b) => a.dayKey - b.dayKey || a.start - b.start);

  const weeks = [-1, 0, 1].map((w) =>
    Array.from({ length: 7 }, (_, k): CalendarDay => {
      const offset = w * 7 + k - c.today.weekday;
      return {
        key: offset,
        weekday: c.weekday(offset),
        day: c.dayNumber(offset),
        label: c.longDate(offset),
        isToday: offset === 0,
        weekdayIndex: k,
      };
    }),
  );

  // Free slots: first gaps inside working hours on the next working days.
  const dayKeys = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const workDays = hours.days?.length ? hours.days : dayKeys.slice(0, 5);
  const workStart = toMinutes(hours.start ?? "07:00");
  const workEnd = toMinutes(hours.end ?? "17:00");
  const freeSlots: string[] = [];
  for (let offset = 0; offset <= 10 && freeSlots.length < 4; offset++) {
    const weekday = (c.today.weekday + offset) % 7;
    if (!workDays.includes(dayKeys[weekday])) continue;
    for (let t = Math.max(workStart, 8 * 60); t + 60 <= workEnd && freeSlots.length < 4; t += 90) {
      const busy = events.some((e) => e.dayKey === offset && t < e.end && t + 60 > e.start);
      if (!busy && !c.isPast(offset, clock(t - 60))) {
        freeSlots.push(c.slot(offset, clock(t)));
        break;
      }
    }
  }

  const jobTitle = new Map(jobCards.map((j) => [j.id, j.title]));
  const callEntries: CallEntry[] = calls.map((k) => {
    const x = k.customer ? cust(k.customer) : undefined;
    const offset = c.offsetAgo(k.minutesAgo);
    return {
      id: k.id,
      name: x?.name,
      initials: x ? initials(x.name) : "",
      phone: x?.phone ?? k.phone ?? "",
      time: c.timeAgo(k.minutesAgo),
      ago: c.ago(k.minutesAgo),
      group: offset === 0 ? "today" : offset === -1 ? "yesterday" : "earlier",
      dayLabel: c.dayLabel(offset),
      outcome: k.outcome,
      jobId: k.job,
      jobTitle: k.job ? jobTitle.get(k.job) : undefined,
      ringSec: k.ringSec,
      viaVoice: Boolean(k.viaVoice),
    };
  });

  const customerEntries: CustomerEntry[] = customers
    .map((x) => {
      const own = jobs.filter((j) => j.customer === x.id);
      const past = pastWork.filter((p) => p.customer === x.id);
      const extra = extraEvents.filter((e) => e.customer === x.id && e.offset >= 0);
      const lastMinutes = Math.min(...own.map((j) => j.minutesAgo), ...past.map((p) => p.daysAgo * DAY), x.since * DAY || Infinity);
      return {
        id: x.id,
        name: x.name,
        initials: initials(x.name),
        phone: x.phone,
        address: address(x),
        note: x.note ? pick(x.note, locale) : undefined,
        jobs: own.length + past.length + extra.length,
        last: Number.isFinite(lastMinutes) ? c.ago(lastMinutes) : "",
        lastMinutes,
        isNew: x.since === 0,
        open: own.filter((j) => j.status === "new" || j.status === "proposed").length,
        history: [
          ...extra.map((e) => ({ title: pick(e.title, locale), date: c.slot(e.offset, e.time), status: "booked" as const })),
          ...own.map((j) => ({
            title: pick(j.title, locale),
            date: j.at ? c.slot(j.at.offset, j.at.time) : c.ago(j.minutesAgo),
            status: j.status,
          })),
          ...past.map((p) => ({ title: pick(p.title, locale), date: c.ago(p.daysAgo * DAY), status: "past" as const })),
        ],
      };
    })
    .sort((a, b) => a.lastMinutes - b.lastMinutes);

  const whenOf = new Map(jobCards.map((j) => [j.id, j.when ?? ""]));
  const threadList: Thread[] = threads.map((t) => {
    const x = cust(t.customer);
    const messages = t.messages.map((m, n) => ({
      id: `${t.id}-${n}`,
      from: m.from,
      time: `${c.dayLabel(c.offsetAgo(m.minutesAgo))}, ${c.timeAgo(m.minutesAgo)}`,
      text:
        m.kind === "reply"
          ? templates.reply
          : m.kind === "confirm"
            ? templates.confirm(whenOf.get(t.job ?? "") ?? "")
            : pick(m.text!, locale).replace("{slot}", whenOf.get(t.job ?? "") ?? ""),
    }));
    const lastRaw = t.messages[t.messages.length - 1];
    return {
      id: t.id,
      name: x.name,
      initials: initials(x.name),
      subtitle: t.job ? jobTitle.get(t.job) ?? "" : x.city,
      jobId: t.job,
      unread: t.unread,
      last: c.ago(lastRaw.minutesAgo),
      preview: messages[messages.length - 1].text,
      messages,
    };
  });

  const todayEvents = events.filter((e) => e.dayKey === 0);
  const thisWeek = events.filter((e) => e.dayKey >= -c.today.weekday && e.dayKey < 7 - c.today.weekday);
  const nextEvent = events.find((e) => e.status !== "done");

  return {
    jobs: jobCards,
    events,
    weeks,
    freeSlots,
    calls: callEntries,
    customers: customerEntries,
    threads: threadList,
    today: c.longDate(0),
    stats: {
      missedToday: callEntries.filter((k) => k.group === "today").length,
      jobsFromCallsToday: callEntries.filter((k) => k.group === "today" && k.outcome === "job").length,
      openCards: jobCards.filter((j) => j.status === "new" || j.status === "proposed").length,
      needTime: jobCards.filter((j) => j.status === "new").length,
      bookedWeek: thisWeek.length,
      nextBooked: nextEvent ? c.slot(nextEvent.dayKey, clock(nextEvent.start)) : undefined,
      /** Seconds from missed call to the automatic text (sample value). */
      replySeconds: 4,
      callsWeek: calls.filter((k) => k.minutesAgo < 7 * DAY).length,
      callsToJobs: callEntries.filter((k) => k.outcome === "job").length,
      waiting: callEntries.filter((k) => k.outcome === "waiting").length,
    },
    todayEvents,
  };
}

/** Sample company details, used where onboarding hasn't filled them in. */
export const sampleBusiness: Required<Omit<SampleProfileBase, "customService">> = {
  businessName: "Elektro Krüger",
  trade: "electrician",
  employees: "2to5",
  phone: "+49 355 4870 312",
  mobile: "+49 151 6620 4189",
  emergencyPhone: "+49 355 4870 399",
  street: "Bautzener Str. 61",
  postcode: "03050",
  city: "Cottbus",
  serviceRadius: "25",
  website: "elektro-krueger.de",
  days: ["mon", "tue", "wed", "thu", "fri"],
  start: "07:00",
  end: "17:00",
  services: ["installation", "repair", "maintenance", "inspection"],
};

/* ── Customer data ─────────────────────────────────────────── */

type RawPro = {
  id: string;
  name: string;
  trade: string;
  km: number;
  district: L;
  master: boolean;
  about: L;
  slots: { offset: number; time: string }[];
};

const pros: RawPro[] = [
  { id: "p1", name: "Elektro Krüger", trade: "electrician", km: 2.1, district: { en: "Cottbus-Sandow", de: "Cottbus-Sandow" }, master: true, about: { en: "Electrical installations, e-checks and wallboxes.", de: "Elektroinstallation, E-Check und Wallboxen." }, slots: [{ offset: 0, time: "16:00" }, { offset: 1, time: "10:30" }, { offset: 2, time: "08:00" }, { offset: 3, time: "15:00" }] },
  { id: "p2", name: "Haustechnik Wendisch", trade: "plumber", km: 3.4, district: { en: "Cottbus-Ströbitz", de: "Cottbus-Ströbitz" }, master: true, about: { en: "Bathrooms, taps and drains. Small repairs welcome.", de: "Bäder, Armaturen und Abflüsse. Auch kleine Reparaturen." }, slots: [{ offset: 1, time: "09:00" }, { offset: 1, time: "14:00" }, { offset: 3, time: "08:30" }] },
  { id: "p3", name: "SHK Mielke", trade: "hvac", km: 2.9, district: { en: "Cottbus-Schmellwitz", de: "Cottbus-Schmellwitz" }, master: true, about: { en: "Heating service, boilers and heat pumps.", de: "Heizungswartung, Thermen und Wärmepumpen." }, slots: [{ offset: 0, time: "17:30" }, { offset: 2, time: "11:00" }] },
  { id: "p4", name: "Schlüsseldienst Kahle", trade: "locksmith", km: 1.3, district: { en: "Cottbus-Mitte", de: "Cottbus-Mitte" }, master: false, about: { en: "Lock-outs, new cylinders and door security.", de: "Türöffnungen, neue Zylinder und Einbruchschutz." }, slots: [{ offset: 0, time: "15:00" }, { offset: 0, time: "18:30" }, { offset: 1, time: "08:00" }] },
  { id: "p5", name: "Malerbetrieb Seidel", trade: "painter", km: 4.6, district: { en: "Kolkwitz", de: "Kolkwitz" }, master: true, about: { en: "Interior painting, wallpaper and facades.", de: "Innenanstrich, Tapeten und Fassaden." }, slots: [{ offset: 4, time: "07:30" }, { offset: 6, time: "07:30" }] },
  { id: "p6", name: "Dachdeckerei Lubosch", trade: "roofer", km: 7.8, district: { en: "Neuhausen/Spree", de: "Neuhausen/Spree" }, master: true, about: { en: "Roof repairs, gutters and storm damage.", de: "Dachreparaturen, Dachrinnen und Sturmschäden." }, slots: [{ offset: 5, time: "08:00" }] },
  { id: "p7", name: "Tischlerei Graf", trade: "carpenter", km: 9.2, district: { en: "Burg (Spreewald)", de: "Burg (Spreewald)" }, master: true, about: { en: "Doors, stairs and built-in furniture.", de: "Türen, Treppen und Einbauschränke." }, slots: [{ offset: 2, time: "13:00" }, { offset: 7, time: "09:00" }] },
  { id: "p8", name: "Fliesen Matuschek", trade: "tiler", km: 12.4, district: { en: "Drebkau", de: "Drebkau" }, master: false, about: { en: "Bathroom and kitchen tiling, repairs.", de: "Fliesen für Bad und Küche, Reparaturen." }, slots: [{ offset: 3, time: "10:00" }] },
  { id: "p9", name: "Schornsteinfeger Rösler", trade: "chimneySweep", km: 5.5, district: { en: "Cottbus-Sachsendorf", de: "Cottbus-Sachsendorf" }, master: true, about: { en: "Chimney sweeping, emission checks, fire safety.", de: "Kehren, Abgasmessung und Brandschutz." }, slots: [{ offset: 1, time: "11:30" }, { offset: 4, time: "09:00" }] },
  { id: "p10", name: "Kfz-Werkstatt Noack", trade: "mechanic", km: 6.1, district: { en: "Cottbus-Madlow", de: "Cottbus-Madlow" }, master: true, about: { en: "Service, inspections and tyre changes.", de: "Inspektion, HU-Vorbereitung und Reifenwechsel." }, slots: [{ offset: 1, time: "07:30" }, { offset: 2, time: "12:00" }] },
  { id: "p11", name: "Elektro Pohl & Sohn", trade: "electrician", km: 8.7, district: { en: "Peitz", de: "Peitz" }, master: true, about: { en: "Electrical repairs and smart-home wiring.", de: "Elektroreparaturen und Smart-Home-Verkabelung." }, slots: [{ offset: 2, time: "09:30" }, { offset: 5, time: "13:00" }] },
  { id: "p12", name: "Heizung & Sanitär Domaschk", trade: "plumber", km: 14.8, district: { en: "Spremberg", de: "Spremberg" }, master: true, about: { en: "Heating and plumbing, emergency repairs on weekdays.", de: "Heizung und Sanitär, Notreparaturen an Werktagen." }, slots: [{ offset: 1, time: "13:00" }, { offset: 3, time: "09:00" }] },
  { id: "p13", name: "Elektro Mattick", trade: "electrician", km: 21.5, district: { en: "Senftenberg", de: "Senftenberg" }, master: true, about: { en: "Commercial and home wiring, photovoltaics.", de: "Gewerbe- und Hausinstallation, Photovoltaik." }, slots: [{ offset: 4, time: "08:00" }] },
  { id: "p14", name: "Tischlerei Bulla", trade: "carpenter", km: 4.1, district: { en: "Cottbus-Sielow", de: "Cottbus-Sielow" }, master: false, about: { en: "Windows, floors and small carpentry jobs.", de: "Fenster, Böden und kleine Tischlerarbeiten." }, slots: [{ offset: 0, time: "16:30" }, { offset: 2, time: "08:00" }] },
  { id: "p15", name: "Malermeister Jurk", trade: "painter", km: 18.2, district: { en: "Forst (Lausitz)", de: "Forst (Lausitz)" }, master: true, about: { en: "Painting, plastering and damp-damage repair.", de: "Malerarbeiten, Putz und Feuchteschäden." }, slots: [{ offset: 2, time: "07:30" }, { offset: 5, time: "07:30" }] },
  { id: "p16", name: "Dachbau Kschenka", trade: "roofer", km: 11.3, district: { en: "Peitz", de: "Peitz" }, master: true, about: { en: "Flat and pitched roofs, skylights.", de: "Flach- und Steildächer, Dachfenster." }, slots: [{ offset: 3, time: "07:00" }] },
];

/** Directory details per tradesperson (services use the onboarding service keys). */
const proExtras: Record<
  string,
  { services: string[]; languages: string[]; emergency: boolean; replyMinutes: number; founded: number; extraSlots?: { offset: number; time: string }[] }
> = {
  p1: { services: ["installation", "repair", "inspection", "consultation"], languages: ["de", "en"], emergency: true, replyMinutes: 25, founded: 2009, extraSlots: [{ offset: 1, time: "17:30" }, { offset: 5, time: "09:00" }] },
  p2: { services: ["repair", "installation", "maintenance"], languages: ["de", "pl"], emergency: true, replyMinutes: 40, founded: 1998, extraSlots: [{ offset: 2, time: "18:00" }] },
  p3: { services: ["maintenance", "repair", "inspection", "emergency"], languages: ["de"], emergency: true, replyMinutes: 15, founded: 2004 },
  p4: { services: ["emergency", "installation", "repair"], languages: ["de", "en", "ru"], emergency: true, replyMinutes: 10, founded: 2015, extraSlots: [{ offset: 5, time: "11:00" }, { offset: 6, time: "12:00" }] },
  p5: { services: ["consultation", "installation"], languages: ["de"], emergency: false, replyMinutes: 180, founded: 1992 },
  p6: { services: ["repair", "inspection", "emergency"], languages: ["de", "pl"], emergency: true, replyMinutes: 120, founded: 2001 },
  p7: { services: ["consultation", "installation", "repair"], languages: ["de", "en"], emergency: false, replyMinutes: 90, founded: 2011, extraSlots: [{ offset: 5, time: "10:00" }] },
  p8: { services: ["installation", "repair"], languages: ["de", "ar"], emergency: false, replyMinutes: 60, founded: 2019, extraSlots: [{ offset: 1, time: "15:30" }] },
  p9: { services: ["inspection", "maintenance"], languages: ["de"], emergency: false, replyMinutes: 240, founded: 1987 },
  p10: { services: ["maintenance", "repair", "inspection"], languages: ["de", "en"], emergency: false, replyMinutes: 30, founded: 2007, extraSlots: [{ offset: 5, time: "08:00" }] },
  p11: { services: ["installation", "repair", "consultation"], languages: ["de", "en", "ar"], emergency: true, replyMinutes: 45, founded: 2013, extraSlots: [{ offset: 0, time: "18:00" }] },
  p12: { services: ["repair", "maintenance", "emergency"], languages: ["de", "ru"], emergency: true, replyMinutes: 20, founded: 1996, extraSlots: [{ offset: 6, time: "10:00" }] },
  p13: { services: ["installation", "inspection", "consultation"], languages: ["de", "en"], emergency: false, replyMinutes: 150, founded: 2010 },
  p14: { services: ["repair", "installation"], languages: ["de", "pl"], emergency: false, replyMinutes: 35, founded: 2020 },
  p15: { services: ["consultation", "repair"], languages: ["de"], emergency: false, replyMinutes: 300, founded: 1985 },
  p16: { services: ["repair", "inspection", "emergency"], languages: ["de"], emergency: true, replyMinutes: 75, founded: 2003, extraSlots: [{ offset: 5, time: "08:00" }] },
};

export type ProSlot = {
  id: string;
  label: string;
  today: boolean;
  /** Days from today (0 = today). */
  offset: number;
  /** Start time, minutes after midnight. */
  minutes: number;
  weekend: boolean;
};

export type Pro = {
  id: string;
  name: string;
  initials: string;
  trade: string;
  km: number;
  district: string;
  master: boolean;
  about: string;
  services: string[];
  languages: string[];
  emergency: boolean;
  /** Typical time to answer a request, in minutes. */
  replyMinutes: number;
  founded: number;
  /** Minutes from now to the first free slot (for sorting). */
  soonest: number;
  slots: ProSlot[];
};

export type Booking = {
  id: string;
  pro: string;
  initials: string;
  trade: string;
  title: string;
  when: string;
  address: string;
  status: "confirmed" | "requested" | "done" | "cancelled";
  priority: boolean;
};

/** Public directory listing (same sample tradespeople as the customer dashboard). */
export function getDirectory(locale: Locale) {
  return getCustomerData(locale, { reply: "", confirm: () => "" }).pros;
}

export function getCustomerData(locale: Locale, templates: MessageTemplates) {
  const c = createClock(locale);

  const proList: Pro[] = pros
    .map((p) => {
      const x = proExtras[p.id];
      const all = [...p.slots, ...(x.extraSlots ?? [])].sort((a, b) => a.offset - b.offset || toMinutes(a.time) - toMinutes(b.time));
      const open = all.filter((s) => !c.isPast(s.offset, s.time));
      const first = open[0] ?? all[all.length - 1];
      return {
        id: p.id,
        name: p.name,
        initials: initials(p.name),
        trade: p.trade,
        km: p.km,
        district: pick(p.district, locale),
        master: p.master,
        about: pick(p.about, locale),
        services: x.services,
        languages: x.languages,
        emergency: x.emergency,
        replyMinutes: x.replyMinutes,
        founded: x.founded,
        soonest: first.offset * DAY + toMinutes(first.time) - c.today.minutes,
        slots: (open.length ? open : [first]).map((s, n) => ({
          id: `${p.id}-${n}`,
          label: c.slot(s.offset, s.time),
          today: s.offset === 0,
          offset: s.offset,
          minutes: toMinutes(s.time),
          weekend: (c.today.weekday + s.offset) % 7 >= 5,
        })),
      };
    })
    .sort((a, b) => a.soonest - b.soonest);

  const home = "Thiemstr. 22, Cottbus";
  const bookings: Booking[] = ([
    { id: "b1", pro: "Elektro Krüger", trade: "electrician", title: pick({ en: "Fuse trips with washing machine", de: "Sicherung fliegt bei Waschmaschine" }, locale), when: c.slot(1, "10:30"), address: home, status: "confirmed", priority: false },
    { id: "b2", pro: "Haustechnik Wendisch", trade: "plumber", title: pick({ en: "Dripping kitchen tap", de: "Küchenarmatur tropft" }, locale), when: c.slot(3, "08:30"), address: home, status: "requested", priority: false },
    { id: "b3", pro: "Schlüsseldienst Kahle", trade: "locksmith", title: pick({ en: "New cylinder, front door", de: "Neuer Zylinder, Haustür" }, locale), when: c.slot(-6, "17:00"), address: home, status: "done", priority: true },
    { id: "b4", pro: "Malerbetrieb Seidel", trade: "painter", title: pick({ en: "Paint the hallway", de: "Flur streichen" }, locale), when: c.slot(-24, "07:30"), address: home, status: "done", priority: false },
    { id: "b5", pro: "Dachdeckerei Lubosch", trade: "roofer", title: pick({ en: "Check gutter after storm", de: "Dachrinne nach Sturm prüfen" }, locale), when: c.slot(-40, "09:00"), address: home, status: "cancelled", priority: false },
  ] satisfies Omit<Booking, "initials">[]).map((b) => ({ ...b, initials: initials(b.pro) }));

  const customerThreads: Thread[] = [
    {
      id: "ct1",
      name: "Elektro Krüger",
      initials: initials("Elektro Krüger"),
      subtitle: bookings[0].title,
      unread: 1,
      raw: [
        { from: "me" as const, m: 26 * 60, text: pick({ en: "Hello, the fuse trips whenever the washing machine heats up. Thiemstr. 22.", de: "Hallo, die Sicherung fliegt, sobald die Waschmaschine heizt. Thiemstr. 22." }, locale) },
        { from: "them" as const, m: 25 * 60, text: pick({ en: "Thanks. Please don't run the machine until then. I've booked you in.", de: "Danke. Bitte die Maschine bis dahin nicht benutzen. Ich habe Sie eingetragen." }, locale) },
        { from: "auto" as const, m: 25 * 60 - 1, text: templates.confirm(bookings[0].when) },
        { from: "them" as const, m: 35, text: pick({ en: "Is there parking in front of the house?", de: "Kann man vor dem Haus parken?" }, locale) },
      ],
    },
    {
      id: "ct2",
      name: "Haustechnik Wendisch",
      initials: initials("Haustechnik Wendisch"),
      subtitle: bookings[1].title,
      unread: 0,
      raw: [
        { from: "me" as const, m: 3 * 60, text: pick({ en: "Hi, our kitchen tap is dripping. Any time this week works.", de: "Hallo, unsere Küchenarmatur tropft. Diese Woche geht jeder Termin." }, locale) },
        { from: "them" as const, m: 2 * 60, text: pick({ en: "I'd suggest {slot}. Please confirm in the app.", de: "Ich schlage {slot} vor. Bitte in der App bestätigen." }, locale).replace("{slot}", bookings[1].when) },
      ],
    },
    {
      id: "ct3",
      name: "Schlüsseldienst Kahle",
      initials: initials("Schlüsseldienst Kahle"),
      subtitle: bookings[2].title,
      unread: 0,
      raw: [
        { from: "auto" as const, m: 6 * DAY + 60, text: templates.confirm(bookings[2].when) },
        { from: "me" as const, m: 6 * DAY - 30, text: pick({ en: "Thanks again for coming so quickly.", de: "Nochmals danke, dass Sie so schnell da waren." }, locale) },
      ],
    },
  ].map(({ raw, ...t }) => {
    const messages = raw.map((r, n) => ({
      id: `${t.id}-${n}`,
      from: r.from,
      text: r.text,
      time: `${c.dayLabel(c.offsetAgo(r.m))}, ${c.timeAgo(r.m)}`,
    }));
    return { ...t, last: c.ago(raw[raw.length - 1].m), preview: messages[messages.length - 1].text, messages };
  });

  return {
    pros: proList,
    bookings,
    threads: customerThreads,
    today: c.longDate(0),
    address: home,
    name: "Sabine",
  };
}

/** Minutes since midnight, Berlin time (for "now" markers). */
export const berlinNowMinutes = () => berlin(new Date()).minutes;
