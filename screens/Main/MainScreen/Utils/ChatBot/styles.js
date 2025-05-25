import { StyleSheet } from 'react-native';
  
export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  chatArea: {
    padding: 5,
    minHeight: '90%',
    paddingBottom: 70
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 40,
    width: '170%',
    height: 50,
    bottom: 80,

  },
  input: {
    flex: 1,
    marginRight: 16,
    padding: 8,
    borderColor: '#ccc',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#e6e6e6',
    maxWidth: '70%',
    padding: 20,
    marginVertical: 5,
    borderRadius: 8,
    flexDirection: 'row-reverse',
    padding: 10,
    left: 10,
    borderTopRightRadius: 0
  },
  botMessageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#cdcdcd',
    maxWidth: '70%',
    padding: 10,
    marginVertical: 5,
    borderRadius: 20,
    flexDirection: 'row',
    left: 10, 
    borderTopLeftRadius: 0
  },
  userMessage: {
    fontSize: 16,
    color: 'black',
    left: 5,
  paddingRight: 5
  },
  botMessage: {
    fontSize: 16,
    color: 'black',
    left: 5
  },
  button:{
    borderRadius: 20,
    bottom: 80,
    left: 5,
    borderRadius: 200,
    borderWidth: 1,
    width: 50,
    height: 50
  },
  Icon:{
    alignSelf: 'center', 
    bottom: 0, 
    top: 10, 
    left: -3 
  },
  ViewText:{ 
    flexDirection: 'row', 
    height: '5.5%', 
    width: '50%', 
    bottom: 40, 
    top: 10 }
});