import { TOOL_CATEGORIES } from "@/lib/tools/types";
import { TOOLS } from "@/lib/tools/registry";
import { Header, type NavGroup } from "./Header";

/** Server wrapper: passes only names/links to the client header so tool content never ships to the browser. */
export function SiteHeader() {
  const groups: NavGroup[] = TOOL_CATEGORIES.map((c) => ({
    name: c.name,
    links: TOOLS.filter((t) => t.category === c.id).map((t) => ({ name: t.name, href: `/${t.slug}` })),
  }));
  return <Header groups={groups} />;
}
