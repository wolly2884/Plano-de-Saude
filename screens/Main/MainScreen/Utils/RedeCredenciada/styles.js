import { StyleSheet } from 'react-native';
  
export const styles = StyleSheet.create({
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
  content: {
    flex: 1,
  },

  
 // Rede Credenciada
   RCmap: {
     flex: 1,
  },
  RCmapf:{
    flex: 1, 
    marginBottom: 36, 
    width: '100%', 
    marginTop: 3,
    
  },
  RCTexto:{
      fontSize:20,
      marginLeft: '64%',
      textAlign: 'center',
      color: 'white',
      backgroundColor: '#0d729c',
      fontWeight: 'bold',
      height: 35,
      borderRadius: 5,
      bottom: 140,
  },
  RCsearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  RCbusca: {
    marginTop: 20,
  },
});
