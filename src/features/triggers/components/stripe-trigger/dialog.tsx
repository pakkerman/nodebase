"use client";

import { useParams } from "next/navigation";

import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StripeTriggerDialog = ({ open, onOpenChange }: Props) => {
  const params = useParams();
  const workflowId = params.workflowId as string;
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Construct the webhook URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const webhookUrl = `${baseUrl}/api/webhooks/stripe?workflowId=${workflowId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      toast.success("Webhook URL copied to clipboard");
      setIsCopied(true);
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Stripe Trigger Configuration</DialogTitle>
          <DialogDescription>
            Configure this webhook URL in your Stripe Dashboard to trigger this
            workflow on payment events.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <div className="flex gap-2">
              <Input
                id="webhook-url"
                value={webhookUrl}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={copyToClipboard}
              >
                {isCopied ? (
                  <CheckIcon className="size-4" />
                ) : (
                  <CopyIcon className="size-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2 rounded-lg bg-muted p-4">
            <h4 className="text-sm font-medium">Setup instructions: </h4>
            <ol className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
              <li className="">Open your Stripe Dashboard</li>
              <li className="">Go to Developers → Webhooks</li>
              <li className="">Click "Add endpoint"</li>
              <li className="">Paste the webhook URL above</li>
              <li className="">
                Select event to listen for (e.g., payment_intent.succeeded)
              </li>
              <li className="">Save and copy the signing secret</li>
            </ol>
          </div>

          <div className="space-y-2 rounded-lg bg-muted p-4">
            <h4 className="text-sm font-medium">Available Variables</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{stripe.amount}}"}
                </code>{" "}
                - Payment amount
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{stripe.currency}}"}
                </code>{" "}
                - Currency code
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{stripe.customerId}}"}
                </code>{" "}
                - Customer ID
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{json stripe}}"}
                </code>{" "}
                - Full event data as JSON
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{stripe.eventType}}"}
                </code>{" "}
                - Event type (e.g., payment_intent.succeeded)
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
