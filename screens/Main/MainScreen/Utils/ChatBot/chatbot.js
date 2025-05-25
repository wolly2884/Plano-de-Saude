import React, { useState, useEffect } from 'react';
import { SafeAreaView, TextInput, Button, FlatList, Text, View, StyleSheet } from 'react-native';
import { io } from 'socket.io-client';

const SOCKET_URL = 'https://nodestart.onrender.com';

export default function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // Conectar socket uma vez
  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ['websocket'] });

    socket.on('connect', () => {
      console.log('Conectado ao socket:', socket.id);
    });

    socket.on('chat message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('connect_error', (err) => {
      console.log('Erro de conexão Socket:', err.message);
    });

    // Limpar ao desmontar
    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;
    
    // Conectar socket novamente para enviar (pode criar ref para evitar isso)
    const socket = io(SOCKET_URL, { transports: ['websocket'] });
    const newMsg = {
      id: Date.now().toString(),
      user: 'Usuário',
      message,
      timestamp: new Date().toISOString(),
      room: 'default',
    };

    socket.emit('chat message', newMsg);
    setMessage('');
    socket.disconnect();
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.message}>
            <Text style={{ fontWeight: 'bold' }}>{item.user}:</Text>
            <Text>{item.message}</Text>
          </View>
        )}
      />

      <View style={styles.inputRow}>
        <TextInput
          placeholder="Digite a mensagem"
          value={message}
          onChangeText={setMessage}
          style={styles.input}
        />
        <Button title="Enviar" onPress={sendMessage} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  message: { paddingVertical: 5 },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 4,
  },
});
