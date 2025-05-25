import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Text, Alert, Image } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { PinchGestureHandler, State, PanGestureHandler } from 'react-native-gesture-handler';
import {styles} from './styles'
//import Rodape  from '../../../../../components/Rodape'

const imageURL = 'https://centraldeatendimento.totvs.com/hc/article_attachments/7950762777111/9.jpg';

const App = () => {
  const [imageUri, setImageUri] = useState(imageURL);
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const baseScale = useRef(1);
  const baseTranslateX = useRef(0);
  const baseTranslateY = useRef(0);

  const onPinchEvent = event => {
    if (event.nativeEvent.state === State.ACTIVE) {
      setScale(baseScale.current * event.nativeEvent.scale);
    }
    if (event.nativeEvent.state === State.END) {
      baseScale.current = scale;
    }
  };

  const onPanEvent = event => {
    if (event.nativeEvent.state === State.ACTIVE) {
      setTranslateX(baseTranslateX.current + event.nativeEvent.translationX);
      setTranslateY(baseTranslateY.current + event.nativeEvent.translationY);
    }
    if (event.nativeEvent.state === State.END) {
      baseTranslateX.current = translateX;
      baseTranslateY.current = translateY;
    }
  };

  const handleDownload = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status === 'granted') {
        const fileUri = FileSystem.documentDirectory + 'image.jpg';
        const { uri } = await FileSystem.downloadAsync(imageURL, fileUri);

        setImageUri(uri);

        const asset = await MediaLibrary.createAssetAsync(uri);
        await MediaLibrary.createAlbumAsync('Download', asset, false);
        
        Alert.alert('Sucesso', 'Imagem baixada com sucesso');
      } else {
        Alert.alert('Permissão negada', 'A permissão para escrever na mídia foi negada');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao baixar a imagem');
    }
  };

  return (
    <View style={styles.container}>
      <PanGestureHandler
        onGestureEvent={onPanEvent}
        onHandlerStateChange={onPanEvent}>
        <PinchGestureHandler
          onGestureEvent={onPinchEvent}
          onHandlerStateChange={onPinchEvent}>
          <Image 
            source={{ uri: imageUri }}
            style={{ 
              ...styles.image, 
              transform: [{ scale: scale }, { translateX: translateX }, { translateY: translateY }] 
            }}
          />
        </PinchGestureHandler>
      </PanGestureHandler>
      <TouchableOpacity style={styles.button} onPress={handleDownload}>
        <Text style={styles.buttonText}>Baixar Imagem</Text>
      </TouchableOpacity>
      <Rodape />
    </View>
  );
}

export default App;