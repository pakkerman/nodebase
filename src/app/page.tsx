import { cn } from "@/lib/utils";

const Page = () => {
  const something = true;

  return (
    <div className={cn("text-red-500", something && "text-purple-500")}>
      Hello world
    </div>
  );
};

export default Page;
