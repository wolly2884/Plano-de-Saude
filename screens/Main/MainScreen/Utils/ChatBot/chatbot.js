import React, { useState, useCallback, useRef, useMemo } from 'react';
import { TouchableOpacity, Text, ScrollView, SafeAreaView, Image, View, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../../../context/ThemeContext';
import InputTexto from '../../../../../components/InputTexto';
import Rodape from '../../../../../components/Rodape';
import api from '../../../../../api/api';
import { getStyles } from './chatstyle';
import enioEmail from '../../../../../assets/enioemail.png';

const feedbackOptions = [
  { key: '1', value: 'Reclamação' },
  { key: '2', value: 'Sugestão' },
  { key: '3', value: 'Elogio' },
  { key: '4', value: 'Outros' },
];

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

  const { theme } = useTheme();
  const styles = useMemo(() => getStyles(theme), [theme]);
  const messageInputRef = useRef(null);
  const scrollViewRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const [storedCardNumber, storedEmail, storedUsername, storedID, cachedBeneficiaries] = await Promise.all([
            AsyncStorage.getItem('cardNumber'),
            AsyncStorage.getItem('Email'),
            AsyncStorage.getItem('username'),
            AsyncStorage.getItem('ID'),
            AsyncStorage.getItem('beneficiaries'),
          ]);

          if (isActive) {
            setFormData((prev) => ({
              ...prev,
              email: storedEmail || '',
              titular: storedUsername || '',
              carteirinha: storedCardNumber || '',
            }));

            if (cachedBeneficiaries) {
              setBeneficiaries(JSON.parse(cachedBeneficiaries));
            } else {
              const response = await api.get(`/Beneficiario/get/${storedID}`);
              const { rowCount, rows } = response.data;

              if (rowCount > 0) {
                const beneficiaryData = rows.map((item) => ({
                  key: item.id,
                  value: item.nm_beneficiario,
                  nome: item.nm_beneficiario,
                  cpf: item.cd_cpf,
                  email: item.ds_email,
                  cardnumber: item.cd_cardnumber,
                }));
                setBeneficiaries(beneficiaryData);
                await AsyncStorage.setItem('beneficiaries', JSON.stringify(beneficiaryData));
              } else {
                setErrors((prev) => ({ ...prev, beneficiary: 'Nenhum beneficiário encontrado' }));
              }
            }
          }
        } catch (error) {
          if (isActive) {
            let errorMessage = 'Erro ao carregar dados. Tente novamente.';
            if (error.response?.status === 404) {
              errorMessage = 'Beneficiários não encontrados.';
            } else if (error.message.includes('Network')) {
              errorMessage = 'Falha na conexão. Verifique sua rede.';
            }
            setErrors((prev) => ({ ...prev, api: errorMessage }));
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

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!formData.feedbackType) newErrors.feedbackType = 'Selecione o tipo de feedback';
    if (!selectedBeneficiary) newErrors.beneficiary = 'Selecione o beneficiário';
    if (!formData.email.trim() || !emailRegex.test(formData.email)) newErrors.email = 'Email inválido';
    if (!formData.titular.trim()) newErrors.titular = 'Titular é obrigatório';
    if (!formData.carteirinha.trim()) newErrors.carteirinha = 'Número da carteirinha é obrigatório';
    if (!formData.message.trim()) newErrors.message = 'Descrição é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsLoading(true);
      try {
        const formDataToSend = new FormData();
        formDataToSend.append('message', formData.message);
        formDataToSend.append('name', selectedBeneficiary?.nome || '');
        formDataToSend.append('email', formData.email);
        formDataToSend.append('titular', formData.titular);
        formDataToSend.append('carteirinha', formData.carteirinha);
        formDataToSend.append('feedbackType', formData.feedbackType);
        formDataToSend.append('cpf', formData.cpf);

        Alert.alert('Sucesso', 'Formulário enviado com sucesso!');
        await navigation.navigate('Chat Live', {
          message: formData.message,
          name: selectedBeneficiary?.nome || '',
          email: formData.email,
          titular: formData.titular,
          carteirinha: formData.carteirinha,
          feedbackType: formData.feedbackType,
          cpf: formData.cpf,
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
          }
        } else if (error.message.includes('Network')) {
          errorMessage = 'Sem conexão com a internet.';
        }
        setErrors((prev) => ({ ...prev, api: errorMessage }));
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleBeneficiarySelect = (value) => {
    const beneficiary = beneficiaries.find((item) => item.value === value);
    setSelectedBeneficiary(beneficiary || null);
    setFormData((prev) => ({
      ...prev,
      carteirinha: beneficiary?.cardnumber || '',
      email: beneficiary?.email || '',
      cpf: beneficiary?.cpf || '',
    }));
    setErrors((prev) => ({ ...prev, beneficiary: null, carteirinha: null, email: null, cpf: null }));
    setIsEmailEdited(!!beneficiary?.email);
  };

  const handleEmailChange = (text) => {
    setFormData((prev) => ({ ...prev, email: text }));
    setIsEmailEdited(true);
    setErrors((prev) => ({ ...prev, email: null }));
  };

  const handleMessageClick = () => {
    if (messageInputRef.current && scrollViewRef.current) {
      messageInputRef.current.focus();
      scrollViewRef.current.scrollTo({ y: formData.messageInputY, animated: true });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView ref={scrollViewRef} contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
          {isLoading && <ActivityIndicator size="large" color={theme.primaryColor} />}

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
              disabled={isLoading || beneficiaries.length === 0}
              accessibilityLabel="Selecionar beneficiário"
              accessibilityRole="combobox"
            />
            {errors.beneficiary && (
              <Text style={styles.errorMessage} accessibilityLabel={errors.beneficiary}>
                {errors.beneficiary}
              </Text>
            )}
            {beneficiaries.length === 0 && !isLoading && (
              <Text style={styles.noDataText} accessibilityLabel="Nenhum beneficiário disponível">
                Nenhum beneficiário disponível. Tente novamente ou entre em contato com o suporte.
              </Text>
            )}
            {errors.api && (
              <Text style={styles.errorMessage} accessibilityLabel={errors.api}>
                {errors.api}
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
            numberOfLines={3}
            onFocus={handleMessageClick}
            inputRef={messageInputRef}
            styles={styles}
            errors={errors}
            theme={theme}
          />

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