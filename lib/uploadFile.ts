// lib/uploadFile.ts

import { ID, storage } from "./appWrite";

interface UploadResult {
  success: boolean;
  fileUrl?: string;
  fileId?: string;
  error?: string;
}

export async function uploadAvatar(file: File): Promise<UploadResult> {
  try {
    // Create unique file name
    const fileId = ID.unique();
    const fileName = `${fileId}_${file.name}`;

    // Upload file to Appwrite Storage
    const uploadedFile = await storage.createFile(
      process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID!, // Your avatar bucket ID
      fileId,
      file
    );

    // Get file URL
    const fileUrl = storage.getFileView(
      process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID!,
      fileId
    ); // Add .href to get the string URL

    return {
      success: true,
      fileUrl,
      fileId,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    return {
      success: false,
      error: "Failed to upload file",
    };
  }
}
