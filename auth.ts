import { permissionsList } from "./fields/permissions";
import { createAuth } from "@keystone-6/auth";
import { statelessSessions } from "@keystone-6/core/session";
import { SESSION_MAX_AGE, SESSION_SECRET } from "./config";

const { withAuth } = createAuth({
  listKey: "User",
  identityField: "email",
  sessionData: `id name role { ${permissionsList.join(" ")}}`,
  secretField: "password",
  initFirstItem: {
    fields: ["name", "email", "password"],
    itemData: {
      role: {
        create: {
          name: "ADMIN",
          isSuperAdmin: true,
          canManagePosts: true,
          canManageImages: true,
          canSeeOtherUsers: true,
          canManageUsers: true,
          canManageRoles: true,
        },
      },
    },
  },
});

const session = statelessSessions({
  maxAge: SESSION_MAX_AGE,
  secret: SESSION_SECRET!,
});

export { withAuth, session };
