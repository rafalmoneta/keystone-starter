import React, { useState, useMemo } from "react";
import { Drawer, DrawerController, DrawerProvider } from "@keystone-ui/modals";
import { useToasts } from "@keystone-ui/toast";
import {
  ApolloClient,
  useQuery,
  useMutation,
  useApolloClient,
  InMemoryCache,
  gql,
} from "@keystone-6/core/admin-ui/apollo";

import { Button } from "@keystone-ui/button";
import { useList } from "@keystone-6/core/admin-ui/context";
import { LoadingDots } from "@keystone-ui/loading";
import { ImageItem } from "../components-blocks/image";
import { ImageBox } from "./ImageBox";
import { GalleryView } from "./GalleryView";
import UploadFile from "./UploadFile";

export default function Gallery({
  listKey,
  isOpen,
  onCancel,
  onChange,
  multiple = false,
}: {
  listKey: string;
  isOpen: boolean;
  onCancel(): void;
  onChange(items: ImageItem[]): void;
  multiple?: boolean;
}) {
  const [selected, setSelected] = useState<string[]>([]);

  const list = useList(listKey);
  const link = useApolloClient().link;
  const toasts = useToasts();

  // we're using a local apollo client here because writing a global implementation of the typePolicies
  // would require making assumptions about how pagination should work which won't always be right
  const apolloClient = useMemo(
    () =>
      new ApolloClient({
        link,
        cache: new InMemoryCache({
          typePolicies: {
            Query: {
              fields: {
                [list.gqlNames.listQueryName]: {
                  keyArgs: ["where"],
                  merge: (
                    existing: readonly unknown[],
                    incoming: readonly unknown[],
                    { args }
                  ) => {
                    const merged = existing ? existing.slice() : [];
                    const { skip } = args!;
                    for (let i = 0; i < incoming.length; ++i) {
                      merged[skip + i] = incoming[i];
                    }
                    return merged;
                  },
                },
              },
            },
          },
        }),
      }),
    [link]
  );

  const GET_IMAGES = gql`
    query ${list.gqlNames.listQueryName}($take: Int, $skip: Int) {
      ${list.gqlNames.listQueryName}(orderBy: [{ id: desc }], take: $take, skip: $skip) {
        id
        name
        image {
          id
          ref
          url
        }
      }
      ${list.gqlNames.listQueryCountName}
    }
  `;

  const DELETE_IMAGES = gql`
    mutation ${list.gqlNames.deleteManyMutationName}($where: [${list.gqlNames.whereUniqueInputName}!]!) {
      ${list.gqlNames.deleteManyMutationName}(where: $where) {
        id
      }
    }
  `;

  const { loading, error, data, fetchMore, refetch } = useQuery(GET_IMAGES, {
    variables: {
      skip: 0,
      take: list.pageSize,
    },
    client: apolloClient,
  });

  const [deleteImages, {}] = useMutation(DELETE_IMAGES, {
    refetchQueries: [GET_IMAGES, list.gqlNames.listQueryName],
    client: apolloClient,
  });

  const actions = {
    cancel: {
      action: () => onCancel(),
      label: "Cancel",
    },
    confirm: {
      action: () => {
        const images = data[list.gqlNames.listQueryName].filter(
          (item: ImageItem) => selected.includes(item.id)
        );
        console.log(images);

        onChange(images);
        setSelected([]);
        onCancel();
      },
      label: "Confirm",
    },
  };

  const toggleItem = (item: ImageItem) => {
    if (multiple) {
      setSelected(
        selected.includes(item.id)
          ? selected.filter((i) => i != item.id) //remove item
          : [...selected, item.id]
      );
    } else {
      setSelected([item.id]);
    }
  };

  const deleteItems = async () => {
    const items = selected.map((item) => {
      return {
        id: item,
      };
    });

    try {
      await deleteImages({
        variables: {
          where: items,
        },
      });

      setSelected([]);
    } catch (err: any) {
      toasts.addToast({
        title: "Failed to delete image",
        tone: "negative",
        message: err.message,
      });
    }
  };

  const listItems =
    loading || error
      ? []
      : data[list.gqlNames.listQueryName].map((item: ImageItem) => {
          return (
            <ImageBox
              key={item.id}
              item={item}
              checked={selected.includes(item.id)}
              onClick={() => toggleItem(item)}
            />
          );
        });

  return (
    <DrawerProvider>
      <DrawerController isOpen={isOpen}>
        <Drawer title="Image Gallery" actions={actions}>
          {loading ? (
            <div
              style={{
                minHeight: "calc(100vh - 170px)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <LoadingDots label="Loading" />
            </div>
          ) : (
            <div
              style={{
                minHeight: "calc(100vh - 170px)",
              }}
            >
              {error ? (
                <div>Error has occurred: {error?.message}</div>
              ) : (
                <div>
                  <div
                    style={{
                      padding: "20px 0 0 0",
                      display: "flex",
                      justifyContent: "space-between",
                      minHeight: "52px",
                    }}
                  >
                    <div>
                      Showing{" "}
                      <strong>
                        {data[list.gqlNames.listQueryName].length}
                      </strong>{" "}
                      of {data[list.gqlNames.listQueryCountName]} image(s)
                    </div>
                    {selected.length > 0 && (
                      <Button
                        tone="negative"
                        size="small"
                        onClick={() => deleteItems()}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                  <GalleryView>
                    <UploadFile
                      listKey={listKey}
                      onFinished={() => refetch()}
                    />
                    {listItems}
                  </GalleryView>
                  {data[list.gqlNames.listQueryCountName] > list.pageSize && (
                    <div>
                      <Button
                        onClick={() =>
                          fetchMore({
                            variables: {
                              skip: data[list.gqlNames.listQueryName].length,
                            },
                          })
                        }
                      >
                        Fetch more
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </Drawer>
      </DrawerController>
    </DrawerProvider>
  );
}
