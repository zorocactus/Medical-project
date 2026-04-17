// ─── Shared React primitives for the Admin Dashboard ─────────────────────────
// Card, Badge — imported by all admin view files
import { getAdminTheme } from "./adminTheme.js";

/** Shared card component */
export function Card({ children, className = "", style = {}, dk }) {
  const c = getAdminTheme(dk);
  return (
    <div
      className={`rounded-2xl border ${className}`}
      style={{
        background: c.card,
        borderColor: c.border,
        boxShadow: dk
          ? "0 1px 3px rgba(0,0,0,0.4)"
          : "0 1px 4px rgba(74,111,165,0.06)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Shared badge */
export function Badge({ color, bg, children, className = "" }) {
  return (
    <span
      className={`text-xs font-bold px-2 py-0.5 rounded-full ${className}`}
      style={{ color, background: bg }}
    >
      {children}
    </span>
  );
}
