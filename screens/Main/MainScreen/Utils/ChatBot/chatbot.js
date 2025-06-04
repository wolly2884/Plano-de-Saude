import React, { useState, useCallback, useRef, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  TouchableOpacity,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  View,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { SelectList } from 'react-native-dropdown-select-list';
import { useTheme } from '../../../../../context/ThemeContext';
import InputTexto from '../../../../../components/InputTexto';
import Rodape from '../../../../../components/Rodape';
import { getStyles } from './chatstyle';
import enioEmail from '../../../../../assets/enioemail.png';
import SelectBeneficiario from '../../../../../components/SelectBeneficiario';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Opções de feedback
const feedbackOptions = [
  { key: '1', value: 'Reclamação' },
  { key: '2', value: 'Sugestão' },
  { key: '3', value: 'Elogio' },
  { key: '4', value: 'Outros' },
];

 

// Componente de input reutilizável
const FormInput = ({ field, label, value, onChange, icon, max, teclado, multiline, numberOfLines, inputRef, onFocus, styles, errors, theme }) => (
  <View style={styles.section}>
    <InputTexto
      text={label}
      value={value}
      funcao={onChange}
      editar={true}
      icon={icon}
      placeholderTextColor={theme.placeholderColor}
      max={max}
      teclado={teclado}
      multiline={multiline}
      numberOfLines={numberOfLines}
      onFocus={onFocus}
      ref={inputRef}
      style={styles.inputContainer}
      error={errors[field]}
      accessibilityLabel={`Digite ${label.toLowerCase()}`}
    />
    {errors[field] && (
      <Text style={styles.errorMessage} accessibilityLabel={errors[field]}>
        {errors[field]}
      </Text>
    )}
  </View>
);

const App = ({ navigation }) => {
  const [formData, setFormData] = useState({
    message: '',
    email: '',
    titular: '',
    cpf: '',
    carteirinha: '',
    feedbackType: '',
    messageInputY: 0,
  });
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailEdited, setIsEmailEdited] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const [nm_titular, setNmTitular] = useState('');

  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);
  const messageInputRef = useRef(null);
  const scrollViewRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      async function fetchUserData() {
        try {
          const user = await AsyncStorage.getItem('user');
          setNmTitular(user ? JSON.parse(user).nm_beneficiario : '');
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }

      fetchUserData();
    }, [])
  );

  // Função para validar CPF
  const validateCPF = (cpf) => {
    const cleanCPF = cpf.replace(/\D/g, '');
    if (cleanCPF.length !== 11) return false;
    // Lógica adicional de validação de CPF pode ser adicionada aqui
    return true;
  };

  // Função para limpar strings
  const cleanString = (str) => (str ? str.trim() : '');

  // Validação do formulário
  const validateForm = useCallback(() => {
    const newErrors = {};
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!formData.feedbackType) newErrors.feedbackType = 'Selecione o tipo de feedback';
    if (!selectedBeneficiary) newErrors.beneficiary = 'Selecione o beneficiário';
    if (!formData.email.trim() || !emailRegex.test(formData.email)) newErrors.email = 'Email inválido';
    if (!formData.titular.trim()) newErrors.titular = 'Titular é obrigatório';
    if (!formData.carteirinha.trim()) newErrors.carteirinha = 'Número da carteirinha é obrigatório';
    if (!formData.cpf.trim() || !validateCPF(formData.cpf)) newErrors.cpf = 'CPF inválido';
    if (!formData.message.trim()) newErrors.message = 'Descrição é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, selectedBeneficiary]);

  // Envio do formulário
  const handleSubmit = async () => {
    if (validateForm()) {
      setIsLoading(true);
      try {
        const formDataToSend = new FormData();
        formDataToSend.append('message', cleanString(formData.message));
        formDataToSend.append('name', cleanString(formData.nome));
        formDataToSend.append('email', cleanString(formData.email));
        formDataToSend.append('titular', cleanString(formData.titular));
        formDataToSend.append('carteirinha', cleanString(formData.carteirinha));
        formDataToSend.append('feedbackType', cleanString(formData.feedbackType));
        formDataToSend.append('cpf', cleanString(formData.cpf));

        // Simulação de envio para API
        // await api.post('/submit', formDataToSend);

        Alert.alert('Sucesso', 'Formulário enviado com sucesso!', [{ text: 'OK' }]);
        navigation.navigate('Chat Live', {
          message: cleanString(formData.message),
          name: cleanString(formData.nome),
          email: cleanString(formData.email),
          titular: cleanString(formData.titular),
          carteirinha: cleanString(formData.carteirinha),
          feedbackType: cleanString(formData.feedbackType),
          cpf: cleanString(formData.cpf),
        });
      } catch (error) {
        let errorMessage = 'Erro ao enviar formulário. Tente novamente.';
        if (error.response) {
          switch (error.response.status) {
            case 400:
              errorMessage = 'Dados inválidos. Verifique os campos.';
              break;
            case 401:
              errorMessage = 'Sessão expirada. Faça login novamente.';
              break;
            case 500:
              errorMessage = 'Erro no servidor. Tente novamente mais tarde.';
              break;
            default:
              errorMessage = 'Erro inesperado. Tente novamente.';
          }
        } else if (error.message.includes('Network')) {
          errorMessage = 'Sem conexão com a internet.';
        }
        Alert.alert('Erro', errorMessage, [{ text: 'OK' }]);
        setErrors((prev) => ({ ...prev, api: errorMessage }));
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Manipulação de mudança de input
  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  }, []);

  // Manipulação de seleção de beneficiário
  const handleBeneficiarySelect = useCallback( (value) => {
    const beneficiary = value;
    setSelectedBeneficiary(beneficiary || null);
    setFormData((prev) => ({
      ...prev,
      nome: cleanString(beneficiary?.nm_beneficiario),
      carteirinha: cleanString(beneficiary?.cd_cardnumber),
      email: cleanString(beneficiary?.ds_email),
      cpf: cleanString(beneficiary?.cd_cpf),
      titular: cleanString(nm_titular),
    }));

    setErrors((prev) => ({ ...prev, beneficiary: null, carteirinha: null, email: null, cpf: null }));
    setIsEmailEdited(!!beneficiary?.ds_email);
  }, [nm_titular]); // Add nm_titular to dependencies

  // Manipulação de mudança de email
  const handleEmailChange = useCallback((text) => {
    setFormData((prev) => ({ ...prev, email: cleanString(text) }));
    setIsEmailEdited(true);
    setErrors((prev) => ({ ...prev, email: null }));
  }, []);

  // Manipulação de clique na mensagem
  const handleMessageClick = useCallback(() => {
    if (messageInputRef.current && scrollViewRef.current) {
      messageInputRef.current.focus();
      scrollViewRef.current.scrollTo({ y: formData.messageInputY, animated: true });
    }
  }, [formData.messageInputY]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 20}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.primaryColor} />
            </View>
          )}

          <View style={styles.section}>
            <SelectList
              dropdownStyles={styles.dropdownStyles}
              placeholder="Selecione o tipo de feedback"
              setSelected={(val) => handleInputChange('feedbackType', val)}
              data={feedbackOptions}
              save="value"
              search={true}
              boxStyles={[styles.dropdown, errors.feedbackType ? styles.dropdownError : {}]}
              inputStyles={styles.dropdownText}
              dropdownTextStyles={styles.dropdownText}
              placeholderStyle={styles.dropdownPlaceholder}
              accessibilityLabel="Selecionar tipo de feedback"
              accessibilityRole="combobox"
            />
            {errors.feedbackType && (
              <Text style={styles.errorMessage} accessibilityLabel={errors.feedbackType}>
                {errors.feedbackType}
              </Text>
            )}
          </View>

          <View style={styles.section}>
            <SelectBeneficiario
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              onSelect={(item) => handleBeneficiarySelect(item)}
              isEmpty={errors.beneficiary}
              accessibilityLabel="Selecionar beneficiário"
            />
            {errors.beneficiary && (
              <Text style={styles.errorMessage} accessibilityLabel={errors.beneficiary}>
                {errors.beneficiary}
              </Text>
            )}
          </View>

          <FormInput
            field="email"
            label="Email"
            value={formData.email}
            onChange={handleEmailChange}
            icon="email"
            max={50}
            teclado="email-address"
            styles={styles}
            errors={errors}
            theme={theme}
            accessibilityLabel="Digite o email"
          />
          <FormInput
            field="titular"
            label="Titular"
            value={formData.titular}
            onChange={(text) => handleInputChange('titular', text)}
            icon="account"
            max={50}
            teclado="default"
            styles={styles}
            errors={errors}
            theme={theme}
            accessibilityLabel="Digite o nome do titular"
          />
          <FormInput
            field="carteirinha"
            label="Número da Carteirinha"
            value={formData.carteirinha}
            onChange={(text) => handleInputChange('carteirinha', text)}
            icon="card"
            max={50}
            teclado="numeric"
            styles={styles}
            errors={errors}
            theme={theme}
            accessibilityLabel="Digite o número da carteirinha"
          />
          <FormInput
            field="cpf"
            label="CPF"
            value={formData.cpf}
            onChange={(text) => handleInputChange('cpf', text)}
            icon="card-account-details"
            max={14}
            teclado="numeric"
            styles={styles}
            errors={errors}
            theme={theme}
            accessibilityLabel="Digite o CPF"
          />
          <FormInput
            field="message"
            label="Breve Relato"
            value={formData.message}
            onChange={(text) => handleInputChange('message', text)}
            icon="message-text"
            max={500}
            teclado="default"
            multiline={true}
            numberOfLines={5}
            onFocus={handleMessageClick}
            inputRef={messageInputRef}
            styles={styles}
            errors={errors}
            theme={theme}
            accessibilityLabel="Digite o relato"
          />

          {errors.api && (
            <Text style={styles.errorMessage} accessibilityLabel={errors.api}>
              {errors.api}
            </Text>
          )}

          <View style={styles.section}>
            <TouchableOpacity
              style={[styles.button, { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.buttonBackground }]}
              onPress={handleSubmit}
              accessibilityRole="button"
              accessibilityLabel="Entrar no chat"
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>Clica aqui para entrar no Chat</Text>
              <Image
                source={enioEmail}
                style={{ width: 30, height: 30, marginLeft: 10 }}
                accessibilityLabel="Ícone de email"
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
        <Rodape />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default App;