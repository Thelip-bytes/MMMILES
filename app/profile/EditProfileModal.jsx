"use client";

import { useRef, useState } from "react";
import modalStyles from "./editProfile.module.css";

export default function EditProfileModal({ closeModal }) {
  const modalRef = useRef(null);

  // form state
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const allFilled = name && gender && phone && email;

  // Close modal when clicking outside
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeModal();
    }
  };

  // Save Handler with success toast
  const handleSave = (e) => {
    e.preventDefault();

    if (!allFilled) return; // prevent save

    // SUCCESS TOAST (same as your design)
    const toast = document.createElement("div");
    toast.className = modalStyles.toast;
    toast.innerText = "Profile Updated Successfully!";
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add(modalStyles.toastShow);
    }, 10);

    setTimeout(() => {
      toast.classList.remove(modalStyles.toastShow);
      setTimeout(() => toast.remove(), 300);
    }, 2000);

    closeModal();
  };

  return (
    <div className={modalStyles.modalOverlay} onClick={handleOutsideClick}>
      <div ref={modalRef} className={modalStyles.modalContainer}>

        {/* HEADER */}
        <div className={modalStyles.modalHeader}>
          <h2>Edit Profile</h2>
          <button className={modalStyles.closeBtn} onClick={closeModal}>✕</button>
        </div>

        {/* FORM */}
        <form className={modalStyles.form} onSubmit={handleSave}>

          <label>Name</label>
          <input 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />

          <label>Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <label>Phone Number</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="XXXXXXXXXX"
          />

          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@gmail.com"
          />

          <button
            className={`${modalStyles.saveBtn} ${!allFilled ? modalStyles.disabledBtn : ""}`}
            disabled={!allFilled}
          >
            Save
          </button>

        </form>
      </div>
    </div>
  );
}
