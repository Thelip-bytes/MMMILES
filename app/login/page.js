"use client";
import { useState } from "react";
import Image from "next/image";
import "./login.css";

export default function LoginPage() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);

  const handleContinue = () => {
    const phoneRegex = /^[0-9]{10}$/;
    if (phoneRegex.test(phone)) {
      setStep(2);
    } else {
      alert("Please enter a valid 10-digit phone number");
    }
  };

  const handleOtpChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // auto focus next
      if (value && index < 3) {
        const next = document.getElementById(`otp-${index + 1}`); // ✅ FIXED
        if (next) next.focus();
      }

      // auto verify when filled
      if (newOtp.every((digit) => digit !== "")) {
        handleVerify(newOtp.join(""));
      }
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`); // ✅ FIXED
      if (prev) prev.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const data = e.clipboardData.getData("text").trim();
    if (/^\d{4}$/.test(data)) {
      const newOtp = data.split("");
      setOtp(newOtp);
      handleVerify(data);
      const last = document.getElementById("otp-3"); // ✅ FIXED
      if (last) last.focus();
    }
    e.preventDefault();
  };

  const handleVerify = (entered = otp.join("")) => {
    if (entered === "1234") {
      alert("✅ Login successful!");
    } else {
      alert("❌ Invalid OTP");
    }
  };

  return (
    <main className="login-wrapper">
      <div className="login-card">
        {/* Left side */}
        <div className="login-left">
          <Image
            src="/login banner.png"
            alt="Banner"
            width={400}
            height={150}
            className="banner-image"
          />
          <Image
            src="/our car2.png"
            alt="Car"
            width={400}
            height={300}
            className="car-image"
          />
        </div>

        {/* Right side */}
        <div className="login-right">
          {step === 1 && (
            <>
              <h2 className="form-title">LOGIN WITH US</h2>
              <input
                type="tel"
                placeholder="Enter your phone number"
                className="input-field"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <button className="continue-btn" onClick={handleContinue}>
                Continue
              </button>
              <div className="divider">
                <span>or</span>
              </div>
              <button className="google-btn">Login with Google</button>
            </>
          )}

          {step === 2 && (
            <div className="otp-card">
              <div className="otp-icon">📩</div>
              <h2 className="otp-title">Check Your Inbox</h2>
              <p className="otp-subtitle">
                We have sent a 4 digit verification code to<br />
                <strong className="phone-otp">+91 {phone}</strong>
              </p>

              <div className="otp-inputs">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`} // ✅ FIXED
                    type="text"
                    maxLength="1"
                    className="otp-box"
                    placeholder="-" // ✅ shows dash when empty
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                    onKeyDown={(e) => handleOtpKeyDown(e, i)}
                    onPaste={handleOtpPaste}
                  />
                ))}
              </div>

              <p className="resend-text">
                Not received yet?{" "}
                <span className="resend-link">Resend Now</span>
              </p>
              <p className="go-back" onClick={() => setStep(1)}>
                Go Back
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
