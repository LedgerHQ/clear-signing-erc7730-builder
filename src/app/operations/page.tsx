import { HydrateClient } from "~/trpc/server";
import OperationManagement from "./operationManagement";
import { SidebarProvider } from "~/components/ui/sidebar";
import { AppSidebar } from "~/shared/sidebar";

export default async function Functions() {
  return (
    <HydrateClient>
      <SidebarProvider>
        <AppSidebar />
        <OperationManagement />
      </SidebarProvider>
    </HydrateClient>
  );
}
