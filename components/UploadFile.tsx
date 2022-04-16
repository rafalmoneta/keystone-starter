import React, { useRef } from "react";
import { useToasts } from "@keystone-ui/toast";
import { useList } from "@keystone-6/core/admin-ui/context";
import { LoadingDots } from "@keystone-ui/loading";
import { useMutation, gql } from "@keystone-6/core/admin-ui/apollo";
import { ImagePlaceholder } from "./ImagePlaceholder";

export default function UploadFile({
  listKey,
  onFinished,
}: {
  listKey: string;
  onFinished?(): void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const list = useList(listKey);
  const toasts = useToasts();

  const UPLOAD_IMAGE = gql`
    mutation ${list.gqlNames.createMutationName}($name: String, $file: Upload) {
      ${list.gqlNames.createMutationName}(data: { image: $file, name: $name }) {
        id
      }
    }
  `;

  const [uploadImage, { loading }] = useMutation(UPLOAD_IMAGE);

  const onUploadChange = async ({
    currentTarget: { validity, files },
  }: React.SyntheticEvent<HTMLInputElement>) => {
    const file = files?.[0]; // bail if the user cancels from the file browser
    if (!file) return;

    for (var i = 0; i < files.length; i++) {
      try {
        await uploadImage({
          variables: { file: files[i], name: files[i].name },
        });
      } catch (err: any) {
        console.log(err);
        toasts.addToast({
          title: `Failed to upload file: ${files[i].name}`,
          tone: "negative",
          message: err.message,
        });
      }
    }

    onFinished?.();
  };

  return (
    <div>
      <ImagePlaceholder
        onClick={() => {
          inputRef.current?.click();
        }}
      >
        {loading ? (
          <LoadingDots
            style={{
              width: "40px",
              height: "8px",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              margin: "auto",
            }}
            size="small"
            label="Loading"
          />
        ) : (
          <svg
            style={{
              width: "32px",
              height: "32px",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              margin: "auto",
            }}
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
        )}
      </ImagePlaceholder>
      <input
        autoComplete="off"
        onChange={onUploadChange}
        type="file"
        ref={inputRef}
        style={{ display: "none" }}
        multiple={true}
        accept={"image/*"}
      />
    </div>
  );
}
