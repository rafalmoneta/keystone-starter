import { KeystoneContext } from "@keystone-6/core/types";
import { users, roles } from "./data";

type RoleProps = {
  id: string;
  name: string;
  canManageOffers: boolean;
  canManagePosts: boolean;
  canManageClients: boolean;
  canManageImages: boolean;
  canSeeOtherUsers: boolean;
  canManageUsers: boolean;
  canManageRoles: boolean;
  assignedTo: Object;
};

type AuthorProps = {
  name: string;
  email: string;
  role: Object;
};

// type PostProps = {
//   title: string;
//   status: string;
//   publishDate: string;
//   author: Object;
//   content: string;
// };

export async function insertSeedData(context: KeystoneContext) {
  console.log(`🌱 Inserting seed data`);

  const createRole = async (roleData: RoleProps) => {
    let role = await context.query.Role.findOne({
      where: { id: roleData.id },
      query: "id",
    });

    if (!role) {
      role = await context.query.Role.createOne({
        data: roleData,
        query: "id",
      });
    }
  };

  const createUser = async (userData: AuthorProps) => {
    let user = await context.query.User.findOne({
      where: { email: userData.email },
      query: "id",
    });

    if (!user) {
      user = await context.query.User.createOne({
        data: userData,
        query: "id",
      });
    }
  };

  // const createPost = async (postData: PostProps) => {
  //   let authors = await context.query.Author.findMany({
  //     where: { name: { equals: postData.author } },
  //     query: "id",
  //   });

  //   postData.author = { connect: { id: authors[0].id } };
  //   await context.query.Post.createOne({
  //     data: postData,
  //     query: "id",
  //   });
  // };

  for (const role of roles) {
    console.log(`Adding roles: ${role.name}`);
    await createRole(role);
  }

  for (const user of users) {
    console.log(`👩 Adding author: ${user.name}`);
    await createUser(user);
  }
  // for (const post of posts) {
  //   console.log(`📝 Adding post: ${post.title}`);
  //   await createPost(post);
  // }

  console.log(`✅ Seed data inserted`);
  console.log(
    `👋 Please start the process with \`yarn dev\` or \`npm run dev\``
  );
  process.exit();
}
