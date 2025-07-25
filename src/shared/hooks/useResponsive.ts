import {useEffect, useMemo, useState} from "react";
import {getActiveBreakpoint} from "@/shared/utils/responsive.ts";

export default function useResponsive() {
    const [breakpoint, setBreakpoint] = useState<string>(() => {
        return getActiveBreakpoint()
    })

    const isInMobile = useMemo(() => {
        return breakpoint === 'default' || breakpoint === 'sm'
    }, [breakpoint])

    const isInTablet = useMemo(() => {
        return breakpoint === 'md'
    }, [breakpoint])

    const isInDesktop = useMemo(() => {
        return breakpoint === 'lg' || breakpoint === 'xl'
    }, [breakpoint])

    const onResize = () => {
        setBreakpoint(getActiveBreakpoint())
    }

    useEffect(() => {
        window.addEventListener('resize', onResize)
        return () => {
            window.removeEventListener('resize', onResize)
        }
    }, []);

    return {
        isInMobile,
        isInTablet,
        isInDesktop,
        breakpoint,
    }
}