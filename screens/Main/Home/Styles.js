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
    // home
  navcontainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  navcontent: {
    flex: 1,
  },
  homenavBar: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    flex: 1,
  },
  homenavRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
});