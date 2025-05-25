import { StyleSheet } from 'react-native';
  
export const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'white',
        padding: 20
    },
    scrollViewContent:{
        top: 90,
    },
    View:{
        backgroundColor: 'white', 
        alignSelf: 'flex-start', 
        paddingHorizontal: 3, 
        marginStart: 20, 
        zIndex: 1, 
        elevation: 1, 
        position: 'absolute', 
        top: 12
    },
    Text:{
        backgroundColor: 'white', 
        alignSelf: 'flex-start', 
        paddingHorizontal: 3, 
        marginStart: 20, 
        zIndex: 1, 
        elevation: 1, 
        position: 'absolute', 
        top: -12, 
        left: 10
    },
    View2:{
        alignItems: 'center', 
        left: 1, 
        height: 60, 
        width: '97%' , 
        borderWidth: 1, 
        borderRadius: 10
    },
    Cadinput: {
      backgroundColor: '#f2f2f2',
      borderRadius: 5,
      marginBottom: 15,
    },
    Cadbutton: {
      backgroundColor: '#0d729c',
      borderRadius: 5,
      padding: 15,
      alignItems: 'center',
      marginBottom: 40
    },
    CadbuttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    errorMessage:{
        fontSize: 10,
        color: 'red', 
        left: 20,
        top: -1
    },  
    fab: {
      position: 'absolute',
      right: 20,
      bottom: 20,
      backgroundColor: '#6200ee',
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: '#d6ffff',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      flexDirection: 'row',
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: '#EEEEEE',
      padding: 8,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    input: {
      flex: 1,
      height: 40,
      marginHorizontal: -20,
      paddingHorizontal: 8,
      backgroundColor: '#F0F0F0',
      borderRadius: 20,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    modal: {
      justifyContent: 'flex-end',
      margin: 0,
      bottom: 20
    },
    modalContainer: {
      backgroundColor: 'white',
      padding: 30,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      justifyContent: 'left'
    },
    button:{
      borderRadius: 20,
      bottom: 60,
      borderRadius: 200,
      borderWidth: 1,
      width: 45,
      height: 45,
      left: 100,
      alignSelf: 'flex-end'
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
      bottom: 50, 
      top: 10 
    },
    iconButton:{
      left: 20
    }
  })