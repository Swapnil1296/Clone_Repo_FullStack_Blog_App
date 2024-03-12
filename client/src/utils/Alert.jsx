import Swal from "sweetalert2";

export const SessionExpired = () => {
  return Swal.fire({
    title: "Your session is expired!",
    text: "You will be redirected to Sign In page in 2 seconds.",
    timer: 2000,
    showCancelButton: false,
    showConfirmButton: false,
  });
};
