import { StyleSheet } from 'react-native';
  
export const getstyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
  },
  // Noticias
  Noticiascontainer: {
    flex: 1,
    backgroundColor: theme.backgroundColor,
    padding: 16,
  },
  NoticiasContainer: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
   backgroundColor: theme.backgroundColor,
    borderRadius: 8,
    padding: 12,
  },
  Noticiasimagem: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  Noticiastitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: theme.inputTextColor
  },
  Noticiashistoria: {
    fontSize: 16,
     color: theme.inputTextColor
  },

});