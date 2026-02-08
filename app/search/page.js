import React, { Suspense } from "react";
import SearchClient from "./SearchClient";
import Loading from "../components/Loading";
import "./search.css";

// The main Server Component for the search page
export default function SearchPage() {
  return (
    <Suspense fallback={<Loading fullScreen={true} size={60} />}>
      <SearchClient />
    </Suspense>
  );
}
