import React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import uploadToAnonymousFilesAsync from 'anonymous-files';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 5000);

export default function App() {
  const [selectedImage, setSelectedImage] = React.useState(null);

  const [loaded] = useFonts({
    Montserrat: require('./assets/fonts/Montserrat-Regular.ttf')
  });

  if (!loaded) {
    return null;
  }

  let clearImage = () => {
    setSelectedImage(null);
  };

  let openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();

    if (pickerResult.cancelled === true) {
      return;
    }

    if (Platform.OS === 'web') {
      let remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri);
      setSelectedImage({ localUri: pickerResult.uri, remoteUri });
    } else {
      setSelectedImage({ localUri: pickerResult.uri, remoteUri: null });
    } 
  };

  let openCameraAsync = async () => {
    if(Platform.OS === 'web') {
      alert("This feature is not support!");
      return;
    }

    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if(permissionResult.granted === false) {
      alert("Permission to access your camera is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchCameraAsync();

    if(pickerResult.cancelled === true) {
      return;
    }

    setSelectedImage({ localUri: pickerResult.uri, remoteUri: null });

  };

  let openShareDialogAsync = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      alert(`The image is available for sharing at: ${selectedImage.remoteUri}`);
      return;
    }

    Sharing.shareAsync(selectedImage.localUri);
  };

  if (selectedImage !== null) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: selectedImage.localUri }} style={styles.thumbnail} />
        <TouchableOpacity onPress={openShareDialogAsync} style={styles.button}>
          <Text style={styles.buttonText}>Share this photo</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={clearImage} style={styles.button}>
          <Text style={styles.buttonText}>Clear photo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: "https://i.imgur.com/TkIrScD.png" }} style={styles.logo} />
      <Text style={styles.instructions}>
        To share a photo from your phone with a friend, just press the button below!
      </Text>
      <TouchableOpacity onPress={openImagePickerAsync} style={styles.button}>
        <Text style={styles.buttonText}>Pick a photo</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={openCameraAsync} style={styles.button}>
        <Text style={styles.buttonText}>Open your camera</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 305,
    height: 159,
    marginBottom: 10,
  },
  instructions: {
    color: '#888',
    fontSize: 18,
    fontFamily: 'Montserrat',
    marginHorizontal: 15,
  }, 
  button: {
    backgroundColor: "blue",
    padding: 20,
    borderRadius: 5,
    marginVertical: 15
  },
  buttonText: {
    fontSize: 20,
    fontFamily: 'Montserrat',
    color: '#fff',
  },
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    marginVertical: 15
  },
});
