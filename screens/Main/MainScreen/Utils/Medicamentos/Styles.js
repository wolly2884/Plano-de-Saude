import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

export const getStyles = (theme) => {
  return {
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
      alignItems: 'center',
      justifyContent: 'center',
    },
    header: { 
      position: 'absolute', 
      fontSize: 28,
      color: theme.textColor,      
      top: 0 
    },
    button: {
      backgroundColor: theme.buttonBackground,
      borderRadius: 30,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: hp('-1%'),
      borderWidth: 1,
      borderColor: theme.buttonBackground,
      flexDirection: 'row',
    },  
    Image: {
      position: 'absolute',
      top: 0,
      width: '54%',
      height: '33%',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: hp('4%'),
    },
    scrollView: {
      position: 'absolute',
      bottom: 0,
      top: hp('10%'), 
      height: '98%', 
      width: '98%' 
    },
    beneficiario: { 
      marginTop: hp('24%'), 
      width: '98%' 
    },
    SelectList: { 
      width: '98%' 
    },
    buttonavancar: {
      width: '38%',
      position: 'absolute',
      bottom: 50,
      right: 10,
    },
    buttonText: {
      color: theme.buttonTextColor,
      fontSize: 20,
    },
    // Agendamento Styles
    button_horario: { 
      marginLeft: 3, 
      marginRight: 3 
    },
    horarioContainer: { 
      top: 10, 
      width: 90, 
      height: 30,    
      borderRadius: 20, 
      alignItems: 'center', 
      alignContent: 'center', 
      flexDirection: 'row',     
      justifyContent: 'space-around', 
      padding: 5 
    },
    button_horario_text: {
      fontSize: 13, 
      fontWeight: 'bold',      
      fontStyle: 'italic',      
    },
    horatioimage: {
      width: 20,
      height: 20,
      marginRight: 5,
    },
    headerContainer: { 
      borderWidth: 1, 
      width: "100%", 
      height: '40%'
    },
    headerImage: { 
      width: '60%', 
      height: '50%', 
      position: 'absolute', 
      bottom: 0, 
      right: 10 
    },
    headerText: {
      fontSize: 20,
      color: theme.textColor,
      textAlign: 'left',
      marginTop: 10,
      left: 5,
    },
    buttonContainer: { 
      width: '10%', 
      height: '10%' 
    },
    buttonIcon: { 
      width: 30, 
      height: 30, 
      top: 50, 
      left: 10, 
    },
    contato: { 
      position: 'absolute', 
      top: 50, 
      left: 5 
    },
    headerTextContainer: { 
      flex: 1, 
      marginTop: 50 
    },
    buttonHeader: { 
      flexDirection: 'row',  
      position: 'absolute', 
      bottom: 110, 
      width: '100%', 
      padding: 10 
    },
    modal: {
      justifyContent: 'flex-end',
      margin: 0,
    },
    modalContainer: {
      backgroundColor: 'white',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      height: '30%',
    },
    modalContent: {
      flex: 1,
      justifyContent: 'center',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      padding: 10,
      fontSize: 16,
      color: '#000',
      height: 100,
    },
    iconButton: {
      position: 'absolute',
      right: 20,
      bottom: 20,
    },
  };
};
