import {
  View,
  Text,
  BackHandler,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
  Alert,
  FlatList,
  StyleSheet,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import icon from "@/constants/icon";
import { useAuth, useUser } from "@clerk/clerk-expo";
import RichTextEditor from "@/components/RichTextEditor";
import * as ImagePicker from "expo-image-picker";
import { getSupabaseFileUrl } from "@/service/imageService";
import {
  createOrUpadatePost2,
  fetchPosts2,
  getUserData2,
  removePost2,
} from "@/service/postService";
import PostCard2 from "@/components/PostCard2";
import { createClient } from "@supabase/supabase-js";

var limit = 0;

const AddictionHelp = () => {
  const supabaseUrl = "https://ecleafwuvusbyrzcuypi.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjbGVhZnd1dnVzYnlyemN1eXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwNDk4NTksImV4cCI6MjA1NzYyNTg1OX0.0dIH_SM50-zdKH1Or07_dRwEOOIe7YjDxe9ttqHsuq4";
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Extract the `showModal` parameter from the local search parameters
  const { showModal } = useLocalSearchParams();

  // Use an effect to check if the `showModal` parameter is set to "true"
  // If true, set the `infoModalVisible` state to true to display the modal
  useEffect(() => {
    if (showModal === "true") {
      setInfoModalVisible(true);
    }
  }, [showModal]);

  // State to hold the list of posts, initialized as an empty array
  const [posts, setPosts] = useState<{ id: number }[]>([]);

  // Function to handle post events received from the Supabase channel
  const handlePostEvent = async (payload: any) => {
    // Check if the event type is "INSERT" and the payload contains a valid post ID
    if (payload.eventType === "INSERT" && payload?.new?.id) {
      // Create a new post object from the payload
      let newPost = { ...payload.new };

      // Fetch user data associated with the post's user ID
      let res = await getUserData2(newPost.user_id);

      // Initialize postLikes and postComments for the new post
      newPost.postLikes = [];
      newPost.postComments = [{ count: 0 }];

      // Attach user data to the new post, if the fetch was successful
      newPost.user = res.success ? res.data : {};

      // Update the posts state by adding the new post to the beginning of the list
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    }
  };

  // Function to fetch posts from the server with a limit
  const getPosts = async () => {
    // Increment the limit by 10 for each fetch
    limit += 10;
    console.log("fetching post Limit:", limit);

    // Call the fetchPosts2 function to retrieve posts
    let res = await fetchPosts2(limit);

    // Check if the response indicates success
    if (res.success) {
      // If data is present in the response, update the posts state
      if (res.data) {
        setPosts(res.data);
      }
    }
  };

  // Effect to handle real-time updates and fetch initial posts
  useEffect(() => {
    // Create a Supabase channel to listen for changes in the "AH_Posts" table
    let postChannel = supabase
      .channel("AH_Posts") // Channel name
      .on(
        "postgres_changes", // Event type
        { event: "*", schema: "public", table: "AH_Posts" }, // Listen to all events on the "AH_Posts" table
        handlePostEvent // Callback function to handle the event
      )
      .subscribe(); // Subscribe to the channel

    // Fetch initial posts when the component mounts
    getPosts();

    // Cleanup function to remove the Supabase channel when the component unmounts
    return () => {
      supabase.removeChannel(postChannel);
    };
  }, []); // Empty dependency array ensures this effect runs only once

  // Reference to store the body content of the post
  const bodyRef = useRef("");

  // Reference to the RichTextEditor instance
  const editorRef = useRef<{ setContentHTML: (html: string) => void } | null>(
    null
  );

  // Router instance for navigation
  const router = useRouter();

  // State to manage the loading state during post submission
  const [loading, setLoading] = useState(false);

  // State to store the selected file (image or video) for the post
  const [file, setFile] = useState<any>(null);

  // State to control the visibility of the information modal
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  // Access the current user information using the useUser hook
  const { user } = useUser();

  // Effect to handle the hardware back button press on Android
  useEffect(() => {
    const backAction = () => {
      // Navigate back to the forum page
      router.replace("/(root)/(tabs)/forum");
      return true; // Prevent the default back action
    };

    // Add the back button event listener
    BackHandler.addEventListener("hardwareBackPress", backAction);

    // Cleanup function to remove the event listener when the component unmounts
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);

  // Function to handle the back button press
  const handleBack = async () => {
    try {
      // Redirect to the forum page
      router.replace("/(root)/(tabs)/forum");
    } catch (error) {
      // Log any errors that occur during navigation
      console.error("Error loading:", error);
    }
  };

  // Function to handle picking an image or video from the device's library
  const onPick = async (isImage: any) => {
    // Configuration for selecting media (image or video)
    let mediaConfig = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Default to images
      allowsEditing: true, // Allow editing the selected media
      quality: 0.7, // Set the quality of the media
    };

    // If not selecting an image, configure for video selection
    if (!isImage) {
      mediaConfig = {
        mediaTypes: ImagePicker.MediaTypeOptions.Videos, // Set to videos
        allowsEditing: true, // Allow editing the selected media
        quality: 0.7, // Set the quality of the media
      };
    }

    // Launch the media library for the user to pick an image or video
    let result = await ImagePicker.launchImageLibraryAsync(mediaConfig);

    // Log the selected file details if available
    if (result.assets) {
      console.log("File:", result.assets[0]);
    }

    // If the user did not cancel the selection, update the file state
    if (!result.canceled) {
      setFile(result.assets[0]); // Set the selected file
    }
  };

  // Function to check if the file is a local file
  const isLocalFile = (file: any) => {
    if (!file) return null; // Return null if no file is provided
    if (typeof file == "object") return true; // If the file is an object, it is considered local

    return false; // Otherwise, it is not a local file
  };

  // Function to determine the type of the file (image or video)
  const getFileType = (file: any) => {
    if (!file) return null; // Return null if no file is provided
    if (isLocalFile(file)) {
      return file.type; // Return the type property if the file is local
    }

    // Check if the file URI includes "postImages" to classify it as an image
    if (file.includes("postImages")) {
      return "image";
    }
    return "video"; // Otherwise, classify it as a video
  };

  // Function to get the URI of the file
  const getFileUri = (file: any) => {
    if (!file) return null; // Return null if no file is provided
    if (isLocalFile(file)) {
      return file.uri; // Return the URI property if the file is local
    }
    return getSupabaseFileUrl(file)?.uri; // Otherwise, get the URI from Supabase
  };

  // Function to handle the submission of a new post
  const onSubmit = async () => {
    // Check if the post body or file is empty
    if (!bodyRef.current && !file) {
      Alert.alert("Post", "Please add some content or image to post");
      return;
    }

    // Prepare the data for the new post
    let data = {
      file, // File (image or video) attached to the post
      body: bodyRef.current, // Body content of the post
      user_id: user?.id, // ID of the current user
    };

    // Set loading state to true while the post is being created
    setLoading(true);

    // Call the function to create or update the post
    let res = await createOrUpadatePost2(data);

    // Set loading state to false after the operation is complete
    setLoading(false);

    // Log the response from the post creation/update operation
    console.log("Post Response:", res);

    // If the post creation/update is successful
    if (res?.success) {
      setFile(null); // Clear the selected file
      setInfoModalVisible(false); // Close the modal
      bodyRef.current = ""; // Reset the post body content
      editorRef.current?.setContentHTML(""); // Clear the editor content
      router.replace("/(root)/(forum-pages)/Addiction-Help"); // Refresh the page
    }
  };

  // Function to handle the deletion of a post
  const onDeletePost = async (item: any) => {
    // Log the post to be deleted
    console.log("Delete Post:", item);

    // Call the function to remove the post
    let res = await removePost2(item.id);

    // If the post deletion is successful
    if (res.success) {
      router.replace("/(root)/(forum-pages)/Addiction-Help"); // Refresh the page
    } else {
      // Show an alert with the error message if deletion fails
      Alert.alert("Post", res.msg);
    }
  };
  return (
    <>
      <ImageBackground
        source={require("@/assets/images/backImg.jpg")}
        style={{ flex: 1 }}
      >
        <SafeAreaView>
          <FlatList
            data={posts}
            ListHeaderComponent={
              <View>
                <View className="bg-white/60 rounded-lg p-4 flex justify-center m-5">
                  <View className="flex flex-row justify-between">
                    <TouchableOpacity onPress={handleBack}>
                      <Image
                        source={icon.backArrow2}
                        className="w-8 h-8 mt-1"
                      />
                    </TouchableOpacity>
                    <Text className="text-center text-2xl font-semibold text-[#7769B7]">
                      Addiction Help
                    </Text>
                    <TouchableOpacity onPress={() => setInfoModalVisible(true)}>
                      <Image source={icon.add} className="w-10 h-10" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listStyle}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <PostCard2
                item={item}
                currentUser={user}
                router={router}
                showMoreIcon={true}
                showDelete={true}
                ondelete={onDeletePost}
              />
            )}
          />
        </SafeAreaView>
      </ImageBackground>
      <Modal transparent visible={infoModalVisible}>
        <View
          style={{ flex: 1 }}
          className="flex-1 justify-center items-center bg-black/50"
        >
          <View className="p-4 bg-white rounded-lg w-[100%] h-[100%]">
            <ScrollView
              style={{ flex: 1 }}
              nestedScrollEnabled
              contentContainerStyle={{ flexGrow: 1 }}
            >
              <Text className="text-xl text-center mt-2 mb-4 font-ztgatha">
                Create Post
              </Text>
              <View className="flex flex-row items-center">
                <View>
                  <Image
                    source={{
                      uri:
                        user?.externalAccounts[0]?.imageUrl ?? user?.imageUrl,
                    }}
                    style={{ width: 50, height: 50, borderRadius: 110 / 2 }}
                    className=" rounded-full h-[110px] w-[110px] border-[3px] border-white shadow-sm shadow-neutral-300 mr-1"
                  />
                </View>
                <View>
                  <View>
                    <Text className="font-rubik-light text-lg ">
                      {user?.firstName || "Not Found"}{" "}
                      {user?.lastName || "Not Found"}
                    </Text>
                    <Text>
                      {user?.primaryEmailAddress?.emailAddress || "Not Found"}
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setInfoModalVisible(false)}
                className="bg-gray-400 rounded-md p-3 mt-4"
              >
                <Text className="text-white text-center font-bold">Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onSubmit}
                className="bg-success-500 rounded-md p-3 mt-4"
              >
                <Text className="text-white text-center font-bold">Post</Text>
              </TouchableOpacity>
              <RichTextEditor
                editorRef={editorRef}
                onChange={(body: string) => (bodyRef.current = body)}
              />
              <TouchableOpacity onPress={() => onPick(true)}>
                <View className="bg-white border-[#4D5A60] border-2 rounded-lg mt-5 p-4 flex flex-row items-center justify-between">
                  <View>
                    <Text className="text-md font-ztgatha">
                      Add to your post
                    </Text>
                  </View>
                  <View>
                    <Image
                      source={icon.image}
                      className="w-8 h-8"
                      resizeMode="contain"
                    />
                  </View>
                </View>
              </TouchableOpacity>
              {file && (
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 10,
                  }}
                >
                  {getFileType(file) == "video" ? (
                    <></>
                  ) : (
                    <Image
                      source={{ uri: getFileUri(file) }}
                      resizeMode="contain"
                      style={{ width: "100%", height: 300 }}
                    />
                  )}
                  <Pressable
                    style={{ position: "absolute", top: 10, right: 10 }}
                    onPress={() => setFile(null)}
                  >
                    <Image source={icon.delete_} className="w-8 h-8" />
                  </Pressable>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default AddictionHelp;

const styles = StyleSheet.create({
  listStyle: {
    padding: 10,
  },
});
