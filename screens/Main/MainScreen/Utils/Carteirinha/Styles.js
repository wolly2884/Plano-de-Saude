import { StyleSheet } from 'react-native';
  
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
  

  // Carteirinha Virtual
  CVcontainer: {
    flex: 1,
    backgroundColor: '#ffe',
    padding: 10,
    justifyContent: 'center',
  },
  CVgradient: {
    width: '80%',
    height: '70%',
    borderWidth: 2,
    borderRadius: 30,
    alignSelf: 'center',
  },
  CVsafeArea: {
    flex: 1,
  },
  CVtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    transform: [{ rotate: '90deg' }],
    bottom: 0,
    left: 100,
    top: 70,
    padding: 10,
  },
  CVimage: {
    width: 120,
    height: 30,
    transform: [{ rotate: '90deg' }],
    position: 'absolute',
    bottom: 70,
    left: 200,
    top: 400
  },
});
