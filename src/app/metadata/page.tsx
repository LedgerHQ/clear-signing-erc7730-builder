import { HydrateClient } from "~/trpc/server";
import MetadataForm from "./metaDataForm";
import { SidebarProvider } from "~/components/ui/sidebar";
import { AppSidebar } from "~/shared/sidebar";

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
