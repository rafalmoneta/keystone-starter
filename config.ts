import "dotenv/config";
// 3000 is standard for node apps
export const PORT = parseInt(process.env.PORT) || 3000;

export const DATABASE_URL = process.env.DATABASE_URL;

// Default to 30 days
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

export const SESSION_SECRET =
  process.env.SESSION_SECRET || "-- DEV COOKIE SECRET CHANGE ME LATER --";

export const cloudinary = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_KEY,
  apiSecret: process.env.CLOUDINARY_SECRET,
  folder: process.env.CLOUDINARY_FOLDER_NAME,
};

export const CLOUDINARY_CONFIG = {
  cloud_name: cloudinary.cloudName,
  api_key: cloudinary.apiKey,
  api_secret: cloudinary.apiSecret,
};
