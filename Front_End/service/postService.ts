import { uploadFile } from "./imageService";
import { createClient } from "@supabase/supabase-js";

  const supabaseUrl = "https://ecleafwuvusbyrzcuypi.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjbGVhZnd1dnVzYnlyemN1eXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwNDk4NTksImV4cCI6MjA1NzYyNTg1OX0.0dIH_SM50-zdKH1Or07_dRwEOOIe7YjDxe9ttqHsuq4";
  export const supabase = createClient(supabaseUrl, supabaseKey);

export const createOrUpadatePost = async (post: any) => {


  try {
    if (post.file && typeof post.file == "object") {
      let isImage = post?.file?.type == "image";
      let folderName = isImage ? "postImages" : "postVideos";
      let fileResults = await uploadFile(folderName, post?.file?.uri, isImage);
      // Instead of storing the full JSON, store only the file "path" as text.
      if (fileResults.success && fileResults.data?.path) {
        post.file = fileResults.data.path;
      } else {
        return fileResults;
      }
    }

    const { data, error } = await supabase
      .from("ML_Posts")
      .upsert(post)
      .select()
      .single();
    if (error) {
      console.error("createPost error:", error);
      return { success: false, msg: "Could not create post" };
    }
    return { success: true, data };
  } catch (error) {
    console.log("createPost error:", error);
    return { success: false, msg: "Could not create post" };
  }
};

export const fetchPosts = async (limit = 50) => {

  try {
    const { data, error } = await supabase
      .from("ML_Posts")
      .select(
        `
        *,
        user:tasks(user_id, id, first_name, last_name),
        ML_PostLikes (*),
        ML_PostComments(*)
      `
      )
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("fetchPost error:", error);
      return { success: false, msg: "Could not fetch posts" };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("FetchPosts error:", error);
    return { success: false, msg: "Could not fetchn the posts" };
  }
};

export const getUserData = async (user_id: string) => {

  try {
    const { data, error } = await supabase
      .from("tasks")
      .select()
      .eq("user_id", user_id)
      .single();
    if (error) {
      console.error("getUserData error:", error);
      return { success: false, msg: error?.message };
    }
    return { success: true, data: data };
  } catch (error: any) {
    console.log("getUserData error:", error);
    return { success: false, msg: error?.message };
  }
};

export const createPostLike = async (postLike: any) => {

  try {
    const { data, error } = await supabase
      .from("ML_PostLikes")
      .insert(postLike)
      .select()
      .single();

    if (error) {
      console.error("Post Like error:", error);
      return { success: false, msg: "Could not like posts" };
    }

    return { success: true, data };
  } catch (error) {
    console.log("Post Like error:", error);
    return { success: false, msg: "Could not like the posts" };
  }
};

export const RemovePostLike = async (postId: any, user_id: String) => {


  try {
    const { error } = await supabase
      .from("ML_PostLikes")
      .delete()
      .eq("user_id", user_id)
      .eq("postid", postId);

    if (error) {
      console.error("Post Like error:", error);
      return { success: false, msg: "Could not like posts" };
    }

    return { success: true, data: "Post like removed" };
  } catch (error) {
    console.log("Post Like error:", error);
    return { success: false, msg: "Could not like the posts" };
  }
};


export const fetchPostDetails = async (postId: string) => {
  try{
    const { data, error } = await supabase
    .from("ML_Posts")
    .select(
      `
      *,
      user:tasks(user_id, id, first_name, last_name),
      ML_PostLikes (*),
      ML_PostComments(*,user:tasks(user_id, id, first_name, last_name))
    `
    )
    .eq("id", postId)
    .order("created_at", { ascending: false, foreignTable: "ML_PostComments" })
    .single();
    if (error) {
      console.error("fetchPostDetails error:", error);
      return { success: false, msg: "Could not fetch post details" };
    }
    return { success: true, data: data };
  }catch(error){
    console.log("fetchPostDetails error:", error);
    return { success: false, msg: "Could not fetch post details" };
  }
}

export const createPostComment = async (comment: any) => {

  try {
    const { data, error } = await supabase
      .from("ML_PostComments")
      .insert(comment)
      .select()
      .single();

    if (error) {
      console.error("Post Comment error:", error);
      return { success: false, msg: "Could not comment posts" };
    }

    return { success: true, data };
  } catch (error) {
    console.log("Post Comment error:", error);
    return { success: false, msg: "Could not comment the posts" };
  }
};


export const removeComment = async (commentId: string) => {

  try {
    const { error } = await supabase
      .from("ML_PostComments")
      .delete()
      .eq("id", commentId);

    if (error) {
      console.error("Remove Comment error:", error);
      return { success: false, msg: "Could not remove comment" };
    }

    return { success: true, data: {commentId} };
  } catch (error) {
    console.log("Remove Comment error:", error);
    return { success: false, msg: "Could not remove the comment" };
  }
};


export const removePost = async (postId: string) => {

  try {
    const { error } = await supabase
      .from("ML_Posts")
      .delete()
      .eq("id", postId);

    if (error) {
      console.error("Remove Post error:", error);
      return { success: false, msg: "Could not remove post" };
    }

    return { success: true, data: {postId} };
  } catch (error) {
    console.log("Remove Post error:", error);
    return { success: false, msg: "Could not remove the post" };
  }
};