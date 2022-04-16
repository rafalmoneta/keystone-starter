import React from "react";

export const ImagePlaceholder = ({
  children,
  onClick,
}: {
  children?: React.ReactNode;
  onClick?(): void;
}): JSX.Element => {
  return (
    <div
      onClick={() => onClick?.()}
      style={{
        backgroundColor: "#e1e5e9",
        borderRadius: "8px",
        paddingBottom: "56.25%",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {children}
    </div>
  );
};
