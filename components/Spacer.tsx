import React from 'react';
import { View } from 'react-native';

type Props = {
  height?: number;
}

const Spacer = ({ height = 40 }: Props) => {
  return <View style={{ height }} />
}

export default Spacer;