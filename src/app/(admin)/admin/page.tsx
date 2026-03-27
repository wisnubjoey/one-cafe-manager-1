"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function AdminPage() {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Hello World
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-4">
          Welcome to the admin page!
        </p>
        <button
          onClick={handleSignOut}
          className="mt-6 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
