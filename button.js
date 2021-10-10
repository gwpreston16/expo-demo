import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const Button = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress} style={props.buttonStyles}>
      <Text style={props.textStyles}>{props.text}</Text>
    </TouchableOpacity>
  );
}

export default Button;