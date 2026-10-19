import { Editor } from "@/components/admin/Editor";
import { connectDB } from "@/lib/db/connect";
import { Plan } from "@/lib/db/models/Plan";
import { getPlans } from "@/lib/services/plans";

export default async function AdminPlans() {
  await connectDB();
  await getPlans(); // seeds from config when empty
  const plans = await Plan.find().sort({ sortOrder: 1 }).lean();
  return (
    <>
      <h1 className="mb-6 text-3xl font-semibold">Plans</h1>
      <div className="space-y-8">
        {plans.map((p) => (
          <section key={p.key} className="rounded-xl border border-line bg-white p-4">
            <h2 className="mb-3 text-lg font-semibold">{p.key}</h2>
            <Editor initial={{ name: p.name, price: p.price, credits: p.credits, features: [...p.features], active: p.active, sortOrder: p.sortOrder }} url={`/api/admin/plans/${p.key}`} />
          </section>
        ))}
      </div>
    </>
  );
}
