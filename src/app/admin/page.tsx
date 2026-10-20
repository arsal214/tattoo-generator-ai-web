import Link from "next/link";
import { BookOpen, Image as ImageIcon, MessageSquare, Users } from "lucide-react";
import { connectDB } from "@/lib/db/connect";
import { BlogPost } from "@/lib/db/models/BlogPost";
import { Generation } from "@/lib/db/models/Generation";
import { ContactMessage } from "@/lib/db/models/Misc";
import { User } from "@/lib/db/models/User";

const QUICK = [
  ["/admin/content/home", "Edit the home page"],
  ["/admin/blog/new", "Write a blog post"],
  ["/admin/plans", "Change pricing"],
  ["/admin/messages", "Read messages"],
] as const;

export default async function AdminHome() {
  await connectDB();
  const [users, gens, posts, msgs] = await Promise.all([User.countDocuments(), Generation.countDocuments(), BlogPost.countDocuments(), ContactMessage.countDocuments()]);
  const stats = [
    { label: "Users", value: users, Icon: Users, href: "/admin/users" },
    { label: "Generations", value: gens, Icon: ImageIcon, href: "/admin" },
    { label: "Blog posts", value: posts, Icon: BookOpen, href: "/admin/blog" },
    { label: "Messages", value: msgs, Icon: MessageSquare, href: "/admin/messages" },
  ];
  return (
    <>
      <h1 className="text-3xl font-semibold">Welcome back</h1>
      <p className="mt-2 text-muted">Edit page copy, blog posts, plans and users from the sidebar. Page changes go live immediately.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, Icon, href }) => (
          <Link key={label} href={href} className="card p-5 transition hover:border-ink hover:shadow-[3px_3px_0_0_var(--color-ink)]">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <Icon size={20} aria-hidden />
            </span>
            <p className="mt-4 text-3xl font-semibold">{value}</p>
            <p className="text-sm text-muted">{label}</p>
          </Link>
        ))}
      </div>

      <h2 className="mb-3 mt-10 text-xl font-semibold">Quick actions</h2>
      <div className="flex flex-wrap gap-3">
        {QUICK.map(([href, label]) => (
          <Link key={href} href={href} className="btn btn-outline">
            {label}
          </Link>
        ))}
      </div>
    </>
  );
}
