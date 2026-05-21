"use client";
import { Map } from "lucide-react";
import ContractorMap from "@/components/ContractorMap";

export default function ServiceAreaCard({ serviceArea }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 flex flex-col gap-3">
      <h3 className="text-base font-bold text-slate-800">Service Area</h3>
      {serviceArea && <ContractorMap serviceArea={serviceArea} />}
      {serviceArea?.address && (
        <p className="text-sm text-slate-500">
          <Map className="inline-block mr-2" size={16} />
          {serviceArea.address}
          {serviceArea.radiusKm && `, ${serviceArea.radiusKm}km radius`}
        </p>
      )}
    </div>
  );
}
