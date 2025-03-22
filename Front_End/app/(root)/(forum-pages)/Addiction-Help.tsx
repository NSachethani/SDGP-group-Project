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

  const { showModal } = useLocalSearchParams();
    useEffect(() => {
      if (showModal === "true") {
        setInfoModalVisible(true);
      }
    }, [showModal]);

  const [posts, setPosts] = useState<{ id: number }[]>([]);

  const handlePostEvent = async (payload: any) => {
    if (payload.eventType === "INSERT" && payload?.new?.id) {
      let newPost = { ...payload.new };
      let res = await getUserData2(newPost.user_id);
      newPost.postLikes=[];
      newPost.postComments=[{count:0}];
      newPost.user = res.success ? res.data : {};
      setPosts((pervPosts) => [newPost, ...pervPosts]);
    }
  };

  const getPosts = async () => {
    limit += 10;
    console.log("fetching post Limit:", limit);
    let res = await fetchPosts2(limit);
    //console.log("Posts Response:", res);
    if (res.success) {
      if (res.data) {
        setPosts(res.data);
      }
    }
  };

  useEffect(() => {
    let postChannel = supabase
      .channel("AH_Posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "AH_Posts" },
        handlePostEvent
      )
      .subscribe();
    getPosts();

    return () => {
      supabase.removeChannel(postChannel);
    };
  }, []);

  const bodyRef = useRef("");
  const editorRef = useRef<{ setContentHTML: (html: string) => void } | null>(
    null
  );
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<any>(null);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const { user } = useUser();
  useEffect(() => {
    const backAction = () => {
      router.replace("/(root)/(tabs)/forum");
      return true;
    };
    BackHandler.addEventListener("hardwareBackPress", backAction);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);

  const handleBack = async () => {
    try {
      router.replace("/(root)/(tabs)/forum"); // redirect to forum page
    } catch (error) {
      console.error("Error loading:", error);
    }
  };

  const onPick = async (isImage: any) => {
    let mediaConfig = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    };
    if (!isImage) {
      mediaConfig = {
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.7,
      };
    }
    let result = await ImagePicker.launchImageLibraryAsync(mediaConfig);

    if (result.assets) {
      console.log("File:", result.assets[0]);
    }

    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  };

  const isLocalFile = (file: any) => {
    if (!file) return null;
    if (typeof file == "object") return true;

    return false;
  };

  const getFileType = (file: any) => {
    if (!file) return null;
    if (isLocalFile(file)) {
      return file.type;
    }

    if (file.includes("postImages")) {
      return "image";
    }
    return "video";
  };

  const getFileUri = (file: any) => {
    if (!file) return null;
    if (isLocalFile(file)) {
      return file.uri;
    }
    return getSupabaseFileUrl(file)?.uri;
  };

  const onSubmit = async () => {
    if (!bodyRef.current && !file) {
      Alert.alert("Post", "Please add some content or image to post");
      return;
    }

    let data = {
      file,
      body: bodyRef.current,
      user_id: user?.id,
    };
    setLoading(true);
    let res = await createOrUpadatePost2(data);
    setLoading(false);
    console.log("Post Response:", res);
    if (res?.success) {
      setFile(null);
      setInfoModalVisible(false);
      bodyRef.current = "";
      editorRef.current?.setContentHTML("");
      router.replace("/(root)/(forum-pages)/Addiction-Help");
    }
  };
  const onDeletePost = async (item: any) => {
    console.log("Delete Post:", item);
    let res = await removePost2(item.id);
    if (res.success) {
      router.replace("/(root)/(forum-pages)/Addiction-Help");
    } else {
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
