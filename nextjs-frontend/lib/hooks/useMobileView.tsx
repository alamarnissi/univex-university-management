import { useSidebarContext } from '@/components/providers/SidebarProvider';
import { useEffect, useState } from 'react';

const useMobileView = () => {
    const { setOpenSidebar } = useSidebarContext()
    const [width, setWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1366);

    function handleWindowSizeChange() {
        setWidth(window?.innerWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        // close sidebar on mobile
        if(width <= 768) {
            setOpenSidebar(false);
        }
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    return { 
        isMobile: width <= 768, 
        windowWidth: width 
    };
}

export default useMobileView;