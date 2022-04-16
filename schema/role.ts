import { relationship, text } from "@keystone-6/core/fields";
import { permissionFields } from "./../fields/permissions";
import { list } from "@keystone-6/core";
import { permissions } from "../access";

export const Role = list({
  access: {
    operation: {
      create: permissions.canManageRoles,
      update: permissions.canManageRoles,
      delete: permissions.canManageRoles,
    },
  },
  ui: {
    listView: {
      initialColumns: ["name"],
    },
    hideCreate: (args) => !permissions.canManageRoles(args),
    hideDelete: (args) => !permissions.canManageRoles(args),
    isHidden: (args) => !permissions.canManageRoles(args),
  },
  fields: {
    name: text({
      validation: { isRequired: true },
      isFilterable: true,
    }),
    ...permissionFields,
    assignedTo: relationship({
      ref: "User.role",
      many: true,
      ui: {
        itemView: { fieldMode: "read" },
      },
    }),
  },
});
