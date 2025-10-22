import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { HydrateClient } from "@/trpc/server";
import { requireAuth } from "@/lib/auth-utils";
import { prefetchWorkflows } from "@/features/workflows/server/prefetch";

import { WorkflowList } from "@/features/workflows/components/workflows";

const Page = async () => {
  await requireAuth();

  prefetchWorkflows();

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<p>Error!</p>}>
        <Suspense fallback={<p>Loading...</p>}>
          <WorkflowList />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default Page;
