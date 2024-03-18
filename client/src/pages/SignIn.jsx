import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAth from "../components/OAuth";
import Swal from "sweetalert2";
import axiosInstance from "../axiosInstance/axiosInstace";
import axios from "axios";

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const [Otp, setOTP] = useState(null);
  // const [errorMessage, setErrorMessage] = useState(null);
  const [floading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const handelChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setLoading(true);
    // setErrorMessage(null);
    setShowPassword(false);
    dispatch(signInStart());
    if (!formData.email || !formData.password) {
      //return setErrorMessage("Please fill all the field.");
      return dispatch(signInFailure("Please fill all the field."));
    }
    try {
      const res = await fetch(`/api/auth/signin`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        // setLoading(false);
        // return setErrorMessage(data.errorMessage);
        dispatch(signInFailure(data.errorMessage));
      }
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
      //setLoading(false);
    } catch (error) {
      dispatch(signInFailure(error.errorMessage));
    }
  };
  const handlePasswordShow = () => {
    setShowPassword(!showPassword);
  };
  const handleForgotPass = async () => {
    if (!formData.email) {
      Swal.fire({
        title: "Error!",
        text: "Please enter your email address",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }

    const OTP = Math.floor(Math.random() * 9000 + 1000);
    setOTP(OTP);

    if (formData.email) {
      setLoading(true);
      const data = {
        OTP: OTP,
        recipient_email: formData.email,
      };
      try {
        const res = await fetch(
          "/api/recover/send_recovery_email",

          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(data),
          }
        );
        const resData = await res.json();
        console.log(resData);

        if (resData.statusCode === 200) {
          setLoading(false);
          console.log("navigate success");
          navigate("/otp-input", {
            state: { otp: OTP, email: formData.email },
            replace: true,
          });
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
        Swal.fire({
          title: "Error!",
          text: `something went wrong`,
          icon: "error",
          confirmButtonText: "Ok",
        });
        console.log(error);
      }
    }
  };
  // console.log(Otp);
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        <div className="flex-1">
          <Link to="/" className=" font-bold  dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Random
            </span>
            Blogs
          </Link>
          <p className="text-sm mt-5">
            This is a Demo Project . You can Sing In with your email & password
            or with Google.
          </p>
        </div>
        <div className="flex-1">
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <div>
              <Label value="Your Email" />
              <TextInput
                type="email"
                placeholder="your.email@gmail.com"
                id="email"
                onChange={handelChange}
              />
            </div>
            <div>
              <Label value="Your Password" />
              <div className="flex  justify-center items-center gap-2">
                <div className="flex-1">
                  <TextInput
                    type={showPassword ? "text" : "password"}
                    placeholder="**********"
                    id="password"
                    onChange={handelChange}
                  />
                </div>
                <div className="flex-2">
                  {showPassword ? (
                    <Button onClick={handlePasswordShow}>
                      <BiSolidShow size="18px" />
                    </Button>
                  ) : (
                    <Button onClick={handlePasswordShow}>
                      <BiSolidHide size="18px" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <Button gradientDuoTone="purpleToPink" type="submit">
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading ...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <OAth />
          </form>
          <div className=" my-1">
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              className="w-full"
              onClick={handleForgotPass}
            >
              {floading ? <Spinner /> : "Forgot Your Password Click here"}
            </Button>
          </div>
          <div className="flex gap-2 text-sm mt-5">
            <span>Don't Have an Account ?</span>
            <Link to={"/sign-up"} className="text-blue-500">
              Sign Up
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
