import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { signoutSuccess } from "../redux/user/userSlice";

const SessionExpirationMonitor = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("in useEffect start");
    let inactivityTimer;

    const resetSession = () => {
      dispatch(signoutSuccess());
    };

    const handleUserActivity = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(resetSession, 60 * 60 * 1000);
    };

    // Attach event listeners for user activity
    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);

    // Clear timers and remove event listeners on component unmount
    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
    };
    console.log("end of UseEffect");
  }, [dispatch]);

  return null;
};

export default SessionExpirationMonitor;
