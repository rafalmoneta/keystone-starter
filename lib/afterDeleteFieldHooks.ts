import cloudi from "cloudinary";
import { CLOUDINARY_CONFIG } from "../config";

export const afterDeleteCloudinaryImage = (originalItem, fieldKey) => {
  if (originalItem[fieldKey]) {
    let public_id = originalItem?.[fieldKey]?._meta?.public_id;
    if (public_id) {
      cloudi.v2.config(CLOUDINARY_CONFIG);
      cloudi.v2.uploader.destroy(public_id, { invalidate: true });
    }
  }
};
