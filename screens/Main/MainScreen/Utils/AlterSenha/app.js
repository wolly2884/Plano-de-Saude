import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  SafeAreaView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InputTexto from '../../../../../components/InputTexto1';
import Rodape from '../../../../../components/Rodape';
import api from '../../../../../api/api';
import { useTheme } from '../../../../../context/ThemeContext';
import { getStyles } from './Styles';
import SelectBeneficiario  from '../../../../../components/SelectBeneficiario';

const App = ({ navigation }) => {
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [ID, setID] = useState('');
  const [beneficiarios, setBeneficiarios] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');

  const [isEmptyNewPassword, setIsEmptyNewPassword] = useState(false);
  const [isEmptyConfirmPassword, setIsEmptyConfirmPassword] = useState(false);
  const [isEmptyDropDownPicker, setIsEmptyDropDownPicker] = useState(false);

  const [showSenhaNew, setShowSenhaNew] = useState(true);
  const [showSenhaConfirm, setShowSenhaConfirm] = useState(true);

  const { theme } = useTheme();
  const styles = getStyles(theme);

  useFocusEffect(
    React.useCallback(() => {
      const loadBeneficiarios = async () => {
        try {
          const storedID = await AsyncStorage.getItem('ID');
          const userData = await api.get(`/Beneficiario/get/${storedID}`);

          if (userData.data.rowCount > 0) {
            const loadedBeneficiarios = userData.data.rows.map((beneficiario) => ({
              key: beneficiario.id,
              value: beneficiario.nm_beneficiario
            }));
            setBeneficiarios(loadedBeneficiarios);
          } else {
            Alert.alert('Usuário não encontrado', 'Verifique o usuário e tente novamente.');
          }
        } catch (error) {
          console.error('Erro ao recuperar os dados:', error);
        }
      };
      loadBeneficiarios();
    }, [navigation])
  );

  const handleRegister = async () => {
    if (!newPassword || !confirmPassword || !ID) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      setIsEmptyNewPassword(!newPassword);
      setIsEmptyConfirmPassword(!confirmPassword);
      setIsEmptyDropDownPicker(!ID);
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Erro', 'A senha e a confirmação devem ser iguais.');
      return;
    }

    try {
      await api.put('/Beneficiario', {
        cd_password: confirmPassword,
        id: parseInt(ID)
      });

      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Erro ao atualizar os dados:', error);
      Alert.alert('Erro', 'Não foi possível atualizar os dados. Tente novamente.');
    }
  };

  const toggleShowSenhaNew = () => setShowSenhaNew(!showSenhaNew);
  const toggleShowSenhaConfirm = () => setShowSenhaConfirm(!showSenhaConfirm);

  const selecionado = (item) => {
    setID(item.key);
  };

  const getInputStyle = (isValid) => ({
  ...styles.inputContainer,
  ...(isValid ? styles.dropdownError : {}),
  });

  return (
    <View style={{ flex: 1 }}>
      <View style={{flex: 1}}>
        <View style={styles.container}>
          <SafeAreaView>
            <SelectBeneficiario
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              onSelect={(item) => selecionado(item)}
              isEmpty={isEmptyDropDownPicker}
            />
          </SafeAreaView>

          <View style={{ flex: 1 }}>
            <InputTexto
              text="Nova Senha"
              value={newPassword}
              funcao={setNewPassword}
              istrue={showSenhaNew}
              max={20}
              teclado="default"
              onlong={toggleShowSenhaNew}
              icon={showSenhaNew ? 'eye-off' : 'eye'}
              redicon={isEmptyNewPassword}
              style={getInputStyle(isEmptyNewPassword)}
              placeholderTextColor={theme.placeholderColor}
            />
            {isEmptyNewPassword && (
              <Text style={styles.errorMessage}>Preencha o campo Nova Senha</Text>
            )}

            <InputTexto
              text="Confirmação da Senha"
              value={confirmPassword}
              funcao={setConfirmPassword}
              istrue={showSenhaConfirm}
              max={20}
              teclado="default"
              onlong={toggleShowSenhaConfirm}
              icon={showSenhaConfirm ? 'eye-off' : 'eye'}
              redicon={isEmptyConfirmPassword}
              style={getInputStyle(isEmptyConfirmPassword)}
              placeholderTextColor={theme.placeholderColor}
            />
            {isEmptyConfirmPassword && (
              <Text  style={styles.errorMessage}>
                Preencha o campo Confirmação da Senha
              </Text>
            )}
          </View>

          <TouchableOpacity style={styles.Cadbutton} onPress={handleRegister}>
            <Text style={styles.CadbuttonText}>Confirmação</Text>
          </TouchableOpacity>
        </View>
       </View>

      <Rodape />
    </View>
  );
};

export default App;
