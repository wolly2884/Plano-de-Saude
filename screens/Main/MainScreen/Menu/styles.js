// styles.js

// Aqui você pode definir suas cores
export const cores = {
  roxo: '#6a5acd',
  claro: '#ffffff',
  laranja: '#ffa500',
};

// Outros estilos podem ser definidos conforme necessário
export const styles = {
  tabBarOptions: {
    activeTintColor: cores.roxo,
    inactiveTintColor: cores.claro,
    activeBackgroundColor: cores.roxo,
    inactiveBackgroundColor: cores.laranja,
    labelStyle: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlignVertical: 'center',
    height: '95%',
    width: '100%',
    backgroundColor: cores.laranja,
    },
    style: {
      width: '100%',
      height: 70,
      paddingHorizontal: 20,
      paddingBottom: 10,
    },
    keyboardHidesTabBar: true,
    tabStyle: {
      display: 'none',
    },
  },
  title: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: 25,
    padding: 10,
    left: 10,
    top: 20
  },
  image: {
    width: 75,
    height: 65,
    top: 8,
  },
  buttonText: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    bottom: 0,
    top: 10,
    textAlign: 'center',
    fontSize: 11
  },
    container: {
    flex: 1,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 60,
    backgroundColor: 'blue'
  },
  rowContainerchat: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
    rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    top: -25
  },
   rowContainer2: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    top: -80
  },
  button: {
    borderWidth: 2,
    width: 125,
    height: 100,
    borderRadius: 10,
    alignItems: 'center',
    borderColor: "rgba(0, 0, 0, 0.5)",
    //backgroundColor: '#ceeaf2'
  },
  content: {
    padding: 20,
  },
  section_text: {
    fontSize: 20,
    alignSelf: 'center',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
    iniconteiner: {
    flex: 1, 
    backgroundColor: 'blue', //theme.cardbackground,
  },
  textPrice: {
    fontSize: 16,
    marginVertical: 5,
  },
};
