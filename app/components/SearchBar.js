"use client";
import styles from "./SearchBar.module.css";

export default function SearchBar() {
  return (
    <div className={styles.searchbody}>
    <div className={styles.searchWrapper}>
      <div className={styles.searchItem}>
        <strong>Location</strong>
        <span>📍 Choose Your Location</span>
      </div>

      <div className={styles.searchItem}>
        <strong>Pick-Up-Date</strong>
        <span>📅 From Date</span>
      </div>

      <div className={styles.searchItem}>
        <strong>Return Date</strong>
        <span>📅 To Date</span>
      </div>

      <button className={styles.searchBtn}>Search</button>
    </div>
    </div>
  );
}