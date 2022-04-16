import { config } from "@keystone-6/core";
import { lists } from "./schema";
import { PORT, DATABASE_URL } from "./config";
import { withAuth, session } from "./auth";

export default withAuth(
  config({
    files: {
      upload: "local",
      local: {
        storagePath: "assets/files",
        baseUrl: "/files",
      },
    },
    images: {
      upload: "local",
      local: {
        storagePath: "assets/images",
        baseUrl: "/images",
      },
    },
    db: {
      provider: "postgresql",
      useMigrations: true,
      url: DATABASE_URL,
    },
    server: {
      cors: {
        credentials: true,
        origin: "*",
      },
      port: PORT,
    },
    ui: {
      isAccessAllowed: (context) => !!context.session?.data,
    },
    lists,
    session,
  })
);
