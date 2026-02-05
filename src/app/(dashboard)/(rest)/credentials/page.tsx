import { HydrateClient } from "@/trpc/server";
import { SearchParams } from "nuqs";

import { requireAuth } from "@/lib/auth-utils";
import { crednetialsParamsLoader } from "@/features/credentials/server/params-loader";
import { prefetchCrednetials } from "@/features/credentials/server/prefetch";
import {
  CredentialList,
  CredentialsContainer,
  CredentialsError,
  CredentialsLoading,
} from "@/features/credentials/components/credentials";
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
    <CredentialsContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<CredentialsError />}>
          <Suspense fallback={<CredentialsLoading />}>
            <CredentialList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </CredentialsContainer>
  );
};

export default Page;
