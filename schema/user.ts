import { fieldModes, permissions, rules } from "./../access";
import { list } from "@keystone-6/core";
import { text, relationship, password, image } from "@keystone-6/core/fields";
import { deleteLocalImage } from "../lib/deleteLocalImage";

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
    image: image(),
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
