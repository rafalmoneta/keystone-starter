import { KeystoneListsAPI } from "@keystone-6/core/dist/declarations/src/types";
import { Permission } from "./fields/permissions";

export type Session = {
  itemId: string;
  listKey: string;
  data: {
    name: string;
    role?: {
      id: string;
      name: string;
    } & {
      [key in Permission]: boolean;
    };
  };
};

export type ListsAPI = KeystoneListsAPI<any>;
// export type GraphqlAPI = KeystoneGraphQLAPI<any>;

export type AccessArgs = {
  session?: Session;
  item?: any;
  context?: any; //TODO: change types later
  listKey?: any; //TODO: change types later
  operation?: any;
};

export type AccessControl = {
  [key: string]: (args: AccessArgs) => any;
};

export type ListAccessArgs = {
  itemId?: string;
  session?: Session;
};
