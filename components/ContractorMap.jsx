"use client";

import { useState, useEffect, useRef } from "react";
import opencage from "opencage-api-client";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { MoonLoaderSpinner } from "@/components/lib/Spinner";

const ContractorMap = ({ serviceArea }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [loading, setLoading] = useState(true);
  const [geoCodeError, setGeoCodeError] = useState(false);

  useEffect(() => {
    async function fetchCoordinates() {
      opencage
        .geocode({
          q: `${serviceArea.radiusKm} ${serviceArea.address} ${serviceArea.postcode}`,
          key: process.env.NEXT_PUBLIC_OPENCAGE_API_KEY,
        })
        .then((data) => {
          //console.log(JSON.stringify(data));
          if ((data.status.code === 200) & (data.results.length > 0)) {
            const place = data.results[0];
            // console.log(place.formatted);
            // console.log(place.annotations.timezone.name);
            console.log(place.geometry);
            setLat(place.geometry.lat);
            setLng(place.geometry.lng);
            setLoading(false);
          } else {
            console.log("Status", data.status.message);
            console.log("Total Results", data.total_results);
            setLoading(false);
            setGeoCodeError(true);
          }
        })
        .catch((err) => {
          console.log("Error", err.message);
          setLoading(false);
          setGeoCodeError(true);
          //Other possible response codes
          // https://opencagedata.com/api#codes
          if (err.status?.code === 402) {
            console.log("Hit Free Trial Daily Limits!");
            console.log("Become a customer: https://opencagedata.com/pricing");
          }
        });
    }

    fetchCoordinates();
  }, []);

  useEffect(() => {
    if (map.current) return;
    if (!loading && (lat !== null) & (lng !== null)) {
      maptilersdk.config.apiKey = process.env.NEXT_PUBLIC_MAPTILER_KEY;
      map.current = new maptilersdk.Map({
        container: mapContainer.current,
        style: maptilersdk.MapStyle.STREETS,
        center: [lng, lat],
        zoom: 14,
        maxZoom: 22,
      });

      new maptilersdk.Marker({ color: "#FF0000" })
        .setLngLat([lng, lat])
        .addTo(map.current);
    }
  }, [lng, lat, loading]);

  if (loading) return <MoonLoaderSpinner />;

  if (geoCodeError)
    return <div className="text-xl">No location data found</div>;

  return (
    <div
      ref={mapContainer}
      style={{ height: "500px", width: "100%" }}
      className="map"
    ></div>
  );
};

export default ContractorMap;
