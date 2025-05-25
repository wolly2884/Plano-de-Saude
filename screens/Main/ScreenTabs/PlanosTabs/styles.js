// src/screens/ScreenTabs/PlanosTabs/Styles.js
import { StyleSheet } from 'react-native';

export const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
    },
    textContainer :{
        width: '90%',
        left: 10,
        position: 'absolute',
        
    },
    planImage: {
      width: '40%',
      position: 'absolute'
    },
    productId: {
      width: '90%',
      height: 175,
      padding: 10,
      margin: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.placeholderColor, // Replaces #ccc
      backgroundColor: theme.modalBackground, // Replaces #ededed
      alignSelf: 'center',
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    descricao: {
      fontSize: 24,
      fontWeight: 'bold',
      fontStyle: 'italic',
      marginBottom: 5,
      color: theme.textColor, // Replaces implicit black
    },
    versao: {
      fontSize: 15,
      color: theme.placeholderColor, // Replaces #666
      fontStyle: 'italic',
      fontWeight: 'bold',
      marginBottom: 5,
    },
    caracteristica: {
      fontSize: 10,
      color: theme.placeholderColor, // Replaces #666
      fontStyle: 'italic',
      fontWeight: 'bold',
      marginBottom: 5,
    },
    botaofake: {
      borderWidth: 2,
      borderRadius: 5,
      alignItems: 'center',
      borderColor: theme.linkColor, // Replaces blue
      top: 10,
    },
    botaofakeText: {
      color: theme.textColor, // Ensure readable text
    },
    errorText: {
      color: theme.textColor,
      fontSize: 14,
      textAlign: 'center',
    },
  });