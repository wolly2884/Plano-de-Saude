import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as Linking from 'expo-linking';
import api from '../../../../../api/api';
import Rodape from '../../../../../components/Rodape';

const ChatScreen = ({ route }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [inputButtonBgColor, setInputButtonBgColor] = useState(null);
  const flatListRef = useRef(null);
  const inputRef = useRef(null);

  const { message, cpf, name, email, titular, carteirinha, feedbackType } = route.params || {};
  const room = feedbackType || 'Outros';
  const cardnumber = carteirinha || '9999-9999-9999-99';
  const user = name || 'Anonymous';
  const NomeTit = titular || 'Unknown';
  const id = cpf;

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

      if (result.type === 'success') {
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
        console.log(response)
        console.log(formData)

        setMessages((prev) => [...prev, response.data]);
        setNewMessage('');
        flatListRef.current?.scrollToEnd({ animated: true });
      }
    } catch (err) {
      console.error('Erro ao enviar arquivo:', err);
    }
  };

  const renderMessage = ({ item }) => (
    <View style={styles.messageContainer}>
      <Text style={styles.sender}>
        {item.user} ({item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : 'Hora desconhecida'}):
      </Text>
      <Text style={styles.messageText}>{item.message}</Text>
      {item.attachment && (
        <TouchableOpacity
          style={styles.attachmentButton}
          onPress={() => {
            Linking.openURL(`https://SEU_DOMINIO/uploads/${item.attachment.path?.split('/').pop()}`);
          }}
        >
          <Text style={styles.attachmentText}>
            {item.attachment.name} ({item.attachment.size}MB) <Text style={styles.downloadText}>⬇</Text>
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const handleSendWithText = () => {
    if (newMessage.trim()) {
      sendMessage(newMessage);
    }
  };

  useEffect(() => {
    const initializeChat = async () => {
      try {
        await fetchMessages();
        await sendInitialMessage();
      } catch (error) {
        console.error('Erro ao iniciar o chat:', error);
      }
    };
    initializeChat();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        style={styles.messageList}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={[styles.focusButton, { backgroundColor: inputButtonBgColor || '#E8ECEF' }]}
          onPress={handleFocusInput}
          onPressIn={() => setInputButtonBgColor('#D3D8DE')}
          onPressOut={() => setInputButtonBgColor(null)}
        >
          <Text style={styles.focusButtonText}>Mensagem</Text>
        </TouchableOpacity>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Digite sua mensagem..."
          placeholderTextColor="#6B7280"
        />
        <TouchableOpacity onPress={handlePickFile} style={{ marginRight: 6 }}>
          <Text style={{ fontSize: 22 }}>📎</Text>
        </TouchableOpacity>
        <Button title="Enviar" onPress={handleSendWithText} disabled={!newMessage.trim()} color="#1D4ED8" />
      </View>
      <Rodape />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5EAF0',
  },
  messageList: {
    flex: 1,
  },
  messageContainer: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    marginVertical: 6,
    borderRadius: 12,
    marginHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sender: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#374151',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#E5EAF0',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#D1D5DB',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 6,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    color: '#1F2937',
  },
  focusButton: {
    padding: 10,
    borderRadius: 10,
  },
  focusButtonText: {
    fontSize: 16,
    color: '#1F2937',
  },
  attachmentButton: {
    padding: 8,
    backgroundColor: '#1D4ED8',
    borderRadius: 8,
    marginTop: 8,
  },
  attachmentText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  downloadText: {
    fontSize: 12,
  },
});

export default ChatScreen;
