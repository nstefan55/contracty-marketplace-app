"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  MapPin,
  Map,
  Hammer,
  Banknote,
  Star,
  Briefcase,
  CircleCheck,
  BadgeCheck,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TRADES = [
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

const FilterSection = ({ icon: Icon, label, children }) => (
  <div className="flex flex-col gap-2">
    <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
      <Icon className="h-4 w-4 text-orange-500" />
      {label}
    </Label>
    {children}
  </div>
);

const RangeInputs = ({
  minName,
  maxName,
  minValue,
  maxValue,
  onChange,
  placeholderMin,
  placeholderMax,
  step = "1",
}) => (
  <div className="flex items-center gap-2">
    <Input
      type="number"
      name={minName}
      value={minValue}
      onChange={onChange}
      placeholder={placeholderMin}
      step={step}
      className="h-9"
    />
    <span className="text-slate-400">–</span>
    <Input
      type="number"
      name={maxName}
      value={maxValue}
      onChange={onChange}
      placeholder={placeholderMax}
      step={step}
      className="h-9"
    />
  </div>
);

const SidebarFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initial = {
    serviceArea: searchParams.get("serviceArea") || "",
    trade: searchParams.get("trade") || "",
    "serviceArea.address": searchParams.get("serviceArea.address") || "",
    "serviceArea.postcode": searchParams.get("serviceArea.postcode") || "",
    "priceRange.hourly.min": searchParams.get("priceRange.hourly.min") || "",
    "priceRange.hourly.max": searchParams.get("priceRange.hourly.max") || "",
    "priceRange.project.min": searchParams.get("priceRange.project.min") || "",
    "priceRange.project.max": searchParams.get("priceRange.project.max") || "",
    "averageRating.min": searchParams.get("averageRating.min") || "",
    "averageRating.max": searchParams.get("averageRating.max") || "",
    "yearsExperience.min": searchParams.get("yearsExperience.min") || "",
    available: searchParams.get("available") === "true",
    verified: searchParams.get("verified") === "true",
  };

  const [filters, setFilters] = useState(initial);

  useEffect(() => {
    setFilters(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const apply = (e) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val === "" || val === false || val == null) return;
      params.set(key, String(val));
    });
    params.set("page", "1");
    router.push(`/contractors?${params.toString()}`);
  };

  const clear = () => {
    setFilters({
      serviceArea: "",
      trade: "",
      "serviceArea.address": "",
      "serviceArea.postcode": "",
      "priceRange.hourly.min": "",
      "priceRange.hourly.max": "",
      "priceRange.project.min": "",
      "priceRange.project.max": "",
      "averageRating.min": "",
      "averageRating.max": "",
      "yearsExperience.min": "",
      available: false,
      verified: false,
    });
    router.push("/contractors");
  };

  return (
    <form
      onSubmit={apply}
      className="flex flex-col gap-5 rounded-xl border bg-white p-5 sticky top-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-bold text-slate-800">
          <SlidersHorizontal className="h-4 w-4 text-orange-500" />
          Filters
        </h2>
        <button
          type="button"
          onClick={clear}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-orange-500"
        >
          <X className="h-3 w-3" />
          Clear
        </button>
      </div>

      <Separator />

      <FilterSection icon={Map} label="Location">
        <Input
          type="text"
          name="serviceArea"
          value={filters.serviceArea}
          onChange={handleChange}
          placeholder="e.g. Zagreb, Croatia"
          className="h-9"
        />
      </FilterSection>

      <FilterSection icon={Hammer} label="Trade">
        <Select
          value={filters.trade || "all"}
          onValueChange={(v) =>
            setFilters((prev) => ({
              ...prev,
              trade: v === "all" ? "" : v,
            }))
          }
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Any trade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any trade</SelectItem>
            {TRADES.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterSection>

      <FilterSection icon={MapPin} label="Address">
        <Input
          type="text"
          name="serviceArea.address"
          value={filters["serviceArea.address"]}
          onChange={handleChange}
          placeholder="e.g. Ilica 1"
          className="h-9"
        />
      </FilterSection>

      <FilterSection icon={MapPin} label="Postcode">
        <Input
          type="text"
          name="serviceArea.postcode"
          value={filters["serviceArea.postcode"]}
          onChange={handleChange}
          placeholder="e.g. 10000"
          className="h-9"
        />
      </FilterSection>

      <FilterSection icon={Banknote} label="Hourly rate (EUR)">
        <RangeInputs
          minName="priceRange.hourly.min"
          maxName="priceRange.hourly.max"
          minValue={filters["priceRange.hourly.min"]}
          maxValue={filters["priceRange.hourly.max"]}
          onChange={handleChange}
          placeholderMin="Min"
          placeholderMax="Max"
        />
      </FilterSection>

      <FilterSection icon={Banknote} label="Project rate (EUR)">
        <RangeInputs
          minName="priceRange.project.min"
          maxName="priceRange.project.max"
          minValue={filters["priceRange.project.min"]}
          maxValue={filters["priceRange.project.max"]}
          onChange={handleChange}
          placeholderMin="Min"
          placeholderMax="Max"
        />
      </FilterSection>

      <FilterSection icon={Star} label="Rating">
        <RangeInputs
          minName="averageRating.min"
          maxName="averageRating.max"
          minValue={filters["averageRating.min"]}
          maxValue={filters["averageRating.max"]}
          onChange={handleChange}
          placeholderMin="Min"
          placeholderMax="Max"
          step="0.1"
        />
        <span className="text-[11px] text-slate-400">0 – 5</span>
      </FilterSection>

      <FilterSection icon={Briefcase} label="Min. experience (years)">
        <Input
          type="number"
          name="yearsExperience.min"
          value={filters["yearsExperience.min"]}
          onChange={handleChange}
          placeholder="e.g. 5"
          className="h-9"
        />
      </FilterSection>

      <Separator />

      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            name="available"
            checked={filters.available}
            onChange={handleChange}
            className="h-4 w-4 accent-orange-500"
          />
          <CircleCheck className="h-4 w-4 text-green-500" />
          Available now
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            name="verified"
            checked={filters.verified}
            onChange={handleChange}
            className="h-4 w-4 accent-orange-500"
          />
          <BadgeCheck className="h-4 w-4 text-blue-500" />
          Verified only
        </label>
      </div>

      <Button
        type="submit"
        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
      >
        Apply Filters
      </Button>
    </form>
  );
};

export default SidebarFilter;
