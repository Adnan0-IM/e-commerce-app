import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * A custom hook that scrolls the window to the top when the location changes.
 * This is useful for ensuring that the user sees the top of a new page when navigating.
 */
const RouteToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
export default RouteToTop;
