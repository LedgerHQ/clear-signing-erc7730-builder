"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { GitPullRequest } from "lucide-react";

const githubNameSchema = z
  .string()
  .min(1, "This field is required")
  .max(100, "Name must be less than 100 characters")
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    "Only letters, numbers, hyphens (-), and underscores (_) are allowed",
  );

const formSchema = z.object({
  protocolName: githubNameSchema,
  contractName: githubNameSchema,
});

type FormData = z.infer<typeof formSchema>;

interface PRDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
  contractAddress: string;
}

export function PRDetailsModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
  contractAddress,
}: PRDetailsModalProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      protocolName: "",
      contractName: "",
    },
  });

  const handleSubmit = (data: FormData) => {
    onSubmit(data);
  };

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false);
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitPullRequest className="h-5 w-5" />
            Pull Request Details
          </DialogTitle>
          <DialogDescription>
            Provide details for organizing your ERC-7730 descriptor in the
            registry.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="protocolName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Protocol Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., uniswap, compound, aave"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    The name of the protocol or project. This will be used as
                    the folder name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contractName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., router, pool, vault"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    The name of the specific contract. This will be used as the
                    file name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-md bg-gray-50 p-3 dark:bg-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Contract Address:</strong> {contractAddress}
              </p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                <strong>File will be created at:</strong>{" "}
                <code className="rounded bg-gray-200 px-1 py-0.5 text-xs dark:bg-gray-700">
                  registry/{form.watch("protocolName") || "{protocol}"}/
                  {form.watch("contractName") || "{contract}"}.json
                </code>
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating PR..." : "Create Pull Request"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
