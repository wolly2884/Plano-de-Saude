import { StyleSheet } from 'react-native';

export const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: theme.backgroundColor,
  },

  Cadinput: {
    height: 50,
    borderWidth: 1,
    borderColor: theme.inputBorderColor || '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 5,
    backgroundColor: theme.inputBackgroundColor || '#fff',
    color: theme.textColor || '#000',
    fontSize: 16,
  },

  Cadbutton: {
    backgroundColor: theme.primaryColor || '#007BFF',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 50,
    alignItems: 'center',
  },

  CadbuttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

    errorMessage: {
      color: 'red',
      fontSize: 14,
      marginTop: -13,
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
      },
    inputContainer: {
      borderColor: theme.buttonTextColor, 
      borderWidth: 0,
      borderRadius: 8,
      backgroundColor: theme.backgroundColor,
      paddingHorizontal: 1,
      marginBottom: 1,

    },

});
