
import { Text, SafeAreaView, View, Image, TouchableOpacity, Alert, Linking, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import Calendar from '../../../../../components/Calendar';
import Rodape from '../../../../../components/Rodape';
import * as MailComposer from 'expo-mail-composer';
import api from '../../../../../api/api';
import Modal from "react-native-modal";
import { Camera, Send } from 'lucide-react-native';
import '../../../../../components/calendarLocale';
import { getStyles } from './Styles';
import { useTheme } from '../../../../../context/ThemeContext';
import { FontAwesome } from '@expo/vector-icons';
import { formatDate } from '../../../../../components/validations';

moment.locale('pt-br');

const Horarios = ({ selected, onSelect, hora, disabled }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const image = selected ? require('../../../../../assets/src/relogiol.png') : require('../../../../../assets/src/relogio.png');

  return (
    <TouchableOpacity 
      style={styles.button_horario} 
      onPress={onSelect} 
      disabled={disabled}
    >
      <View style={[
        styles.horarioContainer,
        { 
          borderWidth: selected ? 3 : 1, 
          backgroundColor: disabled ? '#d3d3d3' : selected ? '#6542a1' : 'white', 
          opacity: disabled ? 0.5 : 1 
        }
      ]}>
        <Image source={image} style={styles.horatioimage} />
        <Text style={[
          styles.button_horario_text,
          { 
            top: selected ? -3 : -1, 
            color: disabled ? '#888' : selected ? 'white' : 'black' 
          }
        ]}>
          {hora}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default function App({ route, navigation }) {
  const [selectedDate, setSelectedDate] = useState(moment());
  const [selectedHorario, setSelectedHorario] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [observacao, setObservacao] = useState('');
  const { ben, med, esp, ate } = route.params;
  const [color, setColor] = useState('white');
  const [disabled, setDisabled] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [bookedHorarios, setBookedHorarios] = useState([]);
  const { theme } = useTheme();
  const styles = getStyles(theme);

  // Função para buscar horários agendados
  const fetchBookedHorarios = async (date) => {
    try {
      const response = await api.get('/Agenda', {
        params: {
          dt_agendamento: date,
          cd_crm: med.crm,
          cd_especialidade: esp.esp,
        },
      });
      const rowCount = response.data.rowCount
      if (rowCount === 0) {
        Alert.alert('Aviso', 'Não há horários agendados para esta data.');
        setBookedHorarios([]);
        return;
      }
      if (rowCount < 0) {
        Alert.alert('Aviso', 'Não há horários agendados para esta data.');
        setBookedHorarios([]);
        return;
      }
      if (rowCount > 0) {
        Alert.alert('Aviso', 'Existem horários agendados para esta data.');
        const bookedTimes = response.data.rows.map(item => item.hr_agendamento);
        console.log('Horários agendados:', bookedTimes);
        setBookedHorarios(bookedTimes);
        return;
      }
      // Extrair horários agendados
      console.log('Horários agendados encontrados:', rowCount);
      if (!response.data || !Array.isArray(response.data)) {
        Alert.alert('Erro', 'Dados de horários agendados inválidos.');
        setBookedHorarios([]);
        return;
      }

    } catch (error) {
      console.error('Erro ao buscar horários agendados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os horários disponíveis.');
    }
  };

  // Atualizar horários agendados quando a data selecionada mudar
  useEffect(() => {
    fetchBookedHorarios(selectedDate);
    setSelectedHorario(null); // Resetar horário selecionado ao mudar a data
  }, [selectedDate]);

  const handleHorarioSelect = (horario) => {
    if (!bookedHorarios.includes(horario)) {
      setSelectedHorario(horario);
    }
  };

  const Gravar = async () => {
    if (bookedHorarios.includes(selectedHorario)) {
      Alert.alert('Erro', 'Este horário já está agendado. Por favor, escolha outro.');
      return;
    }
    try {
      await api.post('/Agenda', [{
        'nm_medico': med.value,
        'cd_crm': med.crm,
        'cd_especialidade': esp.esp,
        'ds_tipo_agendamento': ate.value,
        'dt_agendamento': selectedDate,
        'hr_agendamento': selectedHorario,
        'cd_cpf_beneficiaro': ben.cd_cpf,
        'ds_observacao': observacao,
      }]);
      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!', [
        { text: 'OK', onPress: () => navigation.navigate('Agendamento') },
      ]);
    } catch (error) {
      console.error('Erro ao armazenar os dados:', error);
      Alert.alert('Erro', 'Não foi possível realizar o cadastro. Tente novamente.', [
        { text: 'OK' },
      ]);
    }
  };

  const openWhatsApp = () => {
    const url = 'whatsapp://send?';
    const text = `text=Olá! ${med.value}\nTitular : ${ben.value}\nDigite aqui sua mensagem : `;
    const fone = '&phone=+5513981375296';
    Linking.openURL(url + text + fone)
      .then(() => {
        console.log('WhatsApp Opened');
      })
      .catch(() => {
        alert('Por favor, instale o WhatsApp para entrar em contato.');
      });
  };

  const sendEmail = async () => {
    const emailContent = {
      recipients: ['Anderson.tome@fatec.sp.gov.br'],
      body: `
        Nome Medico:    ${med.value}
        Titular:        ${ben.value}
        Mensagem:       ${'Digite aqui sua mensagem'}
      `,
      isHtml: false,
    };
    await MailComposer.composeAsync(emailContent);
  };

  const callPhoneNumber = (phoneNumber) => {
    const phoneURL = `tel:${phoneNumber}`;
    Linking.openURL(phoneURL)
      .catch((err) => console.error('Erro ao tentar abrir o discador:', err));
  };

  const closeModal = (text) => {
    setObservacao(text);
    setColor(text.trim() === '' ? 'white' : 'green');
    setDisabled(text.trim() === '');
  };

  const saveModal = () => {
    setModalVisible(false);
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const isDisabled = !selectedDate || !selectedHorario || bookedHorarios.includes(selectedHorario);
  const image = med.sexo === 'M' ? require('../../../../../assets/src/medico.png') : require('../../../../../assets/src/medica.png');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Image source={image} style={styles.headerImage} />
        <Text style={styles.headerText}>Olá, {ben.value}, </Text>
        <Text style={styles.headerText}>Tudo bem!</Text>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Eu sou {med.sexo === 'M' ?' a' : ' o ' } {med.Nome}</Text>
          <Text style={styles.headerText}>{esp.value}</Text>
          <Text style={styles.headerText}>CRM: {med.crm}</Text>
        </View>
        <View style={styles.buttonHeader}>
          <TouchableOpacity style={styles.buttonContainer} onPress={() => callPhoneNumber('+5513981375296')}>
            <FontAwesome name="mobile-phone" size={30} color={theme.inputTextColor} style={styles.contato} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonContainer} onPress={openWhatsApp}>
            <FontAwesome name="whatsapp" size={30} color={theme.inputTextColor} style={styles.contato} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonContainer} onPress={sendEmail}>
            <FontAwesome name="envelope-square" size={30} color={theme.inputTextColor} style={styles.contato} />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Image source={require("../../../../../assets/src/estrela.png")} style={{ top: 200, left: 30, width: 17, height: 17 }} />
          <Text style={{ top: 200, left: 35, fontWeight: 'bold', fontStyle: 'italic' }}>4.8</Text>
        </View>
      </View>
      <View style={{ borderWidth: 0, width: "100%", height: '60%', borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: 'white' }}>
        <View style={{ top: -20 }}>
          <View>
            <Calendar onSelectDate={setSelectedDate} selected={selectedDate} />
            <StatusBar style="auto" />
          </View>
          <Text style={{ fontSize: 30, fontWeight: 'bold', fontStyle: 'italic', top: -70, left: 40 }}>Horarios</Text>
          <View style={{ top: -70, flexDirection: 'row', justifyContent: 'space-around' }}>
            {['07:00', '08:00', '09:00', '10:00'].map(hora => (
              <Horarios 
                key={hora} 
                selected={selectedHorario === hora} 
                onSelect={() => handleHorarioSelect(hora)} 
                hora={hora} 
                disabled={bookedHorarios.includes(hora)}
              />
            ))}
          </View>
          <View style={{ top: -60, flexDirection: 'row', justifyContent: 'space-around' }}>
            {['11:00', '12:00', '13:00', '14:00'].map(hora => (
              <Horarios 
                key={hora} 
                selected={selectedHorario === hora} 
                onSelect={() => handleHorarioSelect(hora)} 
                hora={hora} 
                disabled={bookedHorarios.includes(hora)}
              />
            ))}
          </View>
          <View style={{ top: -50, flexDirection: 'row', justifyContent: 'space-around' }}>
            {['15:00', '16:00', '17:00', '18:00'].map(hora => (
              <Horarios 
                key={hora} 
                selected={selectedHorario === hora} 
                onSelect={() => handleHorarioSelect(hora)} 
                hora={hora} 
                disabled={bookedHorarios.includes(hora)}
              />
            ))}
          </View>
          <View style={{ top: -40, flexDirection: 'row', justifyContent: 'space-around' }}>
            {['19:00', '20:00', '21:00', '22:00'].map(hora => (
              <Horarios 
                key={hora} 
                selected={selectedHorario === hora} 
                onSelect={() => handleHorarioSelect(hora)} 
                hora={hora} 
                disabled={bookedHorarios.includes(hora)}
              />
            ))}
          </View>
        </View>
        <TouchableOpacity
          style={{ 
            borderRadius: 20, 
            borderWidth: isDisabled ? 1 : 3, 
            position: 'absolute', 
            bottom: 40, 
            left: 10, 
            alignSelf: 'center', 
            padding: 8, 
            backgroundColor: isDisabled ? 'white' : '#6542a1', 
            borderColor: isDisabled ? 'black' : 'orange' 
          }}
          onPress={Gravar} 
          disabled={isDisabled}
        >
          <Text style={{ textAlign: 'center', fontSize: 20, color: isDisabled ? 'black' : 'white', fontWeight: 'bold', fontStyle: 'italic' }}>
            Agende Agora sua Consulta
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ 
            borderRadius: 20, 
            borderWidth: isDisabled ? 1 : 3, 
            position: 'absolute', 
            bottom: 40, 
            right: 10, 
            alignSelf: 'center', 
            padding: 11, 
            backgroundColor: isDisabled ? 'white' : '#6542a1', 
            borderColor: isDisabled ? 'black' : 'orange' 
          }}
          onPress={() => setModalVisible(true)} 
          disabled={isDisabled}
        >
          <Text style={{ textAlign: 'center', fontSize: 15, color: isDisabled ? 'black' : 'white', fontWeight: 'bold', fontStyle: 'italic' }}>
            Observação
          </Text>
        </TouchableOpacity>
        <Modal
          isVisible={modalVisible}
          onBackdropPress={toggleModal}
          style={styles.modal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TextInput
                style={styles.input}
                placeholder="Observação"
                value={observacao}
                multiline={true}
                onChangeText={closeModal}
                placeholderTextColor="#888"
              />
              <TouchableOpacity 
                style={styles.iconButton} 
                onPress={saveModal} 
                disabled={disabled || isSending}
              >
                <Send size={24} color="#1E90FF" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ bottom: -10 }}>
            <Rodape />
          </View>
        </Modal>
      </View>
      <View style={{ width: '105%', position: 'absolute', bottom: 0, right: 0, marginEnd: 0, borderRadius: 30 }}>
        <Rodape />
      </View>
    </SafeAreaView>
  );
}