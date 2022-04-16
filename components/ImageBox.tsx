import { ImageItem } from "../components-blocks/image";
import { Checkbox } from "@keystone-ui/fields";
import { Button } from "@keystone-ui/button";
import React from "react";

export const ImageBox = ({
  onClick,
  onRemove,
  item,
  checked = false,
}: {
  onClick?(value: ImageItem): void;
  onRemove?(value: ImageItem): void;
  item: ImageItem;
  checked?: boolean;
}) => {
  return (
    <div
      style={{
        backgroundColor: "#e1e5e9",
        borderRadius: "8px",
        paddingBottom: "56.25%",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
      }}
      onClick={() => onClick?.(item)}
    >
      {onClick && (
        <div
          style={{
            position: "absolute",
            zIndex: "1",
            margin: "10px",
            right: "0",
          }}
        >
          <Checkbox checked={checked} readOnly={true}>
            {}
          </Checkbox>
        </div>
      )}
      {onRemove && (
        <div
          style={{
            position: "absolute",
            zIndex: "1",
            margin: "10px",
            right: "0",
          }}
        >
          <Button size="small" tone="negative" onClick={() => onRemove(item)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </div>
      )}
      <img
        style={{
          objectFit: "cover",
          width: "100%",
          height: "100%",
          position: "absolute",
        }}
        // TODO: Fix types
        // @ts-ignore
        src={item.image?.publicUrlTransformed}
        alt={item.id}
      />
    </div>
  );
};
