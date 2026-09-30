import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { CreditBadge } from "@/components/generator/CreditBadge";
import { requireUserOrRedirect } from "@/lib/auth/session";
import { connectDB } from "@/lib/db/connect";
import { Generation } from "@/lib/db/models/Generation";
import { LOW_CREDITS, PLANS } from "@/lib/config/plans";
import { STYLES, label } from "@/lib/config/generation";
import { toGenerationDto } from "@/lib/services/generation";
import { formatDate } from "@/lib/utils";

export default async function OverviewPage() {
  const user = await requireUserOrRedirect();
  await connectDB();
  const [total, recent] = await Promise.all([
    Generation.countDocuments({ userId: user._id, status: "success" }),
    Generation.find({ userId: user._id, status: "success" }).sort({ _id: -1 }).limit(6).lean().then((rows) => rows.map((g) => toGenerationDto(g))),
  ]);
  const plan = PLANS.find((p) => p.id === user.plan)!;
  const out = user.credits === 0;
  const low = !out && user.credits <= LOW_CREDITS;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold sm:text-4xl">Hi {user.name.split(" ")[0]}, welcome back</h1>
        <p className="mt-1 text-muted">Here&apos;s where your tattoo ideas stand.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-5">
          <p className="text-sm font-medium text-muted">Current credits</p>
          <div className="mt-2 flex items-center gap-3">
            <CreditBadge credits={user.credits} className="!min-h-10 text-base" />
          </div>
          <p className="mt-3 text-sm text-muted">1 credit = 1 AI tattoo generation.</p>
        </div>
        <div className="card p-5">
          <p className="text-sm font-medium text-muted">Designs generated</p>
          <p className="mt-2 font-display text-4xl font-semibold">{total}</p>
          <Link href="/dashboard/designs" className="mt-2 inline-block text-sm font-semibold text-accent">
            View My Designs
          </Link>
        </div>
        <div className="card p-5">
          <p className="text-sm font-medium text-muted">Current plan</p>
          <p className="mt-2 font-display text-4xl font-semibold">{plan.name}</p>
          <Link href="/dashboard/pricing" className="mt-2 inline-block text-sm font-semibold text-accent">
            {user.plan === "pro" ? "Add more credits" : "Upgrade"}
          </Link>
        </div>
      </div>

      {(out || low) && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-accent/30 bg-accent-soft p-5">
          <div>
            <p className="font-semibold text-accent-dark">{out ? "You're out of credits." : `Only ${user.credits} credit${user.credits === 1 ? "" : "s"} left.`}</p>
            <p className="text-sm text-ink/75">{out ? "Choose a plan to keep generating tattoo designs." : "Top up so you never get stuck mid-idea."}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/pricing" className="btn btn-primary btn-sm">
              View Plans
            </Link>
            <Link href="/dashboard/pricing" className="btn btn-outline btn-sm">
              Upgrade
            </Link>
          </div>
        </div>
      )}

      <section aria-labelledby="recent">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id="recent" className="text-2xl font-semibold">
            Recent generations
          </h2>
          <Link href="/dashboard/generate" className="btn btn-dark btn-sm">
            <Sparkles size={15} aria-hidden /> New design
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink/25 bg-white p-10 text-center">
            <p className="font-display text-xl font-semibold">No designs yet</p>
            <p className="mx-auto mt-1 max-w-md text-muted">Describe your first tattoo idea and it will show up here.</p>
            <Link href="/dashboard/generate" className="btn btn-primary mt-5">
              Generate your first tattoo
            </Link>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {recent.map((g) => (
              <li key={g.id}>
                <Link href={`/dashboard/designs/${g.id}`} className="group block overflow-hidden rounded-xl border border-line bg-white">
                  <div className="relative aspect-square bg-bone">{g.imageUrl && <Image src={g.imageUrl} alt={`Tattoo design: ${g.prompt}`} fill sizes="(min-width: 1024px) 15vw, 30vw" className="object-cover" />}</div>
                  <p className="truncate px-2.5 pt-2 text-[13px] font-medium">{g.prompt}</p>
                  <p className="truncate px-2.5 pb-2 text-xs text-muted">
                    {label(STYLES, g.style)} · {formatDate(g.createdAt)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
