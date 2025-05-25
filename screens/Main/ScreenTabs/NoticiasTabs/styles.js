// src/screens/ScreenTabs/NoticiasTabs/Styles.js
import { StyleSheet } from 'react-native';

export const getStyles = (theme) =>
  StyleSheet.create({
    Noticiascontainer: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
      padding: 1,
    },
    NoticiasContainer: {
      margin: 16,    
      borderWidth: 1,
      width: '90%',
      alignSelf: 'center',
      paddingTop: 10,
      borderColor: theme.placeholderColor,
      backgroundColor: theme.modalBackground,
      borderRadius: 8,
      padding: 12,
    },
    Noticiasimagem: {
      width: '100%',
      height: 200,
      borderRadius: 8,
      marginBottom: 12,
    },
    Noticiastitulo: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
      color: theme.textColor,
    },
    Noticiashistoria: {
      fontSize: 16,
      color: theme.textColor,
    },
    errorText: {
      fontSize: 14,
      color: theme.textColor,
      textAlign: 'center',
      marginBottom: 12,
    },
  });