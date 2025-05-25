import { StyleSheet } from 'react-native';
  
export const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
  },
 
// Contato
  ContatocontentContainer: {
    padding: 1,
    backgroundColor: theme.backgroundColor,

  },
  Contatocontainer: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
    padding: 20,
  },
  Contatotext: {
    marginTop: 20,
    marginEnd: 10,
    fontSize: 20,
    textAlign: 'center',
    color: theme.textColor

  },
  Contatopicker: {
    width: '100%',
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#ceeaf2',
  },
  ContatotextInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    marginBottom: 20,
    width: '100%',
    backgroundColor: '#ceeaf2',
  },
  ContatotextMemo: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    marginBottom: 20,
    width: '100%',
    backgroundColor: '#ceeaf2',
    height: 100
  },
  Contatobutton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  ContatobuttonText: {
    fontSize: 18,
    color: theme.textColor
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
      color: theme.textColor,

    },
    sectionHeader: {
      backgroundColor: '#e0e0e0',
      padding: 12,
      marginTop: 10,
      borderRadius: 8,
    },
});
