import { useEffect, useRef } from "react";

const useFullscreen = (enabled) => {
  const ref = useRef();

  useEffect(() => {
    if (enabled && ref.current) {
      if (ref.current.requestFullscreen) {
        ref.current.requestFullscreen();
      } else if (ref.current.webkitRequestFullscreen) {
        ref.current.webkitRequestFullscreen();
      } else if (ref.current.mozRequestFullScreen) {
        ref.current.mozRequestFullScreen();
      } else if (ref.current.msRequestFullscreen) {
        ref.current.msRequestFullscreen();
      }
    } else if (!enabled && document.fullscreenElement) {
      document.exitFullscreen();
    }
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
  }, [enabled]);

  return ref;
};

export default useFullscreen;
