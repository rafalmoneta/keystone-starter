import React from "react";

type ImageWrapper = {
  children: React.ReactNode;
};

export const GalleryView = ({ children }: ImageWrapper): JSX.Element => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: "1rem",
        margin: "30px 0",
      }}
    >
      {children}
    </div>
  );
};
