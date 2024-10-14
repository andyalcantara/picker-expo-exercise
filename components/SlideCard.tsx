import React, { memo } from 'react';
import { View, Image, StyleSheet } from 'react-native';

type Props = {
  index: number;
  uri: string;
  onSelect?: (index: number) => void;
}

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 40,
  }
})

const SlideCard = ({ index, uri}: Props) => {
  
  return (
    <View
      key={index}
      style={styles.imageContainer}
    >
      <Image style={styles.image} source={{ uri }} />
    </View>
  );
}

export default memo(SlideCard);
