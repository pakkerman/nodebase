import prisma from "@/lib/db";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    // fetching the video
    await step.sleep("fetching", "5s");

    // transscribing
    await step.sleep("transscribing", "5s");

    // sending to AI
    await step.sleep("sending-to-ai", "5s");

    await step.run("create-workflow", () => {
      return prisma.workflow.create({
        data: {
          name: "workflow-from-inngest",
        },
      });
    });
    return { success: true, message: "Job queued" };
  },
);
