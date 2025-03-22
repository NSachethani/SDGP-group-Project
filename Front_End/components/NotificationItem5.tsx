import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import moment from "moment";

const NotificationItem5 = ({ item, router }: { item: any; router: any }) => {
  const { getToken } = useAuth();
  const [ownerImage, setOwnerImage] = useState<string>("");
  const userId = item?.sender?.user_id ?? item?.user_id;

  const createdat = moment(
    item?.user?.created_at || item?.created_at
  ).fromNow();
  useEffect(() => {
    if (!userId) return;
    (async () => {
      //console.log("PostCard userId:", userId); 
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

const handleClick = () => {
    let postId, commentId;
    try {
        if (item?.data) {
            ({ postId, commentId } = JSON.parse(item.data));
        }
    } catch (error) {
        console.error("Error parsing item data:", error);
    }

    if (postId || commentId) {
        router.push({
            pathname: "/(root)/(forum-pages)/postDetails5",
            params: { postId, commentId },
        });
    } else {
        console.warn("No postId or commentId found, staying on the current page.");
    }
};

  return (
    <View>
      <TouchableOpacity onPress={handleClick}>
        <View className="flex flex-row justify-between gap-4 mt-2 mb-2 ml-4 mr-4 bg-white/60 rounded-3xl p-4">
          <View className="flex flex-row gap-4">
            <Image
              source={{ uri: ownerImage || "https://placehold.co/50x50" }}
              style={{ width: 50, height: 50, borderRadius: 25 }}
            />
            <View>
              <Text className="font-rubik text-lg">
                {item?.sender?.first_name} {item?.sender?.last_name}
              </Text>
              <Text className="font-rubik text-md text-[#8C8989]">
                {item?.title}
              </Text>
            </View>
          </View>
          <View>
            <Text className="font-rubik-light text-sm">{createdat}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default NotificationItem5;

const styles = StyleSheet.create({});
