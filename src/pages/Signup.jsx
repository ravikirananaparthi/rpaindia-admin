import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase.config";
import { collection, doc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import Login from "./Login";

export default function SignUp() {
  return (
    <>
      <div className="flex min-h-screen flex-1">
        <div className="flex flex-1 flex-col justify-center px-4 py-5 sm:px-6 lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <img
                alt="Your Company"
                src="https://firebasestorage.googleapis.com/v0/b/devfinds-ravi8130.appspot.com/o/simplykart_logo.png?alt=media&token=0e4f12e6-8a97-4713-baf9-dfb8fe381a45"
                className="h-24 w-28"
              />

              <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900">
                Sign in to your account
              </h2>
              <Login />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
