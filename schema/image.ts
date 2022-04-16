import "dotenv/config";
import { permissions } from "./../access";
import { list } from "@keystone-6/core";
import { text } from "@keystone-6/core/fields";
import { deleteLocalImage } from "../lib/deleteLocalImage";
import { cloudinaryImage } from "@keystone-6/cloudinary";
import { cloudinary } from "./../config";
import { afterDeleteCloudinaryImage } from "../lib/afterDeleteFieldHooks";

export const Image = list({
  ui: {
    isHidden: (args) => !permissions.canManageImages(args),
  },
  fields: {
    image: cloudinaryImage({
      cloudinary,
      label: "User Profile Image",
      hooks: {
        afterOperation: async ({ operation, originalItem, fieldKey }) => {
          if (operation === "update" || operation === "delete") {
            await afterDeleteCloudinaryImage(originalItem, fieldKey);
          }
        },
      },
    }),
    name: text({
      label: "Image name",
      validation: {
        isRequired: true,
      },
    }),
    altText: text(),
  },
  hooks: {
    afterOperation: async ({ operation, originalItem }) => {
      if (operation === "update" || operation === "delete") {
        await afterDeleteCloudinaryImage(originalItem, "image");
      }
    },
  },
});
