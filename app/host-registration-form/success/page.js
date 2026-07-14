"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "../HostRegistration.module.css";

export default function RegistrationSuccess() {
  const router = useRouter();
  const [hostName, setHostName] = useState("Host");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const name = sessionStorage.getItem("registered_host_name");
      if (name) {
        setHostName(name);
      }
    }
  }, []);

  return (
    <section className={styles.hregSuccessSection}>
      <div className={styles.hregSuccessCard}>
        <Image
          src="/success-mail.webp"
          alt="Success"
          width={280}
          height={190}
          priority
          className={styles.hregSuccessImage}
        />

        <h1 className={styles.hregSuccessH1}>
          Congratulations
        </h1>

        <h3 className={styles.hregSuccessH3}>
          Congratulations {hostName}! Your host account setup is complete.
        </h3>

        <div className={styles.hregSuccessButtons}>
          <button
            className={styles.hregExploreBtn}
            onClick={() => router.push("https://host-dashboard.mmmiles.com")}
          >
            HOST PANEL
          </button>

          <button
            className={styles.hregDownloadBtn}
          >
            DOWNLOAD APP
          </button>
        </div>

        <p className={styles.hregSuccessText}>
          You can log in to the Host Panel, list your car in your
          location, and start earning with MMMiles today.
          
          Download the app and take full control of your
          car hosting experience.
        </p>
      </div>
    </section>
  );
}