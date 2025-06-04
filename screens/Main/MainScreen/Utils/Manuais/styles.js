import { StyleSheet } from 'react-native';
  
export const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: theme.backgroundColor,
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 20,
    color: theme.inputTextColor,
  },
  button: {
    backgroundColor: theme.buttonBackground,
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    width: 135,
    borderWidth: 1,
    borderColor: theme.buttonBorderColor,
  },
  buttonText: {
    fontSize: 16,
    color: theme.buttonTextColor,
    textAlign: 'center',
  },
});