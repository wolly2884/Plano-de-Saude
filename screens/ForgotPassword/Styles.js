import { StyleSheet } from 'react-native';
  
export const styles = StyleSheet.create({
  //Recupera senha
  Senhacontainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  Senhainput: {
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  Senhabutton: {
    backgroundColor: '#0d729c',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  SenhabuttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  SenharegisterLink: {
    marginTop: 25,
    textAlign: 'center',
    color: '#0d729c',
    textDecorationLine: 'underline',
  },
  container: {
    flex: 1,
    backgroundColor: '#666',
  },
  footerPortal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#333',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#333',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#fff',
  },
});