import React from "react";

type ImageWrapper = {
  children: React.ReactNode;
};

export const ImageWrapper = ({ children }: ImageWrapper): JSX.Element => {
  return (
    <div
      style={{
        display: "block",
        margin: "30px 0",
      }}
    >
      {children}
    </div>
  );
};
