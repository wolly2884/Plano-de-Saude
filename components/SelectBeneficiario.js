import { View, Text, SafeAreaView, Alert, Button } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import { getStyles } from './SelectStyles';
import { useTheme } from '../context/ThemeContext';
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useState, useCallback } from 'react';

const SelectBeneficiario = ({ selectedItem, setSelectedItem, onSelect, isEmpty }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [beneficiarios, setBeneficiarios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserData = async () => {
    try {
      const storedID = await AsyncStorage.getItem('ID');
      if (!storedID) {
        console.log('No stored ID for user data fetch');
        return;
      }
      const userData = await api.get(`/Beneficiario/get_t/${storedID}`);
      const { rowCount, rows } = userData.data;

      if (rowCount > 0) {
        const user = rows[0];
        await AsyncStorage.setItem('user', JSON.stringify(user));
      }
    } catch (userError) {
      console.error('Error fetching user data:', userError.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchData = async () => {
        setIsLoading(true);
        try {
          
          const cachedBeneficiaries = await AsyncStorage.getItem('beneficiaries');
        
          if (isActive && cachedBeneficiaries) {

            try {
              const parsed = JSON.parse(cachedBeneficiaries);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setBeneficiarios(parsed);
                setIsLoading(false);
                return;
              }
            } catch (parseError) {
              console.error('Error parsing cached beneficiaries:', parseError.message);
            }
          }

          const storedID = await AsyncStorage.getItem('ID');
          if (!storedID) {
            Alert.alert('Erro', 'ID do usuário não encontrado.');
            setIsLoading(false);
            return;
          }

          const response = await api.get(`/Beneficiario/get/${storedID}`);
          const { rowCount, rows } = response.data;

          if (isActive && rowCount > 0) {
            const beneficiaryData = rows.map(item => ({
              key: item.id,
              value: item.nm_beneficiario,
              nm_beneficiario: item.nm_beneficiario,
              cd_cpf: item.cd_cpf,
              cd_password: item.cd_password,
              cd_age: item.cd_age,
              ic_estado_civil: item.ic_estado_civil,
              ic_sexo: item.ic_sexo,
              ds_email: item.ds_email,
              cd_celular: item.cd_celular,
              nm_logradouro: item.nm_logradouro,
              cd_numero: item.cd_numero,
              nm_complemento: item.nm_complemento,
              nm_cidade: item.nm_cidade,
              cd_cep: item.cd_cep,
              sg_estado: item.sg_estado,
              cd_cardnumber: item.cd_cardnumber,
              ds_healthplan: item.ds_healthplan,
              cd_cns: item.cd_cns,
              dt_inclusao: item.dt_inclusao,
            }));
            setBeneficiarios(beneficiaryData);
            await AsyncStorage.setItem('beneficiaries', JSON.stringify(beneficiaryData));
          } else {
            Alert.alert('Aviso', 'Nenhum beneficiário encontrado');
          }

          // Fetch user data after beneficiaries
          await fetchUserData();
        } catch (error) {
          if (isActive) {
            console.error('Erro ao carregar beneficiários:', error.message);
            Alert.alert('Erro', 'Erro ao carregar beneficiários. Tente novamente.');
          }
        } finally {
          if (isActive) setIsLoading(false);
        }
      };

      fetchData();

      return () => {
        isActive = false;
      };
    }, [])
  );

  return (
    <View>
      <SafeAreaView>
        {isLoading ? (
          <Text style={styles.loadingText}>Carregando beneficiários...</Text>
        ) : (
          <SelectList
            placeholder="Selecione o Beneficiário"
            searchPlaceholder="Pesquise..."
            setSelected={setSelectedItem}
            data={beneficiarios}
            search={true}
            boxStyles={[styles.dropdown, isEmpty ? styles.dropdownError : {}]}
            inputStyles={styles.dropdownText}
            dropdownTextStyles={styles.dropdownText}
            placeholderStyle={styles.dropdownPlaceholder}
            dropdownStyles={styles.dropdown}
            onSelect={() => {
              const selected = beneficiarios.find(item => item.key === selectedItem);
              if (selected) onSelect?.(selected);
            }}
          />
        )}
        {isEmpty && (
          <Text style={styles.errorMessage}>Selecione o Beneficiário</Text>
        )}
      </SafeAreaView>
    </View>
  );
};

export default SelectBeneficiario;