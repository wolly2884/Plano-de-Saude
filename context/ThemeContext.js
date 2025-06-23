import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = Appearance.getColorScheme(); // 'light' ou 'dark'

  // Estado para armazenar se está no modo noturno
  // Inicializa com base no sistema, mas será ajustado ao carregar AsyncStorage
  const [isNightMode, setIsNightMode] = useState(systemColorScheme === 'dark');

  // Carrega o tema salvo e prioriza ele sobre o sistema
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('istheme');
        if (savedTheme !== null) {
          setIsNightMode(JSON.parse(savedTheme));
        } else {
          // Caso não tenha salvo, usa o tema do sistema
          setIsNightMode(systemColorScheme === 'dark');
        }
      } catch (error) {
        console.error('Erro ao carregar o tema:', error);
      }
    };

    loadTheme();
  }, [systemColorScheme]);

  // Escuta mudanças do tema do sistema e atualiza só se não houver tema salvo manualmente
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      AsyncStorage.getItem('istheme').then((savedTheme) => {
        if (savedTheme === null) {
          setIsNightMode(colorScheme === 'dark');
        }
      });
    });
    return () => subscription.remove();
  }, []);

  // Função para alternar tema e salvar escolha do usuário
  const toggleTheme = async () => {
    const newValue = !isNightMode;
    setIsNightMode(newValue);
    try {
      await AsyncStorage.setItem('istheme', JSON.stringify(newValue));
    } catch (error) {
      console.error('Erro ao salvar o tema:', error);
    }
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
