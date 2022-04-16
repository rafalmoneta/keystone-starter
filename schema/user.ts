import { fieldModes, permissions, rules } from "./../access";
import { list } from "@keystone-6/core";
import { text, relationship, password } from "@keystone-6/core/fields";
import { cloudinaryImage } from "@keystone-6/cloudinary";
import { cloudinary } from "./../config";
import { afterDeleteCloudinaryImage } from "../lib/afterDeleteFieldHooks";

export const User = list({
  access: {
    operation: {
      create: permissions.canManageUsers,
    },
    item: {
      update: rules.isUserOrAdmin,
      delete: rules.isUserOrAdmin,
    },
  },
  ui: {
    hideCreate: (args) => !permissions.canManageUsers(args),
    hideDelete: (args) => !permissions.canManageUsers(args),
    itemView: {
      defaultFieldMode: fieldModes.editSelfOrRead,
    },
  },
  hooks: {
    afterOperation: async ({ operation, originalItem }) => {
      if (operation === "update" || operation === "delete") {
        await afterDeleteCloudinaryImage(originalItem, "image");
      }
    },
  },
  fields: {
    name: text({ validation: { isRequired: true } }),
    email: text({
      validation: { isRequired: true },
      isIndexed: "unique",
      isFilterable: true,
    }),
    password: password({
      validation: { isRequired: true },
      access: {
        read: rules.isUserOrAdmin,
        update: rules.isUserOrAdmin,
      },
      ui: {
        itemView: { fieldMode: fieldModes.editSelfOrHidden },
      },
    }),
    image: cloudinaryImage({
      cloudinary,
      label: "Image",
      hooks: {
        afterOperation: async ({ operation, originalItem, fieldKey }) => {
          if (operation === "update" || operation === "delete") {
            await afterDeleteCloudinaryImage(originalItem, fieldKey);
          }
        },
      },
    }),
    posts: relationship({
      ref: "Post.author",
      many: true,
      access: {
        create: permissions.canManageUsers,
        update: permissions.canManageUsers,
      },
      ui: {
        itemView: { fieldMode: fieldModes.editOrReadPost },
      },
    }),
    role: relationship({
      ref: "Role.assignedTo",
      many: false,
      access: {
        create: permissions.canManageUsers,
        update: permissions.canManageUsers,
      },
      ui: {
        itemView: { fieldMode: fieldModes.editOrReadRole },
      },
    }),
  },
});
