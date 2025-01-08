import { NextAuthProvider } from "@/components/Common/Providers";
import Sidebar from "@/components/dashboard/sidebar";
import SidebarProvider from "@/components/providers/SidebarProvider";
import DashboardLayout from "@/layouts/DashboardLayout";
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/authOptions";
import { Chatbot } from "./academy/_components/Chatbot";
import { fetchWSname } from "@/lib/fetch/FetchWorkspaces";
import { notFound } from "next/navigation";

export default async function AppLayout({
    children, // will be a page or nested layout
    params: { locale, domain }
}: {
    children: React.ReactNode;
    params: { locale: string, domain: string }
}) {
    const session = await getServerSession(authOptions);

    // const serverCookies = cookies();
    const username = (session?.user?.name as string) || "";
    const workspace_id = (session?.user?.workspace_id as string) || "";
    const role = (session?.user?.role as string) || "";
    const email = (session?.user?.email as string) || "";

    const workspace = await fetchWSname(workspace_id);

    if (workspace?.status === 404) {
        notFound();
    }

    return (
        <NextAuthProvider>
            <SidebarProvider>
                <section className="flex h-full w-full">
                    <Sidebar role={role} subdomain={workspace_id} workspace_name={workspace?.data?.name} />
                    <DashboardLayout userData={{ username, role, email }} params={{locale, domain}} >
                        {children}
                    </DashboardLayout>
                    {role === "student" && <Chatbot />}
                </section>
            </SidebarProvider>
        </NextAuthProvider>

    )
}