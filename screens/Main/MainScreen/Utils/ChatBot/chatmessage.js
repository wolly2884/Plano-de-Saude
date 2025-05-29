import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, FlatList, Text, KeyboardAvoidingView, Image, Platform, TouchableOpacity, Dimensions } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../../../api/api';
import Rodape from '../../../../../components/Rodape';
import { Feather } from '@expo/vector-icons';
import { getStyles } from './StyleMessenge'; // Adjust the import path as necessary
import { useTheme } from '../../../../../context/ThemeContext';

const windowHeight = Dimensions.get('window').height;

const ChatScreen = ({ route }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [inputButtonBgColor, setInputButtonBgColor] = useState(null);
  const [sendButtonBottom, setSendButtonBottom] = useState(0); // Default bottom for sendButton
  const flatListRef = useRef(null);
  const inputRef = useRef(null);
  const [showIntro, setShowIntro] = useState(true);
  const [imageSource, setImageSource] = useState(require('../../../../../assets/src/pessoa.png'));
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const { message, cpf, name, email, titular, carteirinha, feedbackType } = route.params || {};
  const room = feedbackType || 'Outros';
  const cardnumber = carteirinha || '9999-9999-9999-99';
  const user = name || 'Anonymous';
  const NomeTit = titular || 'Unknown';
  const id = cpf;

  const loadImageFromStorage = async () => {
    try {
      const imageUri = await AsyncStorage.getItem(`profile_image_${id}`);
      if (imageUri) {
        setImageSource({ uri: imageUri });
      }
    } catch (error) {
      console.error('Erro ao carregar imagem do AsyncStorage:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/chat/history/${cpf}`);
      setMessages(response.data || []);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
    }
  };

  const sendMessage = async (text) => {
    if (!text?.trim()) return;

    const newMsg = {
      id,
      user,
      message: text,
      room,
      timestamp: new Date().toISOString(),
    };

    try {
      await api.post(`/chat`, newMsg);
      setMessages((prev) => [...prev, newMsg]);
      setNewMessage('');
      flatListRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  const sendInitialMessage = async () => {
    if (!message?.trim()) return;

    const initialMessage = [
      `Nome do Beneficiário: ${user}`,
      `CPF do Beneficiário: ${cpf || 'Unknown'}`,
      `Email: ${email}`,
      `Nome do Titular: ${NomeTit}`,
      `Número da Carteirinha: ${cardnumber}`,
      `Breve Relato: ${message}`,
    ].join('\n');

    await sendMessage(initialMessage);
  };

  const handleFocusInput = () => {
    inputRef.current?.focus();
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled === false) {
        const file = result.assets?.[0] || result;

        const formData = new FormData();
        formData.append('file', {
          uri: file.uri,
          name: file.name,
          type: file.mimeType || 'application/octet-stream',
        });

        formData.append('user', user);
        formData.append('message', newMessage || 'Arquivo enviado');
        formData.append('room', room);
        formData.append('id', id);

        const response = await api.post('/chat/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        setMessages((prev) => [...prev, response.data]);
        setNewMessage('');
        flatListRef.current?.scrollToEnd({ animated: true });
      }
    } catch (err) {
      console.error('Erro ao enviar arquivo:', err);
    }
  };

  const renderMessage = ({ item }) => {
    const isClient = item.user === user;
    return (
      <View style={[styles.messageContainer, isClient ? styles.clientMessage : styles.adminMessage]}>
        <Text style={styles.sender}>
          {item.user} ({item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : 'Hora desconhecida'}):
        </Text>
        <Text style={styles.messageText}>{item.message}</Text>
        {item.attachment && (
          <TouchableOpacity
            style={styles.attachmentButton}
            onPress={() => {
              Linking.openURL(`https://nodestart.onrender.com/uploads/${item.attachment.url?.split('/').pop()}`);
            }}
          >
            <Text style={styles.attachmentText}>
              {item.attachment.name} ({item.attachment.size}MB) <Text style={styles.downloadText}>⬇</Text>
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const handleSendWithText = () => {
    if (newMessage.trim()) {
      sendMessage(newMessage);
    }
  };

  const handleInputFocus = () => {
    setInputButtonBgColor('#D3D8DE'); // Change focusButton background color
    setSendButtonBottom(30); // Increase bottom by 10 (from 10 to 20)
  };

  const handleInputBlur = () => {
    setInputButtonBgColor(null); // Revert focusButton background color
    setSendButtonBottom(-2); // Revert bottom to original value
  };

  useEffect(() => {
    const initializeChat = async () => {
      try {
        await fetchMessages();
        await sendInitialMessage();
        await loadImageFromStorage();
      } catch (error) {
        console.error('Erro ao iniciar o chat:', error);
      }
    };
    initializeChat();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (showIntro) {
    return (
      <View style={styles.introContainer}>
        <Image source={imageSource} style={styles.introAvatar} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 20}
    >
      <View style={styles.header}>
        <Image source={imageSource} style={styles.avatar} />
        <View>
          <Text style={styles.username}>{user}</Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        style={styles.messageList}
        contentContainerStyle={{ paddingBottom: 80 }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <View style={[styles.inputContainer, { bottom: sendButtonBottom }]}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Digite sua mensagem..."
          placeholderTextColor="#6B7280"
          onFocus={handleInputFocus} // Handle focus event
          onBlur={handleInputBlur} // Handle blur event
        />
        <TouchableOpacity onPress={handlePickFile} style={styles.handlePickFile}>
          <Text style={{ fontSize: 22 }}>📎</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sendButton, !newMessage.trim() && { opacity: 0.5 }]}
          onPress={handleSendWithText}
          disabled={!newMessage.trim()}
        >
          <Feather name="send" size={20} color="#fff" />
        </TouchableOpacity>

      </View>
      <Rodape />
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;