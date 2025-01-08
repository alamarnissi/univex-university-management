
import { FC } from 'react';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import GetDashboard from './_components/dashboards';

type Props = {
    params: {
        domain: string
    }
};

const Dashboard: FC<Props> = async ({params: { domain }}: {params: { domain: string }}) => {
    const session = await getServerSession(authOptions);

    const role = (session?.user?.role as string) || "";

    return (
        <GetDashboard role={role} subdomain={domain} />
    );
}

export default Dashboard