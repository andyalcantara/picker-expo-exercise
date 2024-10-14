import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Carousel, {
  ICarouselInstance,
} from 'react-native-reanimated-carousel';
import SlideCard from './components/SlideCard';
import Spacer from './components/Spacer';
import { CarouselRenderItemInfo } from 'react-native-reanimated-carousel/lib/typescript/types';

const WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  selectedSection: {
    padding: 5,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  pickAnImage: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'lightgreen',
    borderRadius: 8,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  image: {
    width: 200,
    height: 200,
  },
  text: {
    color: 'black'
  },
  pickContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
});

export default function App() {
  const [carouselImages, setCarouselImages] = useState<ImagePicker.ImageInfo[]>([]);
  const [isActivityIndicatorShowing, setIsActivityIndicatorShowing] = useState(false);

  const ref = React.useRef<ICarouselInstance>(null);

  useEffect(() => {
    getPermissions();
  }, []);

  const getPermissions = async () => {
    try {
      const permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissions.granted === false) {
        Alert.alert(
          "Permission Denied",
          "You need permissions to access the photo library. Please enable it in settings."
        );
        return;
      }
    } catch (error) {
      // Here handle error gracefully
      console.log(error);
      Alert.alert("Error", "Unable to get permissions. Please try again.");
    }
  }

  const pickImageFromLibrary = async () => {
    setIsActivityIndicatorShowing(true);
    try {
      const result: ImagePicker.ImagePickerMultipleResult | ImagePicker.ImageInfo = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (result.cancelled) return;
      
      if ('selected' in result) {
        setCarouselImages([...carouselImages, ...result.selected as ImagePicker.ImageInfo[]]);
      } else {
        setCarouselImages([...carouselImages, result as ImagePicker.ImageInfo]);
      }
    } catch (error) {
      // Here handle error gracefully
      console.log(error);
      Alert.alert("Error", "An error occurred while picking images. Please try again.");
    } finally {
      setIsActivityIndicatorShowing(false);
    }
  }

  const renderCarouselItem = ({ index }: CarouselRenderItemInfo<ImagePicker.ImageInfo>): JSX.Element =>  {
    return (
      <SlideCard index={index} uri={carouselImages[index].uri} />
    );
  }

  return (
      <SafeAreaView style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Coding Exercise</Text>
        </View>

        {isActivityIndicatorShowing ? (
          <ActivityIndicator style={{ flexGrow: 1 }} color='lightgreen' />
        ) : (
          <View>
            {carouselImages.length > 0 ? (
              <Carousel
                ref={ref}
                loop
                width={WIDTH}
                height={200}
                autoPlay={false}
                data={carouselImages}
                scrollAnimationDuration={800}
                renderItem={renderCarouselItem}
              />
            ) : (
              <Spacer height={200} />
            )}
          </View>
        )}

        <View style={styles.pickContainer}>
          <TouchableOpacity style={styles.pickAnImage} onPress={pickImageFromLibrary}>
            <Text style={styles.text}>{carouselImages.length > 0 ? 'Pick more Images' : 'Pick an Image'}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
  );
}
