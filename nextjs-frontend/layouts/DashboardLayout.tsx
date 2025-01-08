"use client"
import Footer from '@/components/dashboard/footer/Footer';
import Navbar from '@/components/dashboard/navbar';
import { useCollapsedSidebar, useCurrentUserState } from '@/stores/useGlobalStore';
import useStore from '@/stores/useStore';
import { useEffect } from 'react';

const DashboardLayout = ({
    children, // will be a page or nested layout
    userData,
    params
}: {
    children: React.ReactNode;
    userData: {username: string, role: string, email: string },
    params: { locale: string, domain: string }
}) => {
    const isCollapsedState = useStore(useCollapsedSidebar, state => state.isCollapsedState);
    const {updateAuthUserState} = useCurrentUserState();

    useEffect(() => {
        updateAuthUserState(userData);
    }, [userData])
    
    return (
        <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">

            {/* Main Content */}
            <main className={`${isCollapsedState ? `xl:ml-[136px]` : `xl:ml-[320px]`} mx-[12px] h-full flex-none transition-all md:pr-2`} >
                {/* Routes */}
                <div className="h-full">
                    <Navbar userData={userData} params={params} />

                    <div className="pt-5 mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2">
                        {children}
                    </div>

                    <div className="p-3">
                        <Footer />
                    </div>
                </div>
            </main>

        </div>
    );
}

export default DashboardLayout