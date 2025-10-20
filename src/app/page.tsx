import { Button } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";
import { LogoutButton } from "./logout";

const Page = async () => {
  await requireAuth();

  const data = await caller.getUsers();

  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-center gap-y-6">
      protected server component
      <div className="flex flex-col items-center">
        {JSON.stringify(data, null, 2)}
        <LogoutButton />
      </div>
    </div>
  );
};

export default Page;
