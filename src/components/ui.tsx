import { clsx } from "clsx";

export function Button({
  className,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
}) {
  return (
    <button
      className={clsx(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-55",
        variant === "primary" && "bg-ink text-white shadow-sm hover:bg-black",
        variant === "secondary" && "border border-ink/15 bg-paper text-ink shadow-sm hover:bg-white",
        variant === "ghost" && "text-ink hover:bg-ink/5",
        variant === "danger" && "bg-berry text-white shadow-sm hover:bg-red-800",
        className
      )}
      {...props}
    />
  );
}

export function Field({
  label,
  children,
  hint
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="grid min-w-0 gap-2 text-sm font-medium text-ink">
      <span className="leading-5">{label}</span>
      {children}
      {hint ? <span className="text-xs font-normal text-ink/55">{hint}</span> : null}
    </label>
  );
}

export const inputClass =
  "min-h-11 w-full rounded-md border border-ink/15 bg-paper px-3 py-2 text-sm text-ink shadow-sm outline-none transition placeholder:text-ink/35 hover:border-ink/25 focus:border-palm focus:bg-white focus:ring-2 focus:ring-palm/20";

export const textareaClass =
  "min-h-28 w-full resize-y rounded-md border border-ink/15 bg-paper px-3 py-2 text-sm text-ink shadow-sm outline-none transition placeholder:text-ink/35 hover:border-ink/25 focus:border-palm focus:bg-white focus:ring-2 focus:ring-palm/20";
