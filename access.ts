import { permissionsList } from "./fields/permissions";
import { AccessArgs, ListAccessArgs } from "./types";

export function isSignedIn({ session }) {
  return !!session;
}

const generatedPermissions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    function ({ session }): boolean {
      return !!session?.data.role?.[permission];
    },
  ])
);

type PermissionsTypes = {
  [key: string]: (args: AccessArgs) => boolean;
};

export const permissions = {
  ...generatedPermissions,
  isAwesome({ session }): boolean {
    return session?.data.name.includes("wes");
  },
} as PermissionsTypes;

export const rules = {
  isSuperAdmin({ session }) {
    if (!isSignedIn({ session })) return false;
    if (permissions.isSuperAdmin({ session })) return true;
    return false;
  },
  canManageUsers({ session }) {
    if (!isSignedIn({ session })) {
      return false;
    }
    if (permissions.canManageUsers({ session })) {
      return true;
    }
  },
  isUserOrAdmin({ session, item }) {
    if (!isSignedIn({ session })) {
      return false;
    }

    if (permissions.canManageUsers({ session })) {
      return true;
    }

    if (session?.data.id === item.id) {
      return true;
    }

    return false;
  },
  canManageOwnPostOrIsAdmin({ session, item }) {
    if (!isSignedIn({ session })) {
      return false;
    }
    if (permissions.isSuperAdmin({ session })) {
      return true;
    }
    // console.log(session.data.id, item.authorId);
    if (session?.data.id === item.authorId) {
      return true;
    }
    return false;
  },
};

// TODO: Clean non used functions

export const fieldModes = {
  isSuperAdmin: ({ session }: any) =>
    permissions.isSuperAdmin({ session }) ? "edit" : "hidden",
  // in use
  editSelfOrRead: ({ session, item }: any) =>
    permissions.canManageUsers({ session }) || session.itemId === item.id
      ? "edit"
      : "read",
  // in use
  editSelfOrHidden: ({ session, item }: any) =>
    permissions.canManageUsers({ session }) || session.itemId === item.id
      ? "edit"
      : "hidden",
  editOrHidePost: ({ session, item }: any) =>
    permissions.canManagePosts({ session }) && session.itemId === item.id
      ? "edit"
      : "hidden",
  editOrReadPost: ({ session, item }: any) =>
    permissions.canManagePosts({ session }) || session.itemId === item.id
      ? "edit"
      : "read",
  editOrReadRole: ({ session, item }: any) =>
    permissions.canManageRoles({ session }) ? "edit" : "read",

  editSelfOrReadPostAuthor: ({ session, item }: any) =>
    permissions.canManageUsers({ session }) && session.itemId === item.authorId
      ? "edit"
      : "read",
  editOwnPostOrRead: ({ session, item }: any) =>
    (permissions.canManagePosts({ session }) &&
      session.itemId === item.authorId) ||
    permissions.isSuperAdmin({ session })
      ? "edit"
      : "read",
};
