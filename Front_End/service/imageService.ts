import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ecleafwuvusbyrzcuypi.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjbGVhZnd1dnVzYnlyemN1eXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwNDk4NTksImV4cCI6MjA1NzYyNTg1OX0.0dIH_SM50-zdKH1Or07_dRwEOOIe7YjDxe9ttqHsuq4";
const supabase = createClient(supabaseUrl, supabaseKey);

export const getSupabaseFileUrl = (filePath: any) => {
  if (filePath) {
    return {
      uri: `https://ecleafwuvusbyrzcuypi.supabase.co/storage/v1/object/public/uploads/${filePath}`,
    };
  }
  return null;
};

export const uploadFile = async (
  folderName: any,
  fileUri: any,
  isImage: any
) => {
  try {
    let fileName = getFilePath(folderName, isImage);
    const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    let imageData = decode(fileBase64);
    let { data, error } = await supabase.storage
      .from("uploads")
      .upload(fileName, imageData, {
        cacheControl: "3600",
        upsert: false,
        contentType: isImage ? "image/*" : "video/*",
      });
    if (error) {
      console.error("Error uploading file:", error);
      return { success: false, msg: "Could not upload media" };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Error uploading file:", error);
    return { success: false, msg: "Could not upload media" };
  }
};

export const getFilePath = (folderName: string, isImage: string) => {
  // Ensure getTime() is invoked with parentheses.
  return `/${folderName}/${new Date().getTime()}${isImage ? ".png" : ".mp4"}`;
};
