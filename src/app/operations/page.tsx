import { HydrateClient } from "~/trpc/server";
import ToolBox from "~/components/utils/toolBox";
import OperationManagement from "./operationManagement";
import { BreadcrumbInfo } from "./breadCrum";
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
