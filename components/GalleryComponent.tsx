import { ImageItem } from "../components-blocks/image";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { ImageWrapper } from "./ImageWrapper";
import { Button } from "@keystone-ui/button";
import { useState } from "react";
import { ImageBox } from "./ImageBox";
import React from "react";
import Gallery from "./Gallery";
import { GalleryView } from "./GalleryView";

export const GalleryComponent = ({
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
    const newItems = items.filter((item) => !valueIds.includes(item.id));
    onChange([...value, ...newItems]);
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
      {value.length > 0 ? (
        <GalleryView>{listItems}</GalleryView>
      ) : (
        <GalleryView>
          <ImagePlaceholder />
          <ImagePlaceholder />
          <ImagePlaceholder />
        </GalleryView>
      )}
      <Button onClick={() => setIsModalOpen(true)}>
        <span>Add Images</span>
      </Button>
      <Gallery
        listKey={listKey}
        isOpen={isModalOpen}
        multiple={true}
        onCancel={() => setIsModalOpen(false)}
        onChange={(items) => addImages(items)}
      />
    </div>
  );
};
