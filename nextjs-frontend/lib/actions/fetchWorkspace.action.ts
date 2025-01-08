"use server"

import { fetchWSname } from "../fetch/FetchWorkspaces"

export const fetchWorkspaceData = async (subdomain: string) => {
    try {
        const res = await fetchWSname(subdomain);

        if (res.status >= 200 && res.status < 300) {
            return res.data;
        } else {
            return null
        }
    } catch (error) {
        return null
    }
}