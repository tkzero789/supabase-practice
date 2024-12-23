"use client";

import React from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import LoginLogoutButton from "@/components/LoginLogoutButton";
import UserGreetText from "@/components/UserGreetText";

export default function MyApplicationPage() {
  const [email, setEmail] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();
  const supabase = createClient();

  React.useEffect(() => {
    async function getUser() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.replace("/login");
          return;
        }

        const { data: queryData, error: queryError } = await supabase
          .from("admin")
          .select("email");

        const isAdmin = queryData?.some((admin) => admin.email === user?.email);

        if (queryError) {
          console.error("Database query error", queryError);
        }

        // return if user is admin
        if (isAdmin) {
          router.replace("/admin");
          return;
        }

        setEmail(user?.email || null);
        setLoading(false);
      } catch (error) {
        console.error(error);
        router.replace("/login");
      }
    }

    getUser();
  }, [router, supabase.auth, supabase]);

  if (loading) {
    return (
      <div className="h-dvh flex items-center justify-center">
        <div
          className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500"
          role="status"
          aria-label="loading"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center h-dvh gap-8">
      <div>My Application Page</div>
      {email}

      <div className="flex justify-center flex-col gap-8">
        <UserGreetText />
        <LoginLogoutButton />
      </div>
    </div>
  );
}
