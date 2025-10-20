import { LoginForm } from "@/features/auth/components/login-form";
import { requireUnauth } from "@/lib/auth-utils";

const Page = async () => {
  await requireUnauth();

  return (
    <div className="min-h-screen items-center flex flex-col justify-center">
      <LoginForm />
    </div>
  );
};

export default Page;
