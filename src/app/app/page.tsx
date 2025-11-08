import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AppPage() {
  const session = await auth();

  // This is a server-side check, but middleware should handle redirects
  // This is an extra safety check
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-white mb-6">
          Welcome to SourceStack
        </h1>
        <p className="text-gray-300 text-lg">
          You are successfully authenticated! This is your dashboard.
        </p>
        {session.user && (
          <div className="mt-8 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">
              User Information
            </h2>
            <div className="space-y-2 text-gray-300">
              <p>
                <span className="font-medium">Name:</span> {session.user.name}
              </p>
              <p>
                <span className="font-medium">Email:</span> {session.user.email}
              </p>
              {session.user.id && (
                <p>
                  <span className="font-medium">ID:</span> {session.user.id}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
