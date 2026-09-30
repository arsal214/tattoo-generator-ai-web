import type { Metadata } from "next";
import { SettingsForm } from "@/components/dashboard/SettingsForm";
import { requireUserOrRedirect } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Account Settings" };

export default async function SettingsPage() {
  const user = await requireUserOrRedirect("/dashboard/settings");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold sm:text-4xl">Account Settings</h1>
        <p className="mt-1 text-muted">Manage your name and password.</p>
      </div>
      <SettingsForm name={user.name} email={user.email} />
    </div>
  );
}
