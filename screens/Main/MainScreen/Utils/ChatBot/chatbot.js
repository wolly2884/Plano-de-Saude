import React, { useState, useCallback } from 'react';
import { TouchableOpacity, Text, ScrollView, SafeAreaView, Image, View } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../../../context/ThemeContext';
import InputTexto from '../../../../../components/InputTexto';
import Rodape from '../../../../../components/Rodape';
import api from '../../../../../api/api';
import { getStyles } from './styles';

// Dropdown options
const feedbackOptions = [
  { key: '1', value: 'Reclamação' },
  { key: '2', value: 'Sugestão' },
  { key: '3', value: 'Elogio' },
  { key: '4', value: 'Outros' },
];

const App = ({ navigation }) => {
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [titular, setTitular] = useState('');
  const [carteirinha, setCarteirinha] = useState('');
  const [feedbackType, setFeedbackType] = useState('');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailEdited, setIsEmailEdited] = useState(false); // Track manual email edits

  const { theme } = useTheme();
  const styles = getStyles(theme);

  // Load stored data and beneficiaries on focus
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const storedCardNumber = await AsyncStorage.getItem('cardNumber');
          const storedEmail = await AsyncStorage.getItem('Email');
          const storedUsername = await AsyncStorage.getItem('username');

          setEmail(storedEmail || '');
          setTitular(storedUsername || '');
          setCarteirinha(storedCardNumber || '');

          // Fetch beneficiaries
          const storedID = await AsyncStorage.getItem('ID');
          const response = await api.get(`/Beneficiario/get/${storedID}`);
          const { rowCount, rows } = response.data;

          if (rowCount > 0) {
            const beneficiaryData = rows.map((item) => ({
              key: item.id,
              value: item.nm_beneficiario,
              nome: item.nm_beneficiario,
              cpf: item.cd_cpf,
              email: item.ds_emails, // Ensure this matches API response
              cardnumber: item.cd_cardnumber,
            }));
            setBeneficiaries(beneficiaryData);
          } else {
            setErrors((prev) => ({ ...prev, beneficiary: 'Nenhum beneficiário encontrado' }));
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          setErrors((prev) => ({ ...prev, api: 'Erro ao carregar dados. Tente novamente.' }));
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }, [])
  );

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};
    if (!feedbackType) newErrors.feedbackType = 'Selecione o tipo de feedback';
    if (!selectedBeneficiary) newErrors.beneficiary = 'Selecione o beneficiário';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email inválido';
    if (!titular.trim()) newErrors.titular = 'Titular é obrigatório';
    if (!carteirinha.trim()) newErrors.carteirinha = 'Número da carteirinha é obrigatório';
    if (!message.trim()) newErrors.message = 'Descrição é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      navigation.navigate('Chat Live', {
        message,
        name: selectedBeneficiary?.nome || '',
        email,
        titular,
        carteirinha,
        feedbackType,
      });
    }
  };

  // Handle beneficiary selection
  const handleBeneficiarySelect = (value) => {
    const beneficiary = beneficiaries.find((item) => item.value === value);
    setSelectedBeneficiary(beneficiary || null);
    setCarteirinha(beneficiary?.cardnumber || '');
    if (beneficiary?.email && !isEmailEdited) {
      setEmail(beneficiary.email); // Only update email if not manually edited
    }
    setErrors((prev) => ({ ...prev, beneficiary: null, carteirinha: null, email: null }));
  };

  // Handle manual email input
  const handleEmailChange = (text) => {
    setEmail(text);
    setIsEmailEdited(true); // Mark email as manually edited
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {isLoading && <Text style={styles.loadingText}>Carregando...</Text>}

        <View style={styles.section}>
          <SelectList
            dropdownStyles={styles.dropdownStyles}
            placeholder="Selecione o tipo de feedback"
            setSelected={setFeedbackType}
            data={feedbackOptions}
            save="value"
            search={true}
            boxStyles={[styles.dropdown, errors.feedbackType ? styles.dropdownError : {}]}
            inputStyles={styles.dropdownText}
            dropdownTextStyles={styles.dropdownText}
            placeholderStyle={styles.dropdownPlaceholder}
          />
          {errors.feedbackType && <Text style={styles.errorMessage}>{errors.feedbackType}</Text>}
        </View>

        <View style={styles.section}>
          <SelectList
            placeholder="Selecione o Beneficiário"
            searchPlaceholder="Pesquise..."
            setSelected={handleBeneficiarySelect}
            data={beneficiaries}
            save="value"
            search={true}
            boxStyles={[styles.dropdown, errors.beneficiary ? styles.dropdownError : {}]}
            inputStyles={styles.dropdownText}
            dropdownTextStyles={styles.dropdownText}
            placeholderStyle={styles.dropdownPlaceholder}
          />
          {errors.beneficiary && <Text style={styles.errorMessage}>{errors.beneficiary}</Text>}
          {errors.api && <Text style={styles.errorMessage}>{errors.api}</Text>}
        </View>

        <View style={styles.section}>
          <InputTexto
            text="Email"
            value={email}
            funcao={handleEmailChange} // Use custom handler
            editar={true}
            icon="email"
            placeholderTextColor={theme.placeholderColor}
            max={50}
            teclado="email-address"
            style={styles.input}
            error={errors.email}
          />
          {errors.email && <Text style={styles.errorMessage}>{errors.email}</Text>}

          <InputTexto
            text="Titular"
            value={titular}
            funcao={setTitular}
            editar={true}
            icon="account"
            placeholderTextColor={theme.placeholderColor}
            max={50}
            teclado="default"
            style={styles.input}
            error={errors.titular}
          />
          {errors.titular && <Text style={styles.errorMessage}>{errors.titular}</Text>}

          <InputTexto
            text="Número da Carteirinha"
            value={carteirinha}
            funcao={setCarteirinha}
            editar={true}
            icon="card"
            placeholderTextColor={theme.placeholderColor}
            max={50}
            teclado="numeric"
            style={styles.input}
            error={errors.carteirinha}
          />
          {errors.carteirinha && <Text style={styles.errorMessage}>{errors.carteirinha}</Text>}

          <InputTexto
            text="Breve descrição"
            value={message}
            funcao={setMessage}
            editar={true}
            icon="message-text"
            placeholderTextColor={theme.placeholderColor}
            max={500}
            teclado="default"
            multiline={true}
            style={[styles.input, { height: 100 }]}
            error={errors.message}
          />
          {errors.message && <Text style={styles.errorMessage}>{errors.message}</Text>}
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.button, { flexDirection: 'row', alignItems: 'center' }]}
            onPress={handleSubmit}
            accessibilityRole="button"
            accessibilityLabel="Entrar no chat"
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Clica aqui para entrar no Chat</Text>
            <Image
              source={require('../../../../../assets/enioemail.png')}
              style={{ width: 30, height: 30, marginLeft: 10 }}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Rodape />
    </SafeAreaView>
  );
};

export default App;