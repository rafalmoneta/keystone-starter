import {
  BaseListTypeInfo,
  CommonFieldConfig,
  fieldType,
  FieldTypeFunc,
} from "@keystone-6/core/types";
import {
  component,
  fields,
  FormField,
  NotEditable,
} from "@keystone-6/fields-document/component-blocks";
import { FieldContainer } from "@keystone-ui/fields";
import { ImageWrapper } from "../components/ImageWrapper";
import { ImagePlaceholder } from "../components/ImagePlaceholder";
import { ImageComponent } from "../components/ImageComponent";
import { ImageBox } from "../components/ImageBox";
import React from "react";
import { GalleryView } from "../components/GalleryView";
import Gallery from "../components/Gallery";
import { GalleryComponent } from "../components/GalleryComponent";

export type ImageCustomFieldConfig<ListTypeInfo extends BaseListTypeInfo> =
  CommonFieldConfig<ListTypeInfo> & {
    publicUrlTransformed?: string;
    listKey?: string;
  };

export type CloudinaryImageType = {
  filename?: string;
  originalFilename?: string;
  publicUrl?: string;
  publicUrlTransformed?: string;
  id?: string;
};

export type ImageItem = {
  name?: string;
  image?: CloudinaryImageType;
  id: string;
  url?: string;
};

const customFields = {
  image<Option extends { label: string; value: ImageItem }>({
    listKey,
    defaultValue = [],
  }: {
    listKey: string;
    defaultValue?: Option["value"][];
  }): FormField<Option["value"][], undefined> {
    return {
      kind: "form",
      Input({ value, onChange }) {
        return (
          <FieldContainer>
            <GalleryComponent
              value={value}
              onChange={(items) => onChange(items)}
              listKey={listKey}
            />
          </FieldContainer>
        );
      },
      options: undefined,
      defaultValue,
      validate(value) {
        return typeof value === "object";
      },
    };
  },
};

export const galleryComponentBlock = component({
  component: ({ items }) => {
    return (
      <div>
        <NotEditable>
          {items.value.length > 0 ? (
            <GalleryView>
              {items.value.map((item) => {
                return <ImageBox key={item.id} item={item} />;
              })}
            </GalleryView>
          ) : (
            <GalleryView>
              <ImagePlaceholder />
              <ImagePlaceholder />
              <ImagePlaceholder />
            </GalleryView>
          )}
        </NotEditable>
      </div>
    );
  },
  label: "Gallery",
  props: {
    items: customFields.image({
      listKey: "Image",
    }),
  },
});
