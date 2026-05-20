"use client";
import Image from "next/image";
import { Map } from "lucide-react";

const maptilerKey = process.env.NEXT_PUBLIC_MAPTILER_KEY;

export default function ServiceAreaCard({ serviceArea }) {
  const hasCoords = serviceArea?.lat && serviceArea?.lng;
  const zoom = 9;

  const mapUrl = hasCoords
    ? `https://api.maptiler.com/maps/streets/static/${serviceArea.lng},${serviceArea.lat},${zoom}/600x300.png?key=${maptilerKey}`
    : null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 flex flex-col gap-3">
      <h3 className="text-base font-bold text-slate-800">Service Area</h3>
      {mapUrl ? (
        <div className="rounded-lg overflow-hidden w-full aspect-video bg-slate-100 relative">
          <Image
            src={mapUrl}
            alt="Service area map"
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="rounded-lg bg-slate-100 w-full aspect-video flex items-center justify-center">
          <p className="text-sm text-slate-400">Map not available</p>
        </div>
      )}
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
