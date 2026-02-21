"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ClientRedirect({ to = "/" }) {
    const router = useRouter();

    useEffect(() => {
        // Instantly redirect human users
        router.replace(to);
    }, [router, to]);

    return null;
}
