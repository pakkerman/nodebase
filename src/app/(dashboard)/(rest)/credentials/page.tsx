import { HydrateClient } from "@/trpc/server";
import { SearchParams } from "nuqs";

import { requireAuth } from "@/lib/auth-utils";
import { crednetialsParamsLoader } from "@/features/credentials/server/params-loader";
import { prefetchCrednetials } from "@/features/credentials/server/prefetch";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";

type Props = {
  searchParams: Promise<SearchParams>;
};
const Page = async ({ searchParams }: Props) => {
  await requireAuth();

  const params = await crednetialsParamsLoader(searchParams);
  prefetchCrednetials(params);

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<p>Error</p>}>
        <Suspense fallback={<p>Loading...</p>}>
          <p>TODO: Credential list</p>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default Page;
