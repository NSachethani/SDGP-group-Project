import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  BackHandler,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import {
  createPostComment,
  fetchPostDetails,
  getUserData,
  removeComment,
  removePost,
  supabase,
} from "@/service/postService";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { router, useRouter } from "expo-router";
import PostCard from "@/components/PostCard";
import Input from "@/components/Input";
import Icon from "@/constants/icon";
import CommentItem from "@/components/CommentItem";
import { createNotification } from "@/service/notificationService";

const postDetails = () => {
  const { postId } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useUser();
  const [startLoading, setStartLoading] = useState(true);
  const inputRef = useRef<{ clear: () => void } | null>(null);
  const commentRef = useRef("");
  const [loading, setLoading] = useState(false);

  const [post, setPost] = useState<{ id: string; [key: string]: any } | null>(
    null
  );

  // useEffect(() => {
  //   getPostDetails();
  // }, []);
  useEffect(() => {
    const backAction = () => {
      router.replace("/(root)/(forum-pages)/Mindful-Living");
      return true;
    };
    BackHandler.addEventListener("hardwareBackPress", backAction);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);

  const handleNewComment = async (payload: any) => {
    console.log("New Comment:", payload.new);
    if (payload.new) {
      let newComment = { ...payload.new };
      let res = await getUserData(newComment.user_id);
      newComment.user = res.success ? res.data : {};
      setPost((prevPost: any) => {
        return {
          ...prevPost,
          ML_PostComments: [newComment, ...prevPost.ML_PostComments],
        };
      });
    }
  };

  useEffect(() => {
    let commentChannel = supabase
      .channel("ML_PostComments")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "ML_PostComments",
          filter: `postid = eq.${postId}`,
        },
        handleNewComment
      )
      .subscribe();

    getPostDetails();

    return () => {
      supabase.removeChannel(commentChannel);
    };
  }, []);

  const getPostDetails = async () => {
    let res = await fetchPostDetails(postId as any);
    console.log("post details:", res);
    if (res.success) {
      setPost(res.data);
    }
    setStartLoading(false);
  };

  const reloadPage = async () => {
    getPostDetails();
  };

  const reloadScreen = () => {
    router.replace({
      pathname: "/(root)/(forum-pages)/postDetails",
      params: { postId },
    });
  };

  if (startLoading) {
    return (
      <View className="flex-1 flex-row justify-center items-center gap-3">
        <Text className="font-ztgatha text-2xl">Loading</Text>
        <ActivityIndicator size="large" color="#2095F2" />
      </View>
    );
  }

  const onNewComment = async () => {
    if (!commentRef.current) return null;
    let data = {
      text: commentRef.current,
      postid: post?.id,
      user_id: user?.id,
    };
    setLoading(true);
    let res = await createPostComment(data);
    setLoading(false);
    if (res.success) {
      if (user?.id !== post?.user_id) {
        let notify = {
          senderid: user?.id,
          receiverid: post?.user_id,
          title: "commented on your post",
          data: JSON.stringify({ postId: post?.id, commentId: res?.data?.id }),
        };
        createNotification(notify);
      }

      inputRef?.current?.clear();
      commentRef.current = "";
    } else {
      Alert.alert("Comment", res.msg);
    }
  };

  const onDeleteComment = async (comment: any) => {
    console.log("Delete Comment:", comment);
    let res = await removeComment(comment.id);
    if (res.success) {
      setPost((prevPost: any) => {
        let updatedPost = { ...prevPost };
        updatedPost.ML_PostComments = updatedPost.ML_PostComments.filter(
          (item: any) => item.id !== comment.id
        );
        return updatedPost;
      });
    }
  };

  const onDeletePost = async (item: any) => {
    console.log("Delete Post:", item);
    let res = await removePost(item.id);
    if (res.success) {
      router.replace("/(root)/(forum-pages)/Mindful-Living");
    } else {
      Alert.alert("Post", res.msg);
    }
  };
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", paddingVertical: 10 }}
    >
      <ScrollView className="px-4">
        <PostCard
          item={post}
          currentUser={user}
          router={router}
          showMoreIcon={false}
          showDelete={true}
          ondelete={onDeletePost}
        />
        <View className="flex flex-row items-center justify-between gap-2">
          <Input
            inputRef={inputRef}
            onChangeText={(value: string) => (commentRef.current = value)}
            placeholder="Add a reply"
          />
          {loading ? (
            <View>
              <ActivityIndicator size="small" color="#2095F2" />
            </View>
          ) : (
            <TouchableOpacity
              className="flex items-center justify-center p-2 bg-white border border-gray-300  rounded-lg"
              onPress={() => {
                onNewComment();
                setTimeout(() => {
                  reloadScreen();
                }, 500);
              }}
            >
              <Icon.sendIcon color="#2095F2" />
            </TouchableOpacity>
          )}
        </View>
        <View className="flex flex-col gap-2 mt-4">
          <Text className="font-rubik-semibold text-lg">Comments</Text>
          {post?.ML_PostComments?.map((comment: any) => (
            <CommentItem
              key={comment?.id?.toString()}
              item={comment}
              onDelete={onDeleteComment}
              canDelete={
                comment.user_id == user?.id || user?.id == post.user_id
              }
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default postDetails;

//05.28
