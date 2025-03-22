import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import moment from "moment";
import Icon from "@/constants/icon";

interface CommentItemProps {
  item: any;
  canDelete: boolean;
  onDelete: (item: any) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  item,
  canDelete = false,
  onDelete = () => {},
}) => {
  const firstName = item?.user?.first_name ?? item?.first_name;
  const lastName = item?.user?.last_name ?? item?.last_name;
  const createdat = moment(
    item?.user?.created_at || item?.created_at
  ).fromNow();

  const { getToken } = useAuth();
  const [ownerImage, setOwnerImage] = useState<string>("");
  const userId = item?.user?.user_id ?? item?.user_id;
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


  const handleDelete = () => {
    Alert.alert("Confirm", "Are you sure you want to delete this comment?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => onDelete(item),
        style: "destructive",
      }
    ])
  };

  return (
    <View className=" border border-gray-300 rounded-xl p-3 mt-1 mb-1 mr-1 ml-1">
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
        <View>
          {canDelete && (
            <TouchableOpacity onPress={handleDelete}>
              <Icon.comdelete color="red" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View className=" flex justify-center mt-2 mb-1 ml-1">
        <Text className="text-md font-rubik">{item?.text}</Text>
      </View>
    </View>
  );
};

export default CommentItem;
