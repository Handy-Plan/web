import Icon from "@/components/ui/Icon";

type Slot = {
  day: string;
  time: string;
  name: string;
  service: string;
  color: string;
  ring: string;
};

const slots: Slot[] = [
  { day: "Mon", time: "09:00", name: "H. Müller", service: "Boiler service", color: "bg-primary/10 text-primary", ring: "border-l-primary" },
  { day: "Tue", time: "11:30", name: "A. Schmidt", service: "Wiring check", color: "bg-success/10 text-success", ring: "border-l-success" },
  { day: "Wed", time: "14:00", name: "K. Weber", service: "Installation", color: "bg-indigo/10 text-indigo", ring: "border-l-indigo" },
  { day: "Thu", time: "10:15", name: "L. Fischer", service: "Repair", color: "bg-warning/10 text-warning", ring: "border-l-warning" },
];

/** Pure-CSS product mockup — no image asset, scales crisply, themable. */
export default function CalendarMockup() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* Main window */}
      <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow-float)]">
        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b border-line bg-fog px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-danger/60" />
          <span className="h-3 w-3 rounded-full bg-warning/60" />
          <span className="h-3 w-3 rounded-full bg-success/60" />
          <span className="ml-3 text-xs font-medium text-muted">
            HandyPlan · This week
          </span>
        </div>

        <div className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-ink">June 2026</p>
              <p className="text-xs text-muted">12 appointments</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
              <span className="animate-pulse-soft h-1.5 w-1.5 rounded-full bg-success" />
              Live
            </span>
          </div>

          <ul className="flex flex-col gap-2.5">
            {slots.map((s) => (
              <li
                key={s.day}
                className={`flex items-center gap-3 rounded-xl border border-line border-l-[3px] ${s.ring} bg-surface px-3 py-2.5 transition-colors duration-200 hover:bg-mist`}
              >
                <div className="flex w-12 shrink-0 flex-col items-center">
                  <span className="text-[10px] font-medium uppercase text-muted">
                    {s.day}
                  </span>
                  <span className="text-xs font-bold text-ink">{s.time}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">
                    {s.name}
                  </p>
                  <p className="truncate text-xs text-slate">{s.service}</p>
                </div>
                <span
                  className={`rounded-md px-2 py-1 text-[10px] font-semibold ${s.color}`}
                >
                  Booked
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Floating "new booking" card */}
      <div className="absolute -bottom-6 -left-6 hidden w-56 rounded-2xl border border-line bg-surface p-4 shadow-[var(--shadow-lift)] sm:block">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon name="bell" size={20} />
          </span>
          <div>
            <p className="text-xs font-semibold text-ink">New online booking</p>
            <p className="text-[11px] text-muted">2 minutes ago</p>
          </div>
        </div>
      </div>

      {/* Floating reminder card */}
      <div className="absolute -right-5 -top-5 hidden items-center gap-2 rounded-2xl border border-line bg-surface px-4 py-3 shadow-[var(--shadow-lift)] sm:flex">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10 text-success">
          <Icon name="check" size={16} />
        </span>
        <p className="text-xs font-semibold text-ink">
          Reminder sent
          <span className="block text-[11px] font-normal text-muted">
            No-show avoided
          </span>
        </p>
      </div>
    </div>
  );
}
