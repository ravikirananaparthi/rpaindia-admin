import { CgSpinner } from "react-icons/cg";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast } from "react-hot-toast";
import { auth } from "../firebase.config";
import { useNavigate } from "react-router-dom";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

const Login = () => {
  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const db = getFirestore();
  const [formattedPhone, setFormattedPhone] = useState("");

  async function checkUserExists(phoneNumber) {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("phoneNumber", "==", phoneNumber));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0].data(); 
        if (userDoc.fullName) {
          localStorage.setItem("fullName", userDoc.fullName); 
        }
        return true;
      }
  
      return false;
    } catch (error) {
      console.error("Error checking user existence:", error);
      throw error;
    }
  }

  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onSignup();
          },
          "expired-callback": () => {},
        },
        auth
      );
    }
  }

  async function onSignup() {
    setLoading(true);
    setError("");

    try {
      // Format phone number
      const formatPh = "+" + ph;
      setFormattedPhone(formatPh);

      // Check if user exists before proceeding
      const userExists = await checkUserExists(formatPh);

      if (!userExists) {
        setLoading(false);
        setError("Access denied. User not registered in the system.");
        return;
      }

      // Proceed with OTP verification if user exists
      onCaptchVerify();
      const appVerifier = window.recaptchaVerifier;

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formatPh,
        appVerifier
      );
      window.confirmationResult = confirmationResult;
      setLoading(false);
      setShowOTP(true);
      toast.success("OTP sent successfully!");
    } catch (error) {
      console.log(error);
      setLoading(false);
      if (error.code === "auth/invalid-phone-number") {
        setError("Invalid phone number format");
      } else if (error.code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else {
        setError("Error sending OTP. Please try again.");
      }
    }
  }

  async function onOTPVerify() {
    setLoading(true);
    try {
      const result = await window.confirmationResult.confirm(otp);
      setUser(result.user);
      console.log(result);

      // Extract `isNewUser` from the response
      const isNewUser = result?._tokenResponse?.isNewUser;

      // Format phone number and store it in localStorage
      const formattedPhone = result.user.phoneNumber;
      localStorage.setItem("ph", formattedPhone);

      setLoading(false);

      // Navigate based on user status
      if (isNewUser) {
        navigate("/admin/profile");
        toast.error("Please create a profile");
      } else {
        navigate("/admin/dashboard");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError("Invalid OTP. Please try again.");
      toast.error("Invalid OTP");
    }
  }

  return (
    <section className="space-y-4">
      <div>
        <div id="recaptcha-container"></div>

        <div className="w-80 flex flex-col rounded-lg">
          {showOTP ? (
            <>
              <div className="w-fit mx-auto p-4 rounded-full"></div>
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Enter OTP
                </label>
                <input
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  length={5}
                  className="w-full px-3 py-1.5 border rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>
              <button
                onClick={onOTPVerify}
                className="bg-sky-500 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded mt-2"
              >
                {loading && (
                  <CgSpinner size={20} className="mt-1 animate-spin" />
                )}
                <span>Verify OTP</span>
              </button>
            </>
          ) : (
            <>
              <div className="bg-white text-emerald-500 w-fit mx-auto rounded-full"></div>
              <label
                htmlFor=""
                className="font-bold text-xl text-white text-center"
              >
                Login
              </label>
              <PhoneInput country={"in"} value={ph} onChange={setPh} />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              <button
                onClick={onSignup}
                className="bg-sky-500 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded mt-2"
              >
                {loading && (
                  <CgSpinner size={20} className="mt-1 animate-spin" />
                )}
                <span>Send code via SMS</span>
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Login;
