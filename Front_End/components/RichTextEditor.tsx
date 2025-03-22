import { View, Text, StyleSheet } from "react-native";
import React from "react";
import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";

const RichTextEditor = ({
  editorRef,
  onChange,
}: {
  editorRef: any;
  onChange: any;
}) => {
  return (
    <View>
      <RichToolbar
        action={[
          actions.setBold,
          actions.setItalic,
          actions.insertBulletsList,
          actions.insertOrderedList,
          actions.insertLink,
          actions.keyboard,
          actions.setStrikethrough,
          actions.setUnderline,
          actions.removeFormat,
          actions.insertVideo,
          actions.checkboxList,
        ]}
        editor={editorRef}
        disabled={false}
        style={styles.richBar}
        selectedIconTint={"#2095F2"}
        flatContainerStyle={styles.listStyle}
      />
      <RichEditor
        ref={editorRef}
        containerStyle={styles.rich}
        editorStyle={styles.contentstyle}
        onChange={onChange}
        placeholder="Start typing here..."
      />
    </View>
  );
};

export default RichTextEditor;

const styles = StyleSheet.create({
  richBar: {
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  rich: {
    flex: 1,
    borderRadius: 10,
    borderColor: "gray",
    borderWidth: 1,
  },
  contentstyle: {
    color: "black",
  },
  listStyle: {
    padding: 8,
    gap: 2,
  },
});
