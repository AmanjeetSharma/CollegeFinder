import { useState, useEffect, useCallback } from "react";

const useFullScreen = () => {
    const [isFullScreen, setIsFullScreen] = useState(false);

    const enterFullScreen = useCallback(async () => {
        try {
            const elem = document.documentElement;
            if (elem.requestFullscreen) {
                await elem.requestFullscreen();
                return true;
            }
        } catch (err) {
            console.warn("Fullscreen not allowed:", err);
        }
        return false;
    }, []);

    const exitFullScreen = useCallback(async () => {
        try {
            if (document.fullscreenElement && document.exitFullscreen) {
                await document.exitFullscreen();
                return true;
            }
        } catch (err) {
            console.warn("Exit fullscreen failed:", err);
        }
        return false;
    }, []);

    useEffect(() => {
        const handleChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };

        document.addEventListener("fullscreenchange", handleChange);

        return () => {
            document.removeEventListener("fullscreenchange", handleChange);
        };
    }, []);

    return { isFullScreen, enterFullScreen, exitFullScreen };
};

export default useFullScreen;
