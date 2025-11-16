"use client";
import { useState } from "react";
import Image from "next/image";
import { Mail, Phone, Edit } from "lucide-react";

import styles from "./profile.module.css";
import EditProfileModal from "./EditProfileModal"; // IMPORT MODAL

export default function ProfilePage() {
  const [avatar, setAvatar] = useState("/profile-defualt.jpg");
  const [isDragging, setIsDragging] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Validate + preview image file
  const processFile = (file) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be under 2MB");
      return;
    }

    const url = URL.createObjectURL(file);

    setAvatar((prev) => {
      if (prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return url;
    });
  };

  // Input upload
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  // Drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  return (
    <>
      <div className={styles.appWrapper}>
        <div className={styles.appContainer}>

          {/* TOP SECTION */}
          <div className={styles.topSection}>
            
            {/* Avatar Drop Zone */}
            <div
              className={`${styles.avatarDropZone} ${isDragging ? styles.dragActive : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Image
                src={avatar}
                alt="Profile Avatar"
                width={95}
                height={95}
                className={styles.avatar}
                unoptimized
              />

              <label className={styles.uploadBadge}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className={styles.fileInput}
                />
                Change
              </label>

              {isDragging && (
                <div className={styles.dragOverlay}>Drop Image Here</div>
              )}
            </div>

            {/* User Basic Info */}
            <div className={styles.userText}>
              <h1 className={styles.userName}>Harisha</h1>
              <p className={styles.userSubtitle}>9945686287</p>
            </div>

            {/* Edit Button */}
            <div className={styles.topButtons}>
              <button className={styles.editBtn} onClick={() => setShowEditModal(true)}>
                <Edit size={18} />
                Edit Profile
              </button>
            </div>

          </div>

          {/* PROFILE INFO SECTION */}
          <h2 className={styles.sectionTitle}>Profile Information</h2>

          <div className={styles.infoGrid}>

            <div className={styles.infoCard}>
              <label className={styles.infoLabel}>Full Name</label>
              <div className={styles.infoValue}>Harisha</div>
            </div>

            <div className={styles.infoCard}>
              <label className={styles.infoLabel}>Email</label>
              <div className={styles.infoValue}>
                <Mail size={18} className={styles.infoIcon} />
                harishaise2024@gmail.com
              </div>
            </div>

            <div className={styles.infoCard}>
              <label className={styles.infoLabel}>Phone</label>
              <div className={styles.infoValue}>
                <Phone size={18} className={styles.infoIcon} />
                +91 9945686287
              </div>
            </div>

            <div className={styles.infoCard}>
              <label className={styles.infoLabel}>Gender</label>
              <div className={styles.infoValue}>Male</div>
            </div>

          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {showEditModal && (
        <EditProfileModal closeModal={() => setShowEditModal(false)} />
      )}
    </>
  );
}
