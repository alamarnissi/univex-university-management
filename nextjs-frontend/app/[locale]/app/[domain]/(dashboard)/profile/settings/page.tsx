import { getServerSession } from "next-auth";
import ManagerProfileSettingsForm from "./_components/ManagerProfileSettingsForm"
import { authOptions } from "@/lib/authOptions";
import { cookies } from "next/headers";
import { getUserData } from "@/lib/fetch/managers/get-manager";


const ProfileSettingsPage = async ({params}: {params: { locale: string, domain: string }}) => {
    const session = await getServerSession(authOptions);

    const token = (cookies()?.get("access_token")?.value as string) ?? "";
    const role = (session?.user?.role as string) || "";

    const userData = await getUserData({ token });

    return (
        <>
            {role === "manager" ? <ManagerProfileSettingsForm userData={userData} locale={params.locale} domain={params.domain} /> : null}
        </>
    )
}

export default ProfileSettingsPage