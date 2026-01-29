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
import { generateGoogleFormScript } from "./utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GoogleFormTriggerDialog = ({ open, onOpenChange }: Props) => {
  const params = useParams();
  const workflowId = params.workflowId as string;
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Construct the webhook URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const webhookUrl = `${baseUrl}/api/webhooks/google-form?workflowId=${workflowId}`;

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
          <DialogTitle>Google Form Trigger Configuration</DialogTitle>
          <DialogDescription>
            Use this webhook URL in your Google Form's Apps Script to Trigger
            this workflow when a form is submitted.
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
              <li className="">Open your Google Form</li>
              <li className="">
                Click the three dots to access menu → Script editor
              </li>
              <li className="">Copy and paste the script below</li>
              <li className="">
                Replace WEBHOOK_URL with your webhook URL above
              </li>
              <li className="">Save and click "Triggers" → Add Trigger</li>
              <li className="">Choose: From form → On form submit → Save</li>
            </ol>
          </div>

          <div className="space-y-3 rounded-lg bg-muted p-4">
            <h4 className="text-sm font-medium">Google Apps Script:</h4>
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                const script = generateGoogleFormScript(webhookUrl);
                try {
                  await navigator.clipboard.writeText(script);
                  toast.success("Script copied to clipboard");
                } catch {
                  toast.error("Failed to copy script to clipboard");
                }
              }}
            >
              <CopyIcon className="mr-2 size-4" />
              Copy Google Apps Script
            </Button>
            <p className="text-sm text-muted-foreground">
              This script includes your webhook URL and handles form submissions
            </p>
          </div>
          <div className="space-y-2 rounded-lg bg-muted p-4">
            <h4 className="text-sm font-medium">Available Variables</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>
                <code className="rounded bg-background px-1 py-0.5">
                  {"{{googleForm.respondentEmail}}"}
                </code>
                - Respondent's email
              </li>
              <li>
                <code className="rounded bg-background px-1 py-0.5">
                  {"{{googleForm.responses['Question Name']}}"}
                </code>
                - Specific answer
              </li>
              <li>
                <code className="rounded bg-background px-1 py-0.5">
                  {"{{json googleForm.responses}}"}
                </code>
                - All responses as JSON
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
