import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { Spinner } from "flowbite-react";
import axiosInstance from "../axiosInstance/axiosInstace";

const OtpInput = () => {
  const { state } = useLocation();
  const [timerCount, setTimer] = useState(60);
  const [OTPinput, setOTPinput] = useState(["", "", "", ""]);
  const [disable, setDisable] = useState(true);
  const [Otp, setOtp] = useState(state?.otp ?? null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  console.log(state.otp);
  const inputRefs = useRef([]);
  // const location = useLocation();
  // console.log(location.state);
  // const [fromForgotPassword, setFromForgotPassword] = useState(false);

  // useEffect(() => {
  //   // // Check if the user came from the Forgot Password page
  //   // if (location.state && location.state.fromForgotPassword) {
  //   //   setFromForgotPassword(true);
  //   // }
  // }, [location.state]);
  const navigateToNextInput = (index) => {
    if (index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    } else {
      // All inputs filled
      // Perform verification or any other action here
    }
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    let interval = setInterval(() => {
      setTimer((prevTimerCount) => {
        if (prevTimerCount <= 1) {
          clearInterval(interval);
          setDisable(false);
        }
        return prevTimerCount - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [disable]);

  const resendOTP = async () => {
    state.otp = null;
    const newOTP = Math.floor(Math.random() * 9000 + 1000);
    setOtp(newOTP);
    console.log(newOTP);

    if (disable) return;
    setLoading(true);
    try {
      const res = await fetch(
        "https://clone-repo-fullstack-blog-app-1.onrender.com/api/recover/send_recovery_email",

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ Otp, recipient_email: state.email }),
        }
      );
      const data = await res.json();
      console.log(data);
      if (data.statusCode === 200) {
        setDisable(true);
        Swal.fire({
          title: "Alert!",
          text: "A new OTP has been sent to your email",
          icon: "success",
          confirmButtonText: "Ok",
        });
        setLoading(false);
        setTimer(60);
        console.log(loading);
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error!",
        text: `${error.response.data.errorMessage}`,
        icon: "error",
        confirmButtonText: "Ok",
      });
      setLoading(false);
    }
  };

  const verifyOTP = () => {
    const enteredOTP = OTPinput.join("");
    if (parseInt(enteredOTP) === Otp) {
      navigate("/reset", { state: { otp: Otp, email: state.email } });
    } else {
      Swal.fire({
        title: "Error!",
        text: "Please enter a valid OTP",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  const handleInputChange = (index, value) => {
    const updatedOTPinput = [...OTPinput];
    updatedOTPinput[index] = value;
    setOTPinput(updatedOTPinput);
    if (value !== "" && index < inputRefs.current.length - 1) {
      navigateToNextInput(index);
    }
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-gray-50">
      <div className="bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
        <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="font-semibold text-3xl">
              <p>Email Verification</p>
            </div>
            <div className="flex flex-row text-sm font-medium text-gray-400">
              <p>We have sent a code to your email {state.email}</p>
            </div>
          </div>

          <div>
            {loading ? (
              <div className="text-center">
                <Spinner size="xl" color="gray" />
              </div>
            ) : (
              <form>
                <div className="flex flex-col space-y-16">
                  <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
                    {OTPinput.map((value, index) => (
                      <div key={index} className="w-16 h-16 ">
                        <input
                          maxLength="1"
                          ref={(ref) => (inputRefs.current[index] = ref)}
                          className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                          type="text"
                          value={value}
                          onChange={(e) =>
                            handleInputChange(index, e.target.value)
                          }
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col space-y-5">
                    <div>
                      <button
                        type="button"
                        onClick={verifyOTP}
                        className="flex flex-row cursor-pointer items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-blue-700 border-none text-white text-sm shadow-sm"
                      >
                        Verify Account
                      </button>
                    </div>

                    <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                      <p>Didn't receive code?</p>{" "}
                      <button
                        type="button"
                        className="flex flex-row items-center"
                        style={{
                          color: disable ? "gray" : "blue",
                          cursor: disable ? "none" : "pointer",
                          textDecorationLine: disable ? "none" : "underline",
                        }}
                        onClick={resendOTP}
                        disabled={disable}
                      >
                        {disable
                          ? `Resend OTP in ${timerCount}s`
                          : "Resend OTP"}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpInput;
