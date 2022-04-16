import "dotenv/config";
import { permissions } from "./../access";
import { list } from "@keystone-6/core";
import { image, text } from "@keystone-6/core/fields";
import { deleteLocalImage } from "../lib/deleteLocalImage";

export const Image = list({
  ui: {
    isHidden: (args) => !permissions.canManageImages(args),
  },
  fields: {
    image: image(),
    name: text({
      label: "Image name",
      validation: {
        isRequired: true,
      },
    }),
    altText: text(),
  },
  hooks: {
    afterOperation: async ({ operation, originalItem, item }) => {
      if (operation === "update") {
        if (
          (!item.image_id && originalItem.image_id) ||
          (item.image_id !== originalItem.image_id && originalItem.image_id)
        ) {
          deleteLocalImage("/assets/images", originalItem.image_id);
        }
      }
      if (operation === "delete") {
        if (originalItem.image_id) {
          deleteLocalImage("/assets/images", originalItem.image_id);
        }
      }
    },
  },
});
