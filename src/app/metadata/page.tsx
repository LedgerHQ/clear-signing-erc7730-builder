import { HydrateClient } from "~/trpc/server";
import MetadataForm from "./metaDataForm";
import ToolBox from "~/components/utils/toolBox";
import { SidebarProvider } from "~/components/ui/sidebar";
import { AppSidebar } from "./sidebar";

export default async function Home() {
  return (
    <HydrateClient>
      <SidebarProvider>
        <AppSidebar />

        <div className="w-full p-10">
          <MetadataForm />
        </div>
      </SidebarProvider>
    </HydrateClient>
  );
}
