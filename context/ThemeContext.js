// src/context/ThemeContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isNightMode, setIsNightMode] = useState(false); // padrão claro

  // Carrega o tema salvo ao iniciar o app
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('istheme');
        if (savedTheme !== null) {
          setIsNightMode(JSON.parse(savedTheme)); // Garantir booleano
        }
      } catch (error) {
        console.error('Erro ao carregar o tema:', error);
      }
    };

    loadTheme();
  }, []);

  // Alterna e salva o tema
  const toggleTheme = async () => {
    const newValue = !isNightMode;
    setIsNightMode(newValue);
    await AsyncStorage.setItem('istheme', JSON.stringify(newValue));
  };

  const theme = isNightMode
    ? {
        backgroundColor: '#121212',
        menubackground: '#515151',
        cardbackground: '#121212', 
        textColor: '#E0E0E0',
        inputBackground: '#1E1E1E',
        inputTextColor: '#FFFFFF',
        buttonBackground: '#0288D1',
        buttonTextColor: '#FFFFFF',
        linkColor: '#4FC3F7',
        placeholderColor: '#757575',
        modalBackground: '#1E1E1E',
        modalTextColor: '#E0E0E0',
        fillColor: '#E0E0E0',
        tabBarBackground: '#1E1E1E',
        tabBarTextColor: '#E0E0E0',
        tabBarActiveTextColor: '#4FC3F7',
        tabBarIndicatorColor: '#4FC3F7',    
        errorMessagem: '#000000',
        shadowColor: '#FFFFFF',
      }
    : {
        backgroundColor: '#FFFFFF',
        cardbackground: 'blue',
        menubackground: '#FFFFFF',
        textColor: '#000000',
        inputBackground: '#F5F5F5',
        inputTextColor: '#000000',
        buttonBackground: '#0288D1',
        buttonTextColor: '#FFFFFF',
        linkColor: '#0288D1',
        placeholderColor: '#A0A0A0',
        modalBackground: '#FFFFFF',
        modalTextColor: '#000000',
        fillColor: '#000000',
        tabBarBackground: '#FFFFFF',
        tabBarTextColor: '#000000',
        tabBarActiveTextColor: '#00BFFF',
        tabBarIndicatorColor: '#00BFFF',
        errorMessagem: 'red',
        shadowColor: '#000000',
      };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isNightMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
