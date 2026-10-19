import { connectDB } from "@/lib/db/connect";
import { ContactMessage } from "@/lib/db/models/Misc";

export default async function AdminMessages() {
  await connectDB();
  const msgs = await ContactMessage.find().sort({ createdAt: -1 }).limit(100).lean();
  return (
    <>
      <h1 className="mb-6 text-3xl font-semibold">Contact messages</h1>
      {msgs.length === 0 && <p className="text-muted">No messages yet.</p>}
      <div className="space-y-3">
        {msgs.map((m) => (
          <article key={String(m._id)} className="rounded-xl border border-line bg-white p-4">
            <p className="text-sm text-muted">
              {m.name} · <a className="underline" href={`mailto:${m.email}`}>{m.email}</a> · {m.subject}
            </p>
            <p className="mt-2 whitespace-pre-wrap">{m.message}</p>
          </article>
        ))}
      </div>
    </>
  );
}
