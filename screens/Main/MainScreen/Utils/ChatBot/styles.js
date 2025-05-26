import { StyleSheet } from 'react-native';

export const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor || '#fff',
    },
    contentContainer: {
      padding: 20,
    },
    section: {
      marginBottom: 20,
    },
    dropdown: {
      borderWidth: 1,
      borderColor: theme.borderColor || '#ccc',
      borderRadius: 5,
    },
    dropdownError: {
      borderColor: theme.errorColor || 'red',
    },
    dropdownStyles: {
      fontSize: 14,
      marginTop: 10,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme.borderColor || '#ccc',
    },
    dropdownText: {
      color: theme.textColor || '#000',
      fontSize: 14,
    },
    dropdownPlaceholder: {
      color: theme.placeholderColor || '#999',
    },
    input: {
      borderWidth: 1,
      borderColor: theme.borderColor || '#ccc',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    },
    button: {
      backgroundColor: theme.primaryColor || '#007AFF',
      padding: 15,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      color: theme.buttonTextColor || '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    errorMessage: {
      color: theme.errorColor || 'red',
      fontSize: 12,
      marginBottom: 10,
    },
    loadingText: {
      color: theme.textColor || '#000',
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 20,
    },
  });