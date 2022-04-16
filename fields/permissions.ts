import { checkbox } from "@keystone-6/core/fields";

export const permissionFields = {
  //basic permission
  isSuperAdmin: checkbox({
    defaultValue: false,
    label: "Super Admin can do everything",
  }),
  canManagePosts: checkbox({
    defaultValue: false,
    label: "User can CREATE, UPDATE, and DELETE blog posts",
  }),
  canManageImages: checkbox({
    defaultValue: false,
    label: "User can CREATE, UPDATE, and DELETE images (be carefull)",
  }),
  //
  canSeeOtherUsers: checkbox({
    defaultValue: false,
    label: "User can query other users",
  }),
  //for Admin and Super Admin
  canManageUsers: checkbox({
    defaultValue: false,
    label: "User can edit other users",
  }),
  canManageRoles: checkbox({
    defaultValue: false,
    label: "User can CREATE, UPDATE, and DELETE roles",
  }),
};

export type Permission = keyof typeof permissionFields;

export const permissionsList = Object.keys(permissionFields) as Permission[];
