import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import LoginLogoutButton from "@/components/LoginLogoutButton";
import UserGreetText from "@/components/UserGreetText";

export default async function AdminPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  // Query check
  const { data: queryData, error: queryError } = await supabase
    .from("admin")
    .select("email");

  if (queryError) {
    console.error("Database query error", queryError);
  }

  const isAdmin = queryData?.some((admin) => admin.email === data?.user?.email);

  if (!isAdmin) {
    redirect("/my-application");
  }

  return (
    <div className="h-dvh flex items-center justify-center flex-col gap-8">
      <div className="bg-blue-400 p-4 rounded-xl">Admin page</div>
      <div>{data.user.email}</div>
      <UserGreetText />
      <LoginLogoutButton />
    </div>
  );
}
