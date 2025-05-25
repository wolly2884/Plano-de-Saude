// Styles.js
import { StyleSheet } from 'react-native';

export const getStyles = (theme) => {
  const isDark = theme === 'dark';
  return {
    container: {
      flex: 1,
     backgroundColor: theme.backgroundColor,
      padding: 20,
    },
    sectionTitle: {
      backgroundColor: theme.backgroundColor,
      fontSize: 20,
      fontWeight: 'bold',
      marginVertical: 10,
    },
    inputContainer: {
      borderColor: theme.buttonTextColor, 
      borderWidth: 0,
      borderRadius: 8,
      backgroundColor: theme.backgroundColor,
      paddingHorizontal: 1,
      marginBottom: 1,

    },
    inputText: {
      color: theme.buttonTextColor,
      fontSize: 16,
    },
    errorInput: {
      borderColor: 'red',
      borderWidth: 2,
    },
    cadButton: {
      backgroundColor: isDark ? '#6200ee' : '#007bff',
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginVertical: 10,
      marginBottom: 50
    },
    cadButtonText: {
      color:theme.buttonTextColor,
      fontSize: 18,
      fontWeight: 'bold',
    },
    errorMessage: {
      color: 'red',
      fontSize: 14,
      marginTop: 5,
      textAlign: 'center',
    },
    dropdown: {
      backgroundColor: theme.backgroundColor,
      borderColor: theme.textColor,
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: 10,
      color:  theme.textColor,
    },
    dropdownText: {
      color: theme.textColor,
      fontSize: 18,
      textAlign: 'center',
    },
    dropdownPlaceholder: {
      color: theme.textColor,
      fontSize: 18,
      textAlign: 'center',
    },
    dropdownError: {
      borderColor: 'red',
      borderWidth: 2,
    },
    sectionHeader: {
      backgroundColor: '#e0e0e0',
      padding: 12,
      marginTop: 10,
      borderRadius: 8,
    },
    ButtonDrop:
    {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 16,
      backgroundColor: theme.backgroundColor,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      marginBottom: 10,
      },
      TextDrop: {
        fontSize: 16, 
        fontWeight: 'bold',
        color: theme.textColor
      }
  };
};