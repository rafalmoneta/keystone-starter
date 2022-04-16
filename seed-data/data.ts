export const roles = [
  {
    id: "id",
    name: "ADMIN",
    canManageOffers: true,
    canManagePosts: true,
    canManageClients: true,
    canManageImages: true,
    canSeeOtherUsers: true,
    canManageUsers: true,
    canManageRoles: true,
    asignedTo: {
      name: "admin",
      email: "admin@keystone.com",
      password: "admin",
    },
  },
];

export const users = [
  {
    name: "admin",
    email: "admin@keystone.com",
    password: "admin123",
    role: "ADMIN",
  },
  {
    name: "user",
    email: "user@keystone.com",
    password: "user",
  },
];
