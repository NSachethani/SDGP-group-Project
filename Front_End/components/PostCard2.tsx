import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-expo";
import { clerk } from "@clerk/clerk-expo/dist/provider/singleton";
import { useAuth } from "@clerk/clerk-expo";
import moment from "moment";
import RenderHtml from "react-native-render-html";
import { getSupabaseFileUrl } from "@/service/imageService";
import Icon from "@/constants/icon";
import { createPostLike2, RemovePostLike2 } from "@/service/postService";

interface PostLike {
  user_id: string;
  postid: string;
}
const PostCard = ({
  item,
  currentUser,
  router,
  showMoreIcon = true,
  showDelete=false,
  ondelete=()=>{}

}: {
  item: any;
  currentUser: any;
  router: any;
  showMoreIcon: boolean;
  showDelete: boolean;
  ondelete: any;
}) => {
  const { user } = useUser();
  const shadowStyles = {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowradius: 6,
    elevation: 1,
  };

  const [likes, setLikes] = useState<PostLike[]>([]);

  useEffect(() => {
    setLikes(item?.AH_PostLikes ?? []);
  }, [item?.AH_PostLikes]);

  const userId = item?.user?.user_id ?? item?.user_id;
  const firstName = item?.user?.first_name ?? item?.first_name;
  const lastName = item?.user?.last_name ?? item?.last_name;
  const createdat = moment(
    item?.user?.created_at || item?.created_at
  ).fromNow();

  const { getToken } = useAuth();
  const [ownerImage, setOwnerImage] = useState<string>("");

  useEffect(() => {
    if (!userId) return;
    (async () => {
      //console.log("PostCard userId:", userId); // Debug: see what ID is passed
      try {
        const id = "sk_live_mHb9McBDKG1aSJI4xWs2lytKJTB7NgRZJ4P1rzPN1Q";
        const token = await getToken({ template: "clerk_img" });
        //console.log("Token acquired:", !!token);
        const resp = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
          headers: { Authorization: `Bearer ${id}` },
        });
        //console.log("Clerk fetch status:", resp.status);
        const userData = await resp.json();
        //console.log("Fetched Clerk user data:", userData);
        if (resp.ok && userData?.profile_image_url) {
          setOwnerImage(userData.profile_image_url);
        }
      } catch (error) {
        console.error("Error fetching post owner from Clerk:", error);
      }
    })();
  }, [userId]);

  const comments = [];

  const openPostDetails = () => {
    if (!showMoreIcon) return null;
    router.push({
      pathname: "/(root)/(forum-pages)/postDetails2",
      params: { postId: item?.id },
    });
  };

  const onLike = async () => {
    if (liked) {
      let updatedLikes = likes.filter(
        (like) => like.user_id !== currentUser?.id
      );
      setLikes([...updatedLikes]);
      let res = await RemovePostLike2(item?.id, currentUser?.id);
      if (res.success) {
        console.log("Remove Liked");
      }
      if (!res.success) {
        Alert.alert("Post", "Something went wrong, please try again later");
      }
    } else {
      let data = {
        user_id: currentUser.id,
        postid: item.id,
      };
      setLikes([...likes, data]);
      let res = await createPostLike2(data);
      if (res.success) {
        console.log("Liked");
      }
      if (!res.success) {
        Alert.alert("Post", "Something went wrong, please try again later");
      }
    }
  };
  const liked = likes.filter((like) => like.user_id === currentUser?.id)[0]
    ? true
    : false;


  const handlePostDelete = () => {
    Alert.alert("Confirm", "Are you sure you want to delete this comment?", [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: () => ondelete(item),
            style: "destructive",
          }
        ])
  };
  console.log("post item comments:", item?.AH_PostComments);
  return (
    <View
      className="bg-white rounded-lg p-4 flex justify-center m-2"
      style={shadowStyles}
    >
      <View className="flex flex-row justify-between">
        <View className="flex flex-row">
          <Image
            source={{ uri: ownerImage || "https://placehold.co/50x50" }}
            style={{ width: 50, height: 50, borderRadius: 25 }}
          />
          <View className="flex flex-col ml-2 justify-center">
            <Text className="font-rubik-semibold text-lg">
              {firstName} {lastName}
            </Text>
            <Text className="font-rubik-light text-sm">{createdat}</Text>
          </View>
        </View>
        {
          showDelete &&  currentUser.id === item?.user_id && (
            <View>
              <TouchableOpacity onPress={handlePostDelete}>
                <Icon.comdelete color="red" />
              </TouchableOpacity>
            </View>
          )
        }
      </View>
      <View className="mt-2 mb-1">
        {item?.body && (
          <RenderHtml contentWidth={100} source={{ html: item.body }} />
        )}
      </View>
      <View>
        {item?.file && item?.file?.includes("postImages") && (
          <Image
            source={{
              uri: `https://ecleafwuvusbyrzcuypi.supabase.co/storage/v1/object/public/uploads/${item.file}`,
            }}
            style={{ width: "100%", height: 300, borderRadius: 10 }}
            resizeMode="cover"
          />
        )}
      </View>
      <View className="flex flex-row  mt-4 gap-5">
        <View className="flex flex-row gap-1 justify-center items-center">
          <TouchableOpacity onPress={onLike}>
            <Icon.heartlike
              color={liked ? "#E32227" : "#4D5A60"}
              size={24}
              fill={liked ? "#E32227" : "transparent"}
            />{" "}
          </TouchableOpacity>
          <Text className="text-lg ml-2">{likes.length}</Text>
        </View>
        <View className="flex flex-row gap-1 justify-center items-center">
          <TouchableOpacity onPress={openPostDetails}>
            <Icon.comment color="#4D5A60" size={24} />{" "}
          </TouchableOpacity>
          <Text className="text-lg ml-2">
            {item?.AH_PostComments?.length ?? 0}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default PostCard;
