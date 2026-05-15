"use client";

import { RotateLoader, MoonLoader } from "react-spinners";

const override = {
  display: "block",
  margin: "100px auto",
};

export const RotateLoaderSpinner = ({ loading, size = 150 }) => {
  return (
    <RotateLoader
      cssOverride={override}
      color="##F54A00"
      loading={loading}
      size={size}
      aria-label="Loading Spinner"
    />
  );
};

export const MoonLoaderSpinner = ({ loading, size = 150 }) => {
  return (
    <MoonLoader
      cssOverride={override}
      color="##F54A00"
      loading={loading}
      size={size}
      aria-label="Loading Spinner"
    />
  );
};
