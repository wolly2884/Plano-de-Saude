import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, TouchableOpacity, Alert, ScrollView, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './Styles';
import InputTexto from '../../../../../components/InputTexto';
import Rodape from '../../../../../components/Rodape';
import api from '../../../../../api/api';
import { SelectList } from 'react-native-dropdown-select-list';
import { useTheme } from '../../../../../context/ThemeContext';
import { getStyles } from './Styles';

const App = ({ navigation }) => {
  const [ConfirmEmail   , setConfirmEmail]  = useState('');
  const [NewEmail       , setNewemail]      = useState('');
  const [OldEmail       , setOldEmail]      = useState('');
  const [ID             , setID]            = useState('');
  const [beneficiarios  , setBeneficiarios] = useState([]);
  const [selectedItem   , setSelectedItem]  = useState('');

  const [isEmptyNewEmail        , setIsEmptyNewEmail]         = useState(false);
  const [isEmptyConfirmEmail    , setIsEmptyConfirmEmail]     = useState(false);
  const [isEmptyDropDownPicker  , setIsEmptyDropDownPicker]   = useState(false);

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
              value: beneficiario.nm_beneficiario,
              ...beneficiario, // outras propriedades se necessário
            }));
            setBeneficiarios(loadedBeneficiarios);
          } else {
            Alert.alert('Usuário não encontrado', 'Por favor, verifique o nome de usuário e tente novamente.');
          }
        } catch (error) {
          console.error('Erro ao recuperar os dados:', error);
        }
      };
      loadBeneficiarios();
    }, [navigation])
  );

  const handleRegister = async () => {
    if (!NewEmail || !ConfirmEmail || !ID) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      setIsEmptyNewEmail(!NewEmail);
      setIsEmptyConfirmEmail(!ConfirmEmail);
      setIsEmptyDropDownPicker(!ID);
      return;
    }

    if (NewEmail !== ConfirmEmail) {
      Alert.alert('Erro', 'A senha e a confirmação da senha devem ser iguais.');
      return;
    }

    try {
      await AsyncStorage.setItem('Email', ConfirmEmail);
      await api.put('/Beneficiario', { ds_email: ConfirmEmail, id: parseInt(ID) });
      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (error) {
      console.error('Erro ao armazenar os dados:', error);
      Alert.alert('Erro', 'Não foi possível realizar a alteração do cadastro. Tente novamente.');
    }
  };

  const selecionado = (item) => {
    setID(item.key);
    setOldEmail(item.ds_email)
  };

  const getInputStyle = (isValid) => ({
    ...styles.inputContainer,
    ...(isValid ? styles.dropdownError : {}),
  });

  return (
    <View style={{flex: 1}}>
    <View style={styles.container}>
      <ScrollView  style={{ top: 10, bottom: 150, marginBottom: 20 }}>
        <SafeAreaView>
            <SelectList
              placeholder="Selecione o Beneficiário"
              searchPlaceholder="Pesquise..."
              setSelected={setSelectedItem}
              data={beneficiarios}
              search={true}
              boxStyles={[styles.dropdown, isEmptyDropDownPicker ? styles.dropdownError : {}]}
              inputStyles={styles.dropdownText}
              dropdownTextStyles={styles.dropdownText}
              placeholderStyle={styles.dropdownPlaceholder}
              dropdownStyles={styles.dropdown}
              onSelect={() => selecionado(beneficiarios.find(item => item.key === selectedItem))}
            />
            {isEmptyDropDownPicker && (
              <Text style={styles.errorMessage}>Selecione o Beneficiário</Text>
            )}
          </SafeAreaView>

        <View style={{flex: 1}}>
        <InputTexto
            text="Email"
            value={OldEmail}
            funcao={setOldEmail}
            editar={false}
            icon={ 'card-account-mail'} 
            placeholderTextColor={theme.placeholderColor}
            istrue={false}
            max={50}
            teclado="email-address"
            style={getInputStyle(false)}
          />

          <InputTexto
            text="Novo Email"
            value={NewEmail}
            funcao={setNewemail}
            max={20}
            teclado="default"
            editar={true}
            isEmpty={isEmptyNewEmail}
            style={getInputStyle(isEmptyNewEmail)}
            placeholderTextColor={theme.placeholderColor}
            icon={ isEmptyNewEmail ? 'card-bulleted-off':  'card-account-mail'} 
          />
          {isEmptyNewEmail && <Text style={styles.errorMessage}>Preencha o campo Novo Email</Text>}

          <InputTexto
            text="Confirmação do Email"
            value={ConfirmEmail}
            funcao={setConfirmEmail}
            max={20}
            teclado="default"
            editar={true}
            style={getInputStyle(isEmptyConfirmEmail)}
            placeholderTextColor={theme.placeholderColor}
            isEmpty={isEmptyConfirmEmail}
            icon={ isEmptyConfirmEmail ? 'card-bulleted-off':  'card-account-mail'} 
          />
          {isEmptyConfirmEmail && <Text style={styles.errorMessage}>Preencha o campo Confirmação do Email</Text>}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.Cadbutton} onPress={handleRegister}>
        <Text style={styles.CadbuttonText}>Confirmação</Text>
      </TouchableOpacity>
    </View>

      <Rodape />
    </View>
  );
};

export default App;
