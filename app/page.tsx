import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  //  Not logged in
  if (!session) {
    redirect("/login");
  }

  // Not onboarded
  if (!session.user.usn) {
    redirect("/onboarding");
  }

  // Admin user
  if (session.user.role === "admin") {
    redirect("/admin");
  }

  // Normal user
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">
          Welcome {session.user.name}
        </h1>
        <p className="mt-2 text-gray-500">
          You are logged in successfully.
        </p>
      </div>
    </div>
  );
}