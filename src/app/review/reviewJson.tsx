"use client";

import { FileJson, GitPullRequest } from "lucide-react";
import { Button } from "~/components/ui/button";
import * as React from "react";
import { useSession, signIn } from "next-auth/react";

import { ResponsiveDialog } from "~/components/ui/responsiveDialog";
import { PRDetailsModal } from "~/components/modals/PRDetailsModal";
import { useErc7730Store } from "~/store/erc7730Provider";
import { useToast } from "~/hooks/use-toast";

export function ReviewJson() {
  const [open, setOpen] = React.useState(false);
  const [prDetailsOpen, setPRDetailsOpen] = React.useState(false);
  const [isCreatingPR, setIsCreatingPR] = React.useState(false);
  const erc7730 = useErc7730Store((s) => s.finalErc7730);
  const contractAddress = useErc7730Store((s) => s.getContractAddress());
  const { toast } = useToast();
  const { data: session, status } = useSession();

  const handleCopyToClipboard = () => {
    void navigator.clipboard.writeText(JSON.stringify(erc7730, null, 2));
    toast({
      title: "JSON copied to clipboard!",
    });
  };

  const handleOpenPR = async () => {
    if (status === "loading") return;

    if (!session) {
      try {
        await signIn("github", {
          callbackUrl: window.location.href,
          redirect: false,
        });
      } catch (error) {
        toast({
          title: "Authentication failed",
          description: "Please try again.",
          variant: "destructive",
        });
      }
      return;
    }

    if (!erc7730 || !contractAddress) {
      toast({
        title: "Error",
        description: "Missing ERC7730 data or contract address.",
        variant: "destructive",
      });
      return;
    }

    setPRDetailsOpen(true);
  };

  const handlePRDetailsSubmit = async (data: {
    protocolName: string;
    contractName: string;
  }) => {
    if (!erc7730 || !contractAddress) return;

    setIsCreatingPR(true);

    try {
      const response = await fetch("/api/github/create-pr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          erc7730Data: erc7730,
          contractAddress,
          protocolName: data.protocolName,
          contractName: data.contractName,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create pull request");
      }

      toast({
        title: "Pull Request Created!",
        description: (
          <div>
            Your PR has been created successfully.{" "}
            <a
              href={result.pullRequestUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline hover:text-blue-700"
            >
              View Pull Request
            </a>
          </div>
        ),
      });

      setPRDetailsOpen(false);
      setOpen(false);
    } catch (error: any) {
      console.error("Error creating PR:", error);
      toast({
        title: "Failed to create pull request",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingPR(false);
    }
  };

  return (
    <>
      <ResponsiveDialog
        dialogTrigger={<Button variant="outline">Submit</Button>}
        dialogTitle="Submit your JSON"
        open={open}
        setOpen={setOpen}
      >
        <div className="space-y-4 p-4 md:p-0">
          <p className="text-sm text-gray-600">
            You have two options to submit your ERC-7730 descriptor:
          </p>

          <div className="space-y-3">
            <div className="rounded border border-gray-200 p-3">
              <h3 className="font-medium">Option 1: Automatic Pull Request</h3>
              <p className="mb-3 text-sm text-gray-600">
                Automatically create a pull request to the{" "}
                <a
                  href="https://github.com/luaroncrew/Witness_monorepo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  Witness Monorepo
                </a>{" "}
                (requires GitHub authentication).
              </p>
              <Button
                onClick={handleOpenPR}
                disabled={isCreatingPR || status === "loading"}
                className="w-full"
              >
                <GitPullRequest className="mr-2 h-4 w-4" />
                {status === "loading"
                  ? "Loading..."
                  : !session
                    ? "Sign in with GitHub & Open PR"
                    : "Open Pull Request"}
              </Button>
            </div>

            <div className="rounded border border-gray-200 p-3">
              <h3 className="font-medium">Option 2: Manual Submission</h3>
              <p className="mb-3 text-sm text-gray-600">
                Copy the JSON and manually create a pull request.
              </p>
              <Button
                onClick={handleCopyToClipboard}
                variant="outline"
                className="w-full"
              >
                <FileJson className="mr-2 h-4 w-4" />
                Copy JSON to Clipboard
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="mb-2 text-sm font-medium">JSON Preview:</h3>
            <pre className="max-h-64 overflow-auto rounded border bg-gray-100 p-4 text-sm dark:text-black">
              {JSON.stringify(erc7730, null, 2)}
            </pre>
          </div>
        </div>
      </ResponsiveDialog>

      <PRDetailsModal
        open={prDetailsOpen}
        onOpenChange={setPRDetailsOpen}
        onSubmit={handlePRDetailsSubmit}
        isLoading={isCreatingPR}
        contractAddress={contractAddress || ""}
      />
    </>
  );
}

export default ReviewJson;
