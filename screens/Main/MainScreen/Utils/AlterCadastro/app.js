import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { getStyles } from './Styles';
import InputTexto from '../../../../../components/InputTexto';
import Rodape from '../../../../../components/Rodape';
import api from '../../../../../api/api';
import { useTheme } from '../../../../../context/ThemeContext';
import Feather from 'react-native-vector-icons/Feather';
import {
  formatCPF,
  formatCelular,
  formatCEP,
  formatDate,
  validateFields,
  validateAndFormatDate,
} from '../../../../../components/validations';
import SelectBeneficiario  from '../../../../../components/SelectBeneficiario';

// Componente para seções expansíveis
const CollapsibleSection = ({ title, isOpen, onToggle, children, theme }) => {
  const styles = getStyles(theme);
  return (
    <>
      <TouchableOpacity
        onPress={onToggle}
        style={[styles.ButtonDrop, { backgroundColor: isOpen ? 'gray' : theme.backgroundColor }]}
        accessibilityLabel={`Expandir ${title}`}
      >
        <Text style={styles.TextDrop}>{title}</Text>
        <Feather
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={theme.textColor}
        />
      </TouchableOpacity>
      {isOpen && <SafeAreaView>{children}</SafeAreaView>}
    </>
  );
};

const App = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  // Other States
  const [ID, setID] = useState('');
  const [Beneficiario, setBeneficiario] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [isEmptyDropDownPicker, setIsEmptyDropDownPicker] = useState(false);

  // Mostra a senha
  const [showSenhaNew, setShowSenhaNew] = useState(false);

  // Estado consolidado para formulário
  const [formData, setFormData] = useState({
    nmBeneficiario: '',
    CPF: '',
    password: '',
    age: '',
    estadoCivil: '',
    sexo: '',
    Email: '',
    celular: '',
    logradouro: '',
    numero: '',
    complemento: '',
    cidade: '',
    CEP: '',
    estado: '',
    cardNumber: '',
    healthPlan: '',
    CNS: '',
    dtInclusao: '',
    id: '',
  });

  // Estado consolidado para validação
  const [formErrors, setFormErrors] = useState({});
  const [openSection, setOpenSection] = useState('');

  // Definir campos por seção
  const sections = {
    beneficiario: [
      'nmBeneficiario',
      'age',
      'estadoCivil',
      'sexo',
      'celular',
    ],
    endereco: [
      'logradouro',
      'numero',
      'complemento',
      'cidade',
      'CEP',
      'estado',
    ]
  };

  // Função para contar erros por seção
  const countErrors = (section) => {
    return sections[section].reduce((count, field) => {
      return formErrors[field] ? count + 1 : count;
    }, 0);
  };

  // Função genérica para atualizar campos do formulário
  const updateFormData = (field, value) => {
    let formattedValue = value;
    switch (field) {
      case 'CPF':
        formattedValue = formatCPF(value);
        break;
      case 'celular':
        formattedValue = formatCelular(value);
        break;
      case 'CEP':
        formattedValue = formatCEP(value);
        break;
      case 'age':
      case 'dtInclusao':
        formattedValue = formatDate(value);
        break;
      case 'sexo':
        formattedValue = value.toUpperCase();
        break;
      case 'estado':
        formattedValue = value.toUpperCase();
        break;
    }
    console.log(`Atualizando ${field}: Raw: ${value}, Formatted: ${formattedValue}`);
    setFormData((prev) => ({ ...prev, [field]: formattedValue }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  // Função de registro
  const handleRegister = async () => {
    if (!validateFields(formData, setFormErrors)) {
      Alert.alert('Erro', 'Preencha todos os campos corretamente, incluindo datas válidas.');
      return;
    }

    // Formata as datas para o backend
    const formattedAge = validateAndFormatDate(formData.age, 'age', setFormErrors);
    const formattedDtInclusao = validateAndFormatDate(formData.dtInclusao, 'dtInclusao', setFormErrors);

    if (!formattedAge || !formattedDtInclusao) {
      Alert.alert('Erro', 'Datas inválidas. Verifique os campos de data.');
      return;
    }

    const payload = {
      id: formData.id,
      nm_beneficiario: formData.nmBeneficiario,
      cd_cpf: formData.CPF.replace(/\D/g, ''),
      cd_age: formattedAge,
      ic_estado_civil: formData.estadoCivil,
      ic_sexo: formData.sexo,
      cd_celular: formData.celular.replace(/\D/g, ''),
      nm_logradouro: formData.logradouro,
      cd_numero: formData.numero,
      nm_complemento: formData.complemento,
      nm_cidade: formData.cidade,
      cd_cep: formData.CEP.replace(/\D/g, ''),
      sg_estado: formData.estado,
      cd_cns: formData.CNS,
    };

    console.log(payload);

    try {
      await api.put('/Beneficiario', [payload]);
      Alert.alert('Sucesso', 'Cadastro atualizado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Erro ao registrar:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o cadastro. Tente novamente.');
    }
  };

  // Estilo dinâmico para inputs
  const getInputStyle = (field) => ({
    ...styles.inputContainer,
    ...(formErrors[field] ? styles.errorInput : {}),
  });

  // Handle beneficiary selection
  const selecionado = (beneficiary) => {
    if (beneficiary) {
      setFormData({
        nmBeneficiario: beneficiary.nm_beneficiario || '',
        CPF: formatCPF(beneficiary.cd_cpf) || '',
        age: formatDate(beneficiary.cd_age) || '',
        estadoCivil: beneficiary.ic_estado_civil || '',
        sexo: beneficiary.ic_sexo || '',
        celular: formatCelular(beneficiary.cd_celular) || '',
        logradouro: beneficiary.nm_logradouro || '',
        numero: beneficiary.cd_numero || '',
        complemento: beneficiary.nm_complemento || '',
        cidade: beneficiary.nm_cidade || '',
        CEP: formatCEP(beneficiary.cd_cep) || '',
        estado: beneficiary.sg_estado || '',
        CNS: beneficiary.cd_cns || '',
        id: beneficiary.key,
      });
      console.log(formData)
      setFormErrors({}); // Clear errors on selection
    }
  };

  const toggleShowSenhaNew = () => setShowSenhaNew(!showSenhaNew);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
          <SafeAreaView>
            <SelectBeneficiario
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              onSelect={(item) => selecionado(item)}
              isEmpty={isEmptyDropDownPicker}
            />
          </SafeAreaView>

          {/* Seção de Dados do Beneficiário */}
          <CollapsibleSection
            title={countErrors('beneficiario') > 0 ? `Dados do Beneficiário (${countErrors('beneficiario')} erros)` : 'Dados do Beneficiário'}
            isOpen={openSection === 'beneficiario'}
            onToggle={() => setOpenSection(openSection === 'beneficiario' ? '' : 'beneficiario')}
            theme={theme}
          >
            <InputTexto
              text="Nome do Beneficiário"
              value={formData.nmBeneficiario}
              funcao={(value) => updateFormData('nmBeneficiario', value)}
              max={100}
              teclado="default"
              icon={formErrors.nmBeneficiario ? 'account-alert' : 'account'}
              style={getInputStyle('nmBeneficiario')}
            />

            <InputTexto
              text="Data de Nascimento (DD/MM/YYYY)"
              value={formData.age}
              funcao={(value) => updateFormData('age', value, 10)}
              max={10}
              teclado="numeric"
              isDatePicker={true}
              icon={formErrors.age ? 'calendar-alert' : 'calendar'}
              style={getInputStyle('age')}
              redicon={formErrors.age}
            />
            <InputTexto
              text="Estado Civil"
              value={formData.estadoCivil}
              funcao={(value) => updateFormData('estadoCivil', value)}
              max={20}
              teclado="default"
              icon={formErrors.estadoCivil ? 'heart-broken' : 'heart'}
              style={getInputStyle('estadoCivil')}
              redicon={formErrors.estadoCivil}
            />
            <InputTexto
              text="Sexo (M/F)"
              value={formData.sexo}
              funcao={(value) => updateFormData('sexo', value)}
              max={1}
              teclado="default"
              icon={formErrors.sexo ? 'gender-male-female-variant' : 'gender-male-female'}
              style={getInputStyle('sexo')}
              redicon={formErrors.sexo}
            />

            <InputTexto
              text="Celular"
              value={formData.celular}
              funcao={(value) => updateFormData('celular', value)}
              max={15}
              teclado="phone-pad"
              icon={formErrors.celular ? 'phone-off' : 'phone'}
              style={getInputStyle('celular')}
              redicon={formErrors.celular}
            />
          </CollapsibleSection>

          {/* Seção de Dados do Endereço */}
          <CollapsibleSection
            title={countErrors('endereco') > 0 ? `Endereço Beneficiario (${countErrors('endereco')} erros)` : 'Endereço Beneficiario'}
            isOpen={openSection === 'endereco'}
            onToggle={() => setOpenSection(openSection === 'endereco' ? '' : 'endereco')}
            theme={theme}
          >
            <InputTexto
              text="Logradouro"
              value={formData.logradouro}
              funcao={(value) => updateFormData('logradouro', value)}
              max={100}
              teclado="default"
              icon={formErrors.logradouro ? 'home-alert' : 'home'}
              style={getInputStyle('logradouro')}
              redicon={formErrors.logradouro}
            />
            <InputTexto
              text="Número"
              value={formData.numero}
              funcao={(value) => updateFormData('numero', value)}
              max={10}
              teclado="numeric"
              icon={formErrors.numero ? 'numeric-off' : 'numeric'}
              style={getInputStyle('numero')}
              redicon={formErrors.numero}
            />
            <InputTexto
              text="Complemento"
              value={formData.complemento}
              funcao={(value) => updateFormData('complemento', value)}
              max={50}
              teclado="default"
              icon="home-plus"
              style={getInputStyle('complemento')}
              redicon={formErrors.complemento}
            />
            <InputTexto
              text="Cidade"
              value={formData.cidade}
              funcao={(value) => updateFormData('cidade', value)}
              max={50}
              teclado="default"
              icon={formErrors.cidade ? 'city-variant' : 'city'}
              style={getInputStyle('cidade')}
              redicon={formErrors.cidade}
            />
            <InputTexto
              text="CEP"
              value={formData.CEP}
              funcao={(value) => updateFormData('CEP', value)}
              max={9}
              teclado="numeric"
              icon={formErrors.CEP ? 'map-marker-off' : 'map-marker'}
              style={getInputStyle('CEP')}
              redicon={formErrors.CEP}
            />
            <InputTexto
              text="Estado (UF)"
              value={formData.estado}
              funcao={(value) => updateFormData('estado', value)}
              max={2}
              teclado="default"
              icon={formErrors.estado ? 'map-marker-alert' : 'map'}
              style={getInputStyle('estado')}
              redicon={formErrors.estado}
            />
          </CollapsibleSection>
        </ScrollView>

        <TouchableOpacity
          style={styles.cadButton}
          onPress={handleRegister}
          accessibilityLabel="Registrar beneficiário"
          accessibilityHint="Salva os dados do beneficiário"
        >
          <Text style={styles.cadButtonText}>Registrar</Text>
        </TouchableOpacity>
      </View>
      <Rodape />
    </View>
  );
};

export default App;