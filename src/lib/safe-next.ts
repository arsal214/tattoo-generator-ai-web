/** Only allow same-site relative redirects (prevents open-redirect via ?next=). */
export function safeNext(value: string | string[] | undefined, fallback = "/dashboard") {
  const v = Array.isArray(value) ? value[0] : value;
  return v && v.startsWith("/") && !v.startsWith("//") && !v.includes("\\") ? v : fallback;
}
