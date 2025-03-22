
import { View, Text, TextInput } from 'react-native'
import React from 'react'

const Input = (props:any) => {
  return (
    <View className='flex-1 flex-row items-center border border-gray-300 rounded-xl p-3 mt-2 mb-2'>
        {
            props.icon && props.icon
        }
        <TextInput
        style = {{flex:1}}
        placeholderTextColor= 'gray'
        ref ={props.inputRef && props.inputRef}
        {...props}
        />
    </View>
  )
}

export default Input