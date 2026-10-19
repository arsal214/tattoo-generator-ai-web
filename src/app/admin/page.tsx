import { connectDB } from "@/lib/db/connect";
import { BlogPost } from "@/lib/db/models/BlogPost";
import { Generation } from "@/lib/db/models/Generation";
import { ContactMessage } from "@/lib/db/models/Misc";
import { User } from "@/lib/db/models/User";

export default async function AdminHome() {
  await connectDB();
  const counts = await Promise.all([User.countDocuments(), Generation.countDocuments(), BlogPost.countDocuments(), ContactMessage.countDocuments()]);
  const labels = ["Users", "Generations", "Blog posts", "Messages"];
  return (
    <>
      <h1 className="text-3xl font-semibold">Admin</h1>
      <p className="mt-2 text-muted">Edit page copy, blog posts, plans and users from the sidebar. Page changes go live immediately.</p>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {labels.map((l, i) => (
          <div key={l} className="rounded-xl border border-line bg-white p-4">
            <p className="text-sm text-muted">{l}</p>
            <p className="text-3xl font-semibold">{counts[i]}</p>
          </div>
        ))}
      </div>
    </>
  );
}
