import { Editor } from "@/components/admin/Editor";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";

export default async function AdminUsers() {
  await connectDB();
  const users = await User.find().sort({ createdAt: -1 }).limit(100).lean();
  return (
    <>
      <h1 className="mb-6 text-3xl font-semibold">Users</h1>
      <div className="space-y-3">
        {users.map((u) => (
          <details key={String(u._id)} className="rounded-xl border border-line bg-white p-4">
            <summary className="cursor-pointer text-sm">
              <strong>{u.name}</strong> · {u.email} · {u.role} · {u.credits} credits
            </summary>
            <div className="mt-4">
              <Editor initial={{ name: u.name, credits: u.credits, plan: u.plan ?? "free", role: u.role ?? "user" }} url={`/api/admin/users/${u._id}`} method="PATCH" />
            </div>
          </details>
        ))}
      </div>
    </>
  );
}
