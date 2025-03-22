import { uploadFile } from "./imageService";
import { createClient } from "@supabase/supabase-js";

  const supabaseUrl = "https://ecleafwuvusbyrzcuypi.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjbGVhZnd1dnVzYnlyemN1eXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwNDk4NTksImV4cCI6MjA1NzYyNTg1OX0.0dIH_SM50-zdKH1Or07_dRwEOOIe7YjDxe9ttqHsuq4";
  export const supabase = createClient(supabaseUrl, supabaseKey);

  export const createNotification = async (notification: any) => {
  
    try {
      const { data, error } = await supabase
        .from("ML_Notification")
        .insert(notification)
        .select()
        .single();
  
      if (error) {
        console.error("Notification error:", error);
        return { success: false, msg: "Something went wrong! (Notification)" };
      }
  
      return { success: true, data };
    } catch (error) {
      console.log("Notification error:", error);
      return { success: false, msg:  "Something went wrong! (Notification)" };
    }
  };


  export const fetchNotification = async (receiverid: any) => {
    try{
      const { data, error } = await supabase
      .from("ML_Notification")
      .select(
        `
        *,
        sender: senderid(user_id, id, first_name, last_name)
      `
      )
      .eq("receiverid", receiverid)
      .order("created_at", { ascending: false})
      if (error) {
        console.error("fetch Notification error:", error);
        return { success: false, msg: "Could not fetch Notification" };
      }
      return { success: true, data: data };
    }catch(error){
      console.log("fetch Notification error:", error);
      return { success: false, msg: "Could not fetch Notification" };
    }
  }


  {/*Addiction help*/}

  export const createNotification2 = async (notification: any) => {
  
    try {
      const { data, error } = await supabase
        .from("AH_Notification")
        .insert(notification)
        .select()
        .single();
  
      if (error) {
        console.error("Notification error:", error);
        return { success: false, msg: "Something went wrong! (Notification)" };
      }
  
      return { success: true, data };
    } catch (error) {
      console.log("Notification error:", error);
      return { success: false, msg:  "Something went wrong! (Notification)" };
    }
  };


  export const fetchNotification2 = async (receiverid: any) => {
    try{
      const { data, error } = await supabase
      .from("AH_Notification")
      .select(
        `
        *,
        sender: senderid(user_id, id, first_name, last_name)
      `
      )
      .eq("receiverid", receiverid)
      .order("created_at", { ascending: false})
      if (error) {
        console.error("fetch Notification error:", error);
        return { success: false, msg: "Could not fetch Notification" };
      }
      return { success: true, data: data };
    }catch(error){
      console.log("fetch Notification error:", error);
      return { success: false, msg: "Could not fetch Notification" };
    }
  }


   {/*Digital Wellness*/}

   export const createNotification3 = async (notification: any) => {
  
    try {
      const { data, error } = await supabase
        .from("DW_Notification")
        .insert(notification)
        .select()
        .single();
  
      if (error) {
        console.error("Notification error:", error);
        return { success: false, msg: "Something went wrong! (Notification)" };
      }
  
      return { success: true, data };
    } catch (error) {
      console.log("Notification error:", error);
      return { success: false, msg:  "Something went wrong! (Notification)" };
    }
  };


  export const fetchNotification3 = async (receiverid: any) => {
    try{
      const { data, error } = await supabase
      .from("DW_Notification")
      .select(
        `
        *,
        sender: senderid(user_id, id, first_name, last_name)
      `
      )
      .eq("receiverid", receiverid)
      .order("created_at", { ascending: false})
      if (error) {
        console.error("fetch Notification error:", error);
        return { success: false, msg: "Could not fetch Notification" };
      }
      return { success: true, data: data };
    }catch(error){
      console.log("fetch Notification error:", error);
      return { success: false, msg: "Could not fetch Notification" };
    }
  }

  {/*Offline Bliss */}

  export const createNotification4 = async (notification: any) => {
  
    try {
      const { data, error } = await supabase
        .from("OB_Notification")
        .insert(notification)
        .select()
        .single();
  
      if (error) {
        console.error("Notification error:", error);
        return { success: false, msg: "Something went wrong! (Notification)" };
      }
  
      return { success: true, data };
    } catch (error) {
      console.log("Notification error:", error);
      return { success: false, msg:  "Something went wrong! (Notification)" };
    }
  };


  export const fetchNotification4 = async (receiverid: any) => {
    try{
      const { data, error } = await supabase
      .from("OB_Notification")
      .select(
        `
        *,
        sender: senderid(user_id, id, first_name, last_name)
      `
      )
      .eq("receiverid", receiverid)
      .order("created_at", { ascending: false})
      if (error) {
        console.error("fetch Notification error:", error);
        return { success: false, msg: "Could not fetch Notification" };
      }
      return { success: true, data: data };
    }catch(error){
      console.log("fetch Notification error:", error);
      return { success: false, msg: "Could not fetch Notification" };
    }
  }