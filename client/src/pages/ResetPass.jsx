import { Alert, Button } from "flowbite-react";
import React, { useState } from "react";
import { SessionExpired } from "../utils/Alert";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";
import axiosInstance from "../axiosInstance/axiosInstace";

export default function Reset() {
  const [cookies, setCookie, removeCookie] = useCookies(["recovery_token"]);
  const [ipassword, setPassword] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(ipassword);

    if (ipassword.password !== ipassword.confirmPassword) {
      setError("Passwords should match");
      setPassword({ ...ipassword, password: "" });
      return;
    }

    if (ipassword.confirmPassword === "" || ipassword.password === "") {
      setError("Please fill all the fields.");
      return;
    }

    try {
      const res = await axiosInstance.put(
        `/api/recover/reset_password`,
        ipassword,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const resData = res.data;
      console.log(resData);

      if (res.ok) {
        Swal.fire({
          title: "Success!",
          text: "Password is updated successfully, please login again",
          icon: "success",
          confirmButtonText: "Ok",
        });
        // Clear the recovery_token cookie
        removeCookie("recovery_token");
        // Redirect to sign-in page
        navigate("/sign-in", { replace: true });
      }
    } catch (error) {
      console.log(error.response.data);
      if (error.response.data.statusCode === 401) {
        Swal.fire({
          title: "Error!",
          text: "Your session is expired, please try again",
          icon: "error",
          confirmButtonText: "Ok",
        });
        // Clear the recovery_token cookie
        removeCookie("recovery_token");
        // Redirect to sign-in page
        navigate("/sign-in", { replace: true });
        return;
      }
    }
  };

  return (
    <div>
      <section className="bg-gray-50 w-screen dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
            <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Change Password
            </h2>
            <form
              className="mt-4 space-y-4 lg:mt-5 md:space-y-5"
              onSubmit={handleSubmit}
            >
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  New Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={ipassword.password}
                  onChange={(e) =>
                    setPassword({
                      ...ipassword,
                      password: e.target.value,
                    })
                  }
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required=""
                ></input>
              </div>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Confirm password
                </label>
                <input
                  type="password"
                  name="confirm-password"
                  value={ipassword.confirmPassword}
                  onChange={(e) =>
                    setPassword({
                      ...ipassword,
                      confirmPassword: e.target.value,
                    })
                  }
                  id="confirm-password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required=""
                ></input>
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="newsletter"
                    aria-describedby="newsletter"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    required=""
                  ></input>
                </div>

                <div className="ml-3 text-sm">
                  <label
                    htmlFor="newsletter"
                    className="font-light text-gray-500 dark:text-gray-300"
                  >
                    I accept the{" "}
                    <a
                      className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                      href="#"
                    >
                      Terms and Conditions
                    </a>
                  </label>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full"
                gradientDuoTone="purpleToPink"
              >
                Reset passwod
              </Button>
            </form>
            {errorMessage && (
              <Alert className="mt-5 font-medium capitalize" color="failure">
                {errorMessage}
              </Alert>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
