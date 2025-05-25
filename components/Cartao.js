import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image, Dimensions, Animated, Modal, Alert } from 'react-native';
import { getStyles } from '../screens/Main/MainScreen/navigation/Styles';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import customStyles from '../style/ModalStyles';
import { useTheme } from '../context/ThemeContext';

// Obter as dimensões da tela
const { width, height } = Dimensions.get('window');

const Screen = ({ items, index, navigation, xOffset, tamarray }) => {
  const SCREEN_WIDTH = width * 0.98;
  const isTablet = width > 1200 || height > 1200;
  const { theme, isThemeLoaded } = useTheme();
  const styles = getStyles(theme);
  const [imageSource, setImageSource] = useState(require('../assets/src/pessoa.png'));
  const [modalVisible, setModalVisible] = useState(false);

  // Função para carregar a imagem do AsyncStorage
  const loadImageFromStorage = async () => {
    try {
      const imageUri = await AsyncStorage.getItem(`profile_image_${items.cd_cpf}`);
      if (imageUri) {
        setImageSource({ uri: imageUri });
      }
    } catch (error) {
      console.error('Erro ao carregar imagem do AsyncStorage:', error);
    }
  };

  // Carregar a imagem ao montar o componente
  useEffect(() => {
    loadImageFromStorage();
  }, [items.cd_cpf]);

  // Função para salvar a imagem no AsyncStorage
  const saveImageToStorage = async (uri) => {
    try {
      await AsyncStorage.setItem(`profile_image_${items.cd_cpf}`, uri);
    } catch (error) {
      console.error('Erro ao salvar imagem no AsyncStorage:', error);
    }
  };

  const showImagePickerOptions = () => {
    setModalVisible(true);
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos de permissão para acessar a câmera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const source = { uri: result.assets[0].uri };
      setImageSource(source);
      saveImageToStorage(result.assets[0].uri);
    }
    setModalVisible(false);
  };

  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos de permissão para acessar a galeria.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const source = { uri: result.assets[0].uri };
      setImageSource(source);
      saveImageToStorage(result.assets[0].uri);
    }
    setModalVisible(false);
  };

  const transitionAnimation = {
    transform: [
      { perspective: 1800 },
      {
        scale: xOffset.interpolate({
          inputRange: [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
          outputRange: [0.8, 1, 0.8],
        }),
      },
      {
        rotateX: xOffset.interpolate({
          inputRange: [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
          outputRange: ['-120deg', '0deg', '120deg'],
        }),
      },
      {
        rotateY: xOffset.interpolate({
          inputRange: [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
          outputRange: ['-120deg', '0deg', '120deg'],
        }),
      },
    ],
  };

  return (
    <View style={[styles.scrollPage, { left: index === tamarray - 1 && tamarray > 1 ? 12 : 19 + (index * 8), width: SCREEN_WIDTH, top: 10 }]}>
      <Animated.View style={[styles.screen, transitionAnimation]}>
        <SafeAreaView style={{ borderTopStartRadius: 10, borderTopEndRadius: 10, width: '100%', height: height * 0.185, borderWidth: 1 }}>
          <View style={{ flexDirection: 'row', top: isTablet ? 50 : 5 }}>
            <TouchableOpacity onPress={showImagePickerOptions} style={{ top: 20 }}>
              <Image source={imageSource} style={styles.image} />
            </TouchableOpacity>
            <SafeAreaView style={styles.userInfo}>
              <View style={{ flexDirection: 'row' }}>
                
                <Text style={styles.TextoCard}>{items.nm_beneficiario}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.TextoCard}>CNS :</Text>
                <Text style={styles.TextoBenef}>{items.cd_cns}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.TextoCard}>Matrícula :</Text>
                <Text style={styles.TextoBenef}>{items.cd_cardnumber}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.TextoCard}>Plano :</Text>
                <Text style={styles.TextoBenef}>{items.ds_healthplan}</Text>
              </View>
            </SafeAreaView>
          </View>

          <SafeAreaView style={[styles.buttonsContainer, { top: isTablet ? 80 : 0 }]}>
            <TouchableOpacity
              style={[styles.button1, { flexDirection: 'row' }]}
              onPress={() => navigation.navigate('Carterinha Virtual', { items })}
            >
              <Image
                source={require('../assets/cartao.png')}
                style={{ width: 22, height: 18, justifyContent: 'space-evenly', right: 5 }}
              />
              <Text style={styles.buttonText}>Carterinha Virtual</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button2, { flexDirection: 'row' }]}
              onPress={() => navigation.navigate('Gerar Token', { items })}
            >
              <Image
                source={require('../assets/qrcode.png')}
                style={{ width: 22, height: 18, justifyContent: 'space-evenly', right: 5 }}
              />
              <Text style={styles.buttonText}>Gerar Token</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </SafeAreaView>
      </Animated.View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={customStyles.modalContainer}>
          <View style={customStyles.modalContent}>
            <Text style={customStyles.modalTitle}>Escolher Foto de Perfil</Text>
            <Text style={customStyles.modalMessage}>Selecione como deseja adicionar sua foto:</Text>
            <TouchableOpacity style={customStyles.modalButton} onPress={openCamera}>
              <Icon name="camera" size={24} color="#fff" style={customStyles.icon} />
              <Text style={customStyles.modalButtonText}>Tirar Foto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={customStyles.modalButton} onPress={openGallery}>
              <Icon name="photo" size={24} color="#fff" style={customStyles.icon} />
              <Text style={customStyles.modalButtonText}>Selecionar da Galeria</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[customStyles.modalButton, customStyles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[customStyles.modalButtonText, customStyles.cancelButtonText]}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Screen;