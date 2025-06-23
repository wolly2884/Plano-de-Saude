import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
  Modal,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import SelectBeneficiario from '../../../../../components/SelectBeneficiario';

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
        <Feather name={isOpen ? 'chevron-up' : 'chevron-down'} size={20} color={theme.textColor} />
      </TouchableOpacity>
      {isOpen && <SafeAreaView>{children}</SafeAreaView>}
    </>
  );
};

const App = ({ navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [dtNasc, setDtNasc] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [isEmptyDropDownPicker, setIsEmptyDropDownPicker] = useState(false);
  const [formData, setFormData] = useState({
    nmBeneficiario: '', age: '', estadoCivil: '', sexo: '', celular: '', CNS: '',
    logradouro: '', numero: '', complemento: '', cidade: '', CEP: '', estado: '', id: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [openSection, setOpenSection] = useState('');
  const [isSaving, setIsSaving] = useState(false);
 
  /* --- 2. Campo sexo (modal seletor) ------------------------------------- */
  const SEXO_OPTS = [
    { key: 1, value: 'M', label: 'Masculino' },
    { key: 2, value: 'F', label: 'Feminino' },
  ];
   const [sexo, setSexo] = useState('');

  /* --- 3. Campo estado civil (modal seletor) ----------------------------- */
const ESTADO_OPTS = [
  { key: 1, value: 'S', label: 'Solteiro(a)' },
  { key: 2, value: 'C', label: 'Casado(a)' },
  { key: 3, value: 'D', label: 'Divorciado(a)' },
  { key: 4, value: 'V', label: 'Viúvo(a)' },
];
const [estadoCivil, setEstadoCivil] = useState('');

  const sections = {
    beneficiario: ['nmBeneficiario','age','estadoCivil','sexo','celular','CNS'],
    endereco:     ['logradouro','numero','complemento','cidade','CEP','estado']
  };

  const formatarData = (dataString) => {
    if (!dataString || typeof dataString !== 'string') return '';
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dataString)) return dataString;
    const partes = dataString.split('-');
    if (partes.length !== 3) return dataString;
    const [ano, mes, dia] = partes;
    return `${dia}/${mes}/${ano}`;
  };

  const formatStrategies = {
    celular: formatCelular,
    CEP: formatCEP,
    age: formatarData,
    estado: (val) => val.toUpperCase(),
  };

  const updateFormData = (field, value) => {
    const formattedValue = formatStrategies[field] ? formatStrategies[field](value) : value;
    setFormData((prev) => ({ ...prev, [field]: formattedValue }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: false }));
  };

  const countErrors = (section) => {
    return sections[section].reduce((count, field) => formErrors[field] ? count + 1 : count, 0);
  };

  const handleRegister = async () => {
    if (!validateFields(formData, setFormErrors)) {
      console.log('formErrors', formErrors)
      Alert.alert('Erro', 'Preencha todos os campos corretamente, incluindo datas válidas.');
      return;
    }

    const formattedAge = validateAndFormatDate(dtNasc, 'age', setFormErrors);
    if (!formattedAge) {
      Alert.alert('Erro', 'Datas inválidas. Verifique os campos de data.');
      return;
    }

    const payload = {
      id: formData.id,
      nm_beneficiario: formData.nmBeneficiario,
      cd_age: formattedAge,
      ic_estado_civil: estadoCivil,
      ic_sexo: sexo,
      cd_celular: formData.celular.replace(/\D/g, ''),
      cd_cns: formData.CNS,

      nm_logradouro: formData.logradouro,
      cd_numero: formData.numero,
      nm_complemento: formData.complemento,
      nm_cidade: formData.cidade,
      cd_cep: formData.CEP.replace(/\D/g, ''),
      sg_estado: formData.estado,
    };

    try {
      setIsSaving(true);
      await api.put('/Beneficiario', [payload]);
      await AsyncStorage.setItem('user', JSON.stringify(payload));
      await fetchUserData();
      setIsSaving(false);
      Alert.alert('Sucesso', 'Cadastro atualizado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      setIsSaving(false);
      console.error('Erro ao registrar:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o cadastro. Tente novamente.');
    }
  };

  const selecionado = (beneficiary) => {
    if (beneficiary) {
      setFormData({
        nmBeneficiario: beneficiary.nm_beneficiario || '',
        age: formatDate(beneficiary.cd_age) || '',
        estadoCivil: beneficiary.ic_estado_civil || '',
        sexo: beneficiary.ic_sexo || '',
        celular: formatCelular(beneficiary.cd_celular) || '',
        CNS: beneficiary.cd_cns || '',

        logradouro: beneficiary.nm_logradouro || '',
        numero: beneficiary.cd_numero || '',
        complemento: beneficiary.nm_complemento || '',
        cidade: beneficiary.nm_cidade || '',
        CEP: formatCEP(beneficiary.cd_cep) || '',
        estado: beneficiary.sg_estado || '',
        id: beneficiary.key,
      });
      setSexo(beneficiary.ic_sexo);
      setDtNasc(formatDate(beneficiary.cd_age))
      setEstadoCivil(beneficiary.ic_estado_civil);
      setFormErrors({});
    }
  };

  const fetchUserData = async () => {
    try {
      const storedID = await AsyncStorage.getItem('ID');
      if (!storedID) return;
      const userData = await api.get(`/Beneficiario/get/${storedID}`);
      const { rowCount, rows } = userData.data;
      if (rowCount > 0) {
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
        await AsyncStorage.setItem('beneficiaries', JSON.stringify(beneficiaryData));
      }
    } catch (userError) {
      console.error('Erro ao buscar dados do usuário:', userError.message);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const getInputStyle = (field) => ({
    ...styles.inputContainer,
    ...(formErrors[field] ? styles.errorInput : {}),
  });

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

          {/* Seção de Beneficiário */}
          <CollapsibleSection
            title={countErrors('beneficiario') > 0 ? `Dados do Beneficiário (${countErrors('beneficiario')} erros)` : 'Dados do Beneficiário'}
            isOpen={openSection === 'beneficiario'}
            onToggle={() => setOpenSection(openSection === 'beneficiario' ? '' : 'beneficiario')}
            theme={theme}
          >
            <InputTexto text="Nome do Beneficiário" value={formData.nmBeneficiario}
              funcao={(value) => updateFormData('nmBeneficiario', value)} max={100}
              teclado="default" icon={formErrors.nmBeneficiario ? 'account-alert' : 'account'}
              style={getInputStyle('nmBeneficiario')} />

            <InputTexto
              text="Data de Nascimento"
              value={dtNasc}
              onChange={setDtNasc}
              isDatePicker
              icon="calendar"
              style={getInputStyle('age')} redicon={formErrors.age} 
            />

            <InputTexto
              text="Estado civil"
              value={estadoCivil}
              onChange={setEstadoCivil}
              isSelect
              selectOptions={ESTADO_OPTS}
              selectTitle="Selecione o estado civil"
              icon="account-heart"
              style={getInputStyle('estadoCivil')} redicon={formErrors.estadoCivil}
            />

            <InputTexto
              text="Sexo"
              value={sexo}
              onChange={setSexo}
              isSelect
              selectOptions={SEXO_OPTS}
              selectTitle="Selecione o sexo"
              icon="account"
              style={getInputStyle('ic_sexo')} redicon={formErrors.ic_sexo}
            />

            <InputTexto text="Celular" value={formData.celular}
              funcao={(value) => updateFormData('celular', value)} max={15} teclado="phone-pad"
              icon={formErrors.celular ? 'phone-off' : 'phone'} style={getInputStyle('celular')}
              redicon={formErrors.celular} />

            <InputTexto text="CNS" value={formData.CNS}
              funcao={(value) => updateFormData('CNS', value)} max={15} teclado="numeric"
              icon={formErrors.CNS ? 'card-account-details-alert' : 'card-account-details'}
              style={getInputStyle('CNS')} redicon={formErrors.CNS} />

          </CollapsibleSection>

          {/* Seção de Endereço */}
          <CollapsibleSection
            title={countErrors('endereco') > 0 ? `Endereço Beneficiário (${countErrors('endereco')} erros)` : 'Endereço Beneficiário'}
            isOpen={openSection === 'endereco'}
            onToggle={() => setOpenSection(openSection === 'endereco' ? '' : 'endereco')}
            theme={theme}
          >
            <InputTexto text="Logradouro" value={formData.logradouro}
              funcao={(value) => updateFormData('logradouro', value)} max={100} teclado="default"
              icon={formErrors.logradouro ? 'home-alert' : 'home'} style={getInputStyle('logradouro')}
              redicon={formErrors.logradouro} />

            <InputTexto text="Número" value={formData.numero}
              funcao={(value) => updateFormData('numero', value)} max={10} teclado="numeric"
              icon={formErrors.numero ? 'numeric-off' : 'numeric'} style={getInputStyle('numero')}
              redicon={formErrors.numero} />

            <InputTexto text="Complemento" value={formData.complemento}
              funcao={(value) => updateFormData('complemento', value)} max={50} teclado="default"
              icon="home-plus" style={getInputStyle('complemento')} />

            <InputTexto text="Cidade" value={formData.cidade}
              funcao={(value) => updateFormData('cidade', value)} max={50} teclado="default"
              icon={formErrors.cidade ? 'city-variant' : 'city'} style={getInputStyle('cidade')}
              redicon={formErrors.cidade} />

            <InputTexto text="CEP" value={formData.CEP}
              funcao={(value) => updateFormData('CEP', value)} max={9} teclado="numeric"
              icon={formErrors.CEP ? 'map-marker-off' : 'map-marker'} style={getInputStyle('CEP')}
              redicon={formErrors.CEP} />

            <InputTexto text="Estado (UF)" value={formData.estado}
              funcao={(value) => updateFormData('estado', value)} max={2} teclado="default"
              icon={formErrors.estado ? 'map-marker-alert' : 'map'} style={getInputStyle('estado')}
              redicon={formErrors.estado} />

          </CollapsibleSection>
        </ScrollView>

        {!isSaving && (
          <TouchableOpacity
            style={styles.cadButton}
            onPress={handleRegister}
            accessibilityLabel="Registrar beneficiário"
            accessibilityHint="Salva os dados do beneficiário"
          >
            <Text style={styles.cadButtonText}>Registrar</Text>
          </TouchableOpacity>
        )}
      </View>

      <Rodape />

      <Modal transparent={true} visible={isSaving} animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={{ marginTop: 15, fontSize: 16 }}>Atualizando dados...</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default App;
