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

const PropertySearchForm = () => {
  const [name, setName] = useState("");
  const [contractorType, setContractorType] = useState("All");

  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (name === "" && contractorType === "All") {
      router.push("/contractors");
    } else {
      const query = `?name=${name}&contractorType=${contractorType}`;
      router.push(`/contractors/search-results${query}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className=" mx-auto max-w-2xl w-full flex flex-col mt-5"
    >
      <div className="flex flex-col md:flex-row items-center gap-2 relative">
        <label htmlFor="name" className="sr-only">
          Name
        </label>
        <div>
          <ScanSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <input
          type="text"
          id="name"
          placeholder="Search by Trade or Name"
          className="w-full pl-8 px-4 py-3 rounded-lg bg-[#071525] text-white placeholder:text-white focus:outline-none focus:ring focus:ring-orange-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          type="submit"
          className="w-full md:w-auto px-6 py-3 rounded-lg bg-orange-500 text-white hover:bg-orange-600 focus:outline-none focus:ring focus:ring-slate-700 whitespace-nowrap"
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

export default PropertySearchForm;
