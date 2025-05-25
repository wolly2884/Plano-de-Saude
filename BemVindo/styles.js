// src/screens/Cadastro/Styles.js
import { StyleSheet } from 'react-native';

export const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.backgroundColor,
    },
    loader: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: 100,
      height: 100,
      marginVertical: 20,
    },
    loadingText: {
      color: theme.textColor,
      fontSize: 16,
      marginTop: 10,
    },
  });
