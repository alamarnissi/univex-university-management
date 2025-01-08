'use client';
import { useCollapsedSidebar } from '@/stores/useGlobalStore';
import { createContext, ReactNode, useState, useContext, useEffect } from 'react';


export interface SidebarContextInterface {
    openSidebar: boolean,
    isCollapsedState: boolean,
    setOpenSidebar: (state: boolean) => any
}

export const SidebarContext = createContext({} as SidebarContextInterface);


type Props = {
    children: ReactNode
};

export default function SidebarProvider({ children }: Props) {
    const [openSidebar, setOpenSidebar] = useState<boolean>(true);
    const {isCollapsedState} = useCollapsedSidebar();

    useEffect(() => {
        window.addEventListener("resize", () =>
            window.innerWidth < 1200 ? setOpenSidebar(false) : setOpenSidebar(true)
        );

        return () => {
            window.removeEventListener('resize', () => { });
        }
    }, []);

    return (
        <SidebarContext.Provider
            value={{
                openSidebar, setOpenSidebar, isCollapsedState
            }}
        >
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebarContext() {
    return useContext(SidebarContext)
}  