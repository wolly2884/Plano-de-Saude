import { StyleSheet } from 'react-native';
  
export const getStyles  = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.backgroundColor,
    padding: 10,
    marginTop: -50
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: theme.textColor
  },
  subHeader: {
    fontSize: 16,
    color: theme.linkColor,
    marginBottom: 20,
  },
  token: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.buttonTextColor,
    marginBottom: 20,
  },
  qrContainer: {
    backgroundColor: '#D3FFD3',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  expiry: {
    fontSize: 16,
    color: '#777',
    marginBottom: 10,
  },
  timer: {
    fontSize: 14,
    color: '#FF5555',
    marginBottom: 20,
  },
  usertexto: {
    flexDirection: 'row',
  },  
  userInfo: {
    fontSize: 14,
    color: theme.inputTextColor,
    marginTop: 5,
    fontWeight: 'bold', // Negrito
    fontStyle: 'italic', // Itálico
  },  
  beninfo: {
    fontSize: 14,
    color: theme.linkColor,
    marginTop: 5,
  },
});