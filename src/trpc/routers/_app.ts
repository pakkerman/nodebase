import { createTRPCRouter } from "../init";

import { credentialRouter } from "@/features/credentials/server/router";
import { workflowsRouter } from "@/features/workflows/server/routers";

export const appRouter = createTRPCRouter({
  workflows: workflowsRouter,
  credentials: credentialRouter,
});

export type AppRouter = typeof appRouter;
