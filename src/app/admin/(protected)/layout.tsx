import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin-auth";
import { isDbConfigured } from "@/lib/prisma";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Icons } from "@/components/ui/icons";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 lg:flex-row">
      <AdminSidebar user={user} />
      <div className="flex-1 overflow-x-hidden">
        {!isDbConfigured && (
          <div className="flex items-start gap-2 border-b border-amber-200 bg-amber-50 px-6 py-3 text-sm text-amber-800">
            <Icons.warning className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              <strong>Demo mode:</strong> no database is connected. Data shown is read-only sample data.
              Set <code>DATABASE_URL</code> and run <code>npm run db:push &amp;&amp; npm run db:seed</code> to
              enable full editing, real orders and inventory.
            </p>
          </div>
        )}
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
