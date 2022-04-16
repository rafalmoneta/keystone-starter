import { ImageItem } from "../components-blocks/image";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { ImageWrapper } from "./ImageWrapper";
import { Button } from "@keystone-ui/button";
import { useState } from "react";
import { ImageBox } from "./ImageBox";
import React from "react";
import Gallery from "./Gallery";

export const ImageComponent = ({
  listKey,
  value,
  onChange,
}: {
  listKey: string;
  value: ImageItem[];
  onChange(value: ImageItem[]): void;
}): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const removeImage = (item: ImageItem) => {
    onChange(value.filter((i) => i.id !== item.id));
  };

  const addImages = (items: ImageItem[]) => {
    const valueIds = value.map((i) => i.id);
    const newItems = items.filter((item) => !valueIds.includes(item.id))[0];
    newItems ? onChange([newItems]) : onChange([]);
  };

  const listItems = value.map((item: ImageItem) => {
    return (
      <ImageBox
        key={item.id}
        item={item}
        checked={false}
        onRemove={(item) => removeImage(item)}
      />
    );
  });

  return (
    <div>
      {value && value.length === 1 ? (
        <ImageWrapper>{listItems}</ImageWrapper>
      ) : (
        <ImageWrapper>
          <ImagePlaceholder />
        </ImageWrapper>
      )}
      <Button onClick={() => setIsModalOpen(true)}>
        <span>Add Images</span>
      </Button>
      <Gallery
        listKey={listKey}
        isOpen={isModalOpen}
        multiple={false}
        onCancel={() => setIsModalOpen(false)}
        onChange={(items) => addImages(items)}
      />
    </div>
  );
};
