import { fetchWorkspaceData } from '@/lib/actions/fetchWorkspace.action'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
    children: React.ReactNode
    params: {
        locale: string
        domain: string
    }
}

const DynamicDomainLayout = async ({
    children,
    params: { locale, domain }
}: Props) => {
    const checkWorkspace = await fetchWorkspaceData(domain);

    if (checkWorkspace === null) {
        // notFound();
        redirect(`${process.env.NEXT_PUBLIC_APP_URL}/${locale}`)
    }

    return (
        <>
            {children}
        </>
    )
}

export default DynamicDomainLayout