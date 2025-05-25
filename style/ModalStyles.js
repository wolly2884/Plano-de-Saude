import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const customStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: width * 0.8,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    width: '100%',
    justifyContent: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#333',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
   //Recupera senha
  Senhacontainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  Senhainput: {
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  Senhabutton: {
    backgroundColor: '#0d729c',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  SenhabuttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  SenharegisterLink: {
    marginTop: 25,
    textAlign: 'center',
    color: '#0d729c',
    textDecorationLine: 'underline',
  },
});

export default customStyles;