"use client";

import { useRouter } from "next/navigation";

const ClearFiltersButton = () => {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push("/contractors")}
      className={
        "w-full whitespace-nowrap rounded-lg bg-orange-500 px-6 py-3 text-white hover:bg-orange-600 focus:outline-none focus:ring focus:ring-slate-700 md:w-auto"
      }
    >
      Clear Filters
    </button>
  );
};

export default ClearFiltersButton;
