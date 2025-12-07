import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useLayoutEffect(() => {
        // Disable native scroll restoration to prevent browser from restoring position
        if (window.history && "scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }

        // Force scroll to top on all potential containers
        window.scrollTo(0, 0);
        document.body.scrollTo(0, 0);
        document.documentElement.scrollTo(0, 0);
    }, [pathname]);

    return null;
}
