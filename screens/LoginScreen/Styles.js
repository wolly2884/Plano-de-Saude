import { StyleSheet } from 'react-native';
  
export const styles = StyleSheet.create({
    // Login
  loginsearchBar: {
    backgroundColor: '#ffffff',
    padding: 10,
  },
  logininput: {
    backgroundColor: '#ceeaf2',
    marginTop: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  loginnavBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#0d729c',
    paddingVertical: 10,
    marginTop: 20,
  },
  loginnavItem: {
    paddingHorizontal: 15,
    fontWeight: 'bold',
    color: '#fff'
  },
  loginTexto:{
    textAlign: 'center',
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