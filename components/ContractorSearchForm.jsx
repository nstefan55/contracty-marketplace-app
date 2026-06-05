"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ScanSearch } from "lucide-react";

const CONTRACTOR_TYPES = [
  "All",
  "General Contractor",
  "Electrician",
  "Plumber",
  "HVAC Technician",
  "Handyman",
  "Roofer",
  "Landscaper",
  "Mason",
  "Carpenter",
  "Concrete & Paving",
  "Painter",
  "Tiler",
  "Flooring Specialist",
  "Window & Door Specialist",
];

const ContractorSearchForm = () => {
  const [location, setLocation] = useState("");
  const [contractorType, setContractorType] = useState("All");

  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (location) params.set("serviceArea", location);
    if (contractorType && contractorType !== "All") {
      params.set("trade", contractorType);
    }

    const qs = params.toString();
    router.push(qs ? `/contractors?${qs}` : "/contractors");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-5 flex w-full max-w-2xl flex-col"
    >
      <div className="flex flex-col items-stretch gap-2 md:flex-row md:items-center">
        <label htmlFor="location" className="sr-only">
          Location
        </label>
        <div className="relative flex-1">
          <ScanSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 sm:h-5 sm:w-5" />
          <input
            type="text"
            id="location"
            placeholder="Search by Location"
            className="w-full rounded-lg bg-[#071525] py-3 pl-10 pr-4 text-white placeholder:text-white focus:outline-none focus:ring focus:ring-orange-500 sm:pl-11"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full whitespace-nowrap rounded-lg bg-orange-500 px-6 py-3 text-white hover:bg-orange-600 focus:outline-none focus:ring focus:ring-slate-700 md:w-auto"
        >
          Search
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-6 justify-center">
        {CONTRACTOR_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setContractorType(type)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring focus:ring-slate-700 ${
              contractorType === type
                ? "bg-orange-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {type}
          </button>
        ))}
      </div>
    </form>
  );
};

export default ContractorSearchForm;
