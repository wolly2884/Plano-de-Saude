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
  navBar: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingBottom: 80,
  },
  navRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  navItem: {
    padding: 10,
  },
  searchBar: {
    backgroundColor: '#ffffff',
    padding: 10,
  },
  input: {
    backgroundColor: '#ceeaf2',
    marginTop: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  navBarBtn: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#0d729c',
    paddingVertical: 10,
    marginTop: 20,
  },
  navBarBtnText: {
    paddingHorizontal: 15,
    fontWeight: 'bold',
    color: '#fff',
  },
  footerSVG: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#333',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
//menu
menucontainer: {
    flexDirection: 'collunm',
    marginTop: 1,
    top: 10,
  },
  menuview:{
    flexDirection: 'row', 
    marginLeft: -15 
  },
  menuimg:{ 
    width: 30, 
    height: 25 
  },
  menubutton: {
    justifyContent: 'space-between' ,
    width: "100%",
    height: 55,
    padding: 12,
    borderBottomWidth: 1,
    flexDirection: 'row',
    marginLeft: 10
  },
  menubuttonText: {
    fontSize: 15,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  //
  InputTexto:{
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    paddingHorizontal: 3,
    marginStart: 20,
    zIndex: 1,
    elevation: 1,
    position: 'absolute',
    top: -12,
  },
  emptyInput: {
    borderColor: 'red',
    borderWidth: 2,
    alignSelf: 'flex-start',
    paddingHorizontal: 3,
    marginStart: 20,
    zIndex: 1,
    elevation: 1,
    position: 'absolute',
    top: -12,
  },
});
