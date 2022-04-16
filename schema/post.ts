import { Session } from "./../types";
import { list } from "@keystone-6/core";
import { text, relationship, timestamp, select } from "@keystone-6/core/fields";
import { document } from "@keystone-6/fields-document";
import { fieldModes, permissions, rules } from "../access";
import { componentBlocks } from "../components-blocks";

function defaultSlug({ context, inputData }: any) {
  const date = new Date();
  return `${
    inputData?.title
      ?.trim()
      ?.toLowerCase()
      ?.replace(/[^\w ]+/g, "")
      ?.replace(/ +/g, "-") ?? ""
  }-${date?.getFullYear() ?? ""}${date?.getMonth() + 1 ?? ""}${
    date?.getDate() ?? ""
  }`;
}

function defaultTimestamp() {
  return new Date().toISOString();
}

const readOnlyPublished = ({ session }: { session: Session }) => {
  if (session?.data.role?.canManagePosts) return true;
  return { status: { equals: "published" } };
};

/*
  TODO:
  - [ ] ! Fix slug generator - allow user to change that!
  - [x] Normal user can, read only published posts
  - [x] Writer can CREATE, EDIT own posts
  - [x] Writer cannot EDIT others people posts
  - [x] Admin can CREATE, EDIT, DELETE all posts
  - [x] Fix Image and Gallery component!
  - [ ] Add SEO to the posts
  - [ ] ? Writer can only see his own drafts
  - [ ] ? User or reader dont see toolbar in document field and slug
*/

export const Post = list({
  access: {
    operation: {
      update: permissions.canManagePosts,
      create: permissions.canManagePosts,
    },
    item: {
      delete: rules.canManageOwnPostOrIsAdmin,
      update: rules.canManageOwnPostOrIsAdmin,
    },
    filter: {
      query: readOnlyPublished,
    },
  },
  ui: {
    hideCreate: (args) => !permissions.canManagePosts(args),
    // hideDelete: (args) => !permissions.isSuperAdmin(args),
    // hideDelete: true,
    itemView: {
      defaultFieldMode: fieldModes.editOwnPostOrRead,
    },
  },
  fields: {
    title: text(),
    slug: text({
      ui: { createView: { fieldMode: "hidden" } },
      isIndexed: "unique",
      hooks: {
        resolveInput: ({ operation, resolvedData, inputData, context }) => {
          if (operation === "create" && !inputData.slug) {
            return defaultSlug({ context, inputData });
          }
          if (operation === "update" && inputData.slug) {
            return inputData.slug;
          }
          return resolvedData.slug;
        },
      },
    }),
    status: select({
      options: [
        { label: "Published", value: "published" },
        { label: "Draft", value: "draft" },
      ],
      defaultValue: "draft",
      ui: {
        displayMode: "segmented-control",
      },
    }),
    content: document({
      formatting: true,
      layouts: [
        [1, 1],
        [1, 1, 1],
        [2, 1],
        [1, 2],
        [1, 2, 1],
      ],
      links: true,
      dividers: true,
      relationships: {
        images: {
          kind: "prop",
          listKey: "Image",
          many: true,
          // selection: "name allImages",
        },
      },
      componentBlocks,
      ui: {
        views: require.resolve("../components-blocks"),
      },
    }),

    publishedDate: timestamp({
      hooks: {
        resolveInput: ({ inputData, operation, resolvedData }) => {
          if (operation === "create" && !inputData.slug) {
            return defaultTimestamp();
          }
          return resolvedData.slug;
        },
      },
    }),
    author: relationship({
      ref: "User.posts",
      many: false,
      hooks: {
        resolveInput({ inputData, operation, resolvedData, context }) {
          if (operation === "create" && !inputData.author) {
            return { connect: { id: context.session.itemId } };
          }
          return resolvedData.author;
        },
      },
      ui: {
        itemView: { fieldMode: fieldModes.editSelfOrReadPostAuthor },
        createView: { fieldMode: "hidden" },
      },
    }),
    tags: relationship({
      ref: "Tag.posts",
      ui: {
        displayMode: "cards",
        cardFields: ["name"],
        inlineEdit: { fields: ["name"] },
        linkToItem: true,
        inlineConnect: true,
        inlineCreate: { fields: ["name"] },
      },
      many: true,
    }),
  },
});

export const Tag = list({
  ui: {
    isHidden: true,
  },
  fields: {
    name: text(),
    posts: relationship({ ref: "Post.tags", many: true }),
  },
});
