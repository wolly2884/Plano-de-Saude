import React, { useState, useEffect } from 'react';
import {
  Text, SafeAreaView, View, Image,
  TouchableOpacity, Alert, Linking, TextInput,
} from 'react-native';
import moment from 'moment';
import Calendar from '../../../../../components/Calendar';
import Rodape from '../../../../../components/Rodape';
import * as MailComposer from 'expo-mail-composer';
import api from '../../../../../api/api';
import Modal from 'react-native-modal';
import { Send } from 'lucide-react-native';
import { getStyles } from './Styles_agenda';
import { useTheme } from '../../../../../context/ThemeContext';
import { FontAwesome } from '@expo/vector-icons';
import 'moment/locale/pt-br';

const horariosDisponiveis = [
  '07:00','08:00','09:00','10:00',
  '11:00','12:00','13:00','14:00',
  '15:00','16:00','17:00','18:00',
  '19:00','20:00','21:00','22:00',
];

function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size)
    chunks.push(arr.slice(i, i + size));
  return chunks;
}

const Horarios = ({ hora, selected, disabled, onSelect }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const img = selected
    ? require('../../../../../assets/src/relogiol.png')
    : require('../../../../../assets/src/relogio.png');

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
          opacity: disabled ? 0.5 : 1,
        }
      ]}>
        <Image source={img} style={styles.horatioimage} />
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
  const { ben, med, esp, ate } = route.params;
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [selectedHorario, setSelectedHorario] = useState(null);
  const [bookedHorarios, setBookedHorarios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [observacao, setObservacao] = useState('');
  const [disabledObs, setDisabledObs] = useState(true);

  const image = med.sexo === 'M'
    ? require('../../../../../assets/src/medico.png')
    : require('../../../../../assets/src/medica.png');

  useEffect(() => {
    const fetchBookedHorarios = async () => {
      try {
        const resp = await api.get('/Agenda', {
          params: {
            dt_agendamento: selectedDate,
            cd_crm: med.crm,
            cd_especialidade: esp.esp,
          }
        });

        const rows = Array.isArray(resp.data.rows) ? resp.data.rows : [];

        setBookedHorarios(rows.map(r => r.hr_agendamento + r.dt_agendamento.substring(0, 10) + (r.cd_crm || '').replace(/\s/g, '') ));
        setSelectedHorario(null); // Limpa seleção ao trocar data
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar horários.');
        setBookedHorarios([]);
        setSelectedHorario(null);
      }
    };

    fetchBookedHorarios();
  }, [selectedDate]);

  const handleHorarioSelect = hora => {
    if (bookedHorarios.includes(hora + selectedDate + med.crm)) {
      Alert.alert('Horário ocupado', 'Este horário já está reservado para o dia selecionado. Por favor, escolha outro horário.');
      return;
    }
    setSelectedHorario(hora);
  };

  const Gravar = async () => {
    if (!selectedDate || !selectedHorario) {
      Alert.alert('Atenção', 'Por favor, selecione uma data e um horário.');
      return;
    }
    if (bookedHorarios.includes(selectedHorario + selectedDate)) {
      Alert.alert('Erro', 'Horário já agendado.');
      return;
    }

    try {
      await api.post('/Agenda', [{
        nm_medico: med.value,
        cd_crm: med.crm,
        cd_especialidade: esp.esp,
        ds_tipo_agendamento: ate.value,
        dt_agendamento: selectedDate,
        hr_agendamento: selectedHorario,
        cd_cpf_beneficiaro: ben.cd_cpf,
        ds_observacao: observacao.trim()
      }]);
      Alert.alert('Sucesso', 'Agendamento realizado!', [
        { text: 'OK', onPress: () => navigation.navigate('Agendamento') }
      ]);
    } catch {
      Alert.alert('Erro', 'Falha ao agendar. Tente novamente.');
    }
  };

  const openWhatsApp = () => {
    const url = `whatsapp://send?text=${encodeURIComponent(
      `Olá! ${med.value}\nTitular: ${ben.value}\nDigite aqui sua mensagem:`)}&phone=+5513981375296`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Instale o WhatsApp para entrar em contato.')
    );
  };

  const sendEmail = async () => {
    await MailComposer.composeAsync({
      recipients: [med.email || 'Anderson.tome@fatec.sp.gov.br'],
      subject: `Contato via app - ${ben.value}`,
      body: `
          Nome Médico: ${med.value}
          Titular: ${ben.value}
          Mensagem:
      `,
      isHtml: false
    });
  };

  const callPhoneNumber = phone =>
    Linking.openURL(`tel:${phone}`).catch(() =>
      console.error('Erro ao abrir discador')
    );

  const toggleModal = () => setModalVisible(v => !v);
  const saveModal = () => setModalVisible(false);
  const onObsChange = text => {
    setObservacao(text);
    setDisabledObs(text.trim() === '');
  };

  const isDisabled = !selectedDate || !selectedHorario;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <SafeAreaView style={styles.container}>
        {/* HEADER */}
        <View style={[styles.headerContainer, {shadowColor: theme.shadowColor}]}>
          <Image source={image} style={styles.headerImage} />
          <Text style={styles.headerText}>Olá, {ben.value}, tudo bem!</Text>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>Eu sou {med.sexo === 'M' ? 'o' : 'a'} {med.Nome}</Text>
            <Text style={styles.headerText}>{esp.value}</Text>
            <Text style={styles.headerText}>CRM: {med.crm}</Text>
          </View>
          <View style={styles.buttonHeader}>
            <TouchableOpacity onPress={() => callPhoneNumber('+5513981375296')}>
              <FontAwesome name="mobile-phone" size={30} color={theme.inputTextColor} />
            </TouchableOpacity>
            <TouchableOpacity onPress={openWhatsApp}>
              <FontAwesome name="whatsapp" size={30} color={theme.inputTextColor} />
            </TouchableOpacity>
            <TouchableOpacity onPress={sendEmail}>
              <FontAwesome name="envelope-square" size={30} color={theme.inputTextColor} />
            </TouchableOpacity>
          </View>
        </View>

        {/* BODY */}
        <View style={styles.calendarContainer}>
          <Calendar onSelectDate={setSelectedDate} selected={selectedDate} />

          <Text style={styles.titleText}>Horários</Text>
          {chunkArray(horariosDisponiveis, 4).map((linha, i) => (
            <View key={i} style={styles.horariosRow}>
              {linha.map(hora => (
                <Horarios
                  key={hora}
                  hora={hora}
                  selected={selectedHorario === hora}
                  disabled={bookedHorarios.includes(hora + selectedDate + med.crm)}
                  onSelect={() => handleHorarioSelect(hora)}
                />
              ))}
            </View>
          ))}

          <TouchableOpacity
            style={[styles.btnActionag, isDisabled ? styles.btnDisabled : styles.btnEnabled]}
            onPress={Gravar}
            disabled={isDisabled}
          >
            <Text style={styles.btnText}>Agende Agora sua Consulta</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnAction, isDisabled ? styles.btnDisabled : styles.btnEnabledObs]}
            onPress={toggleModal}
            disabled={isDisabled}
          >
            <Text style={styles.btnText}>Observação</Text>
          </TouchableOpacity>
        </View>

        {/* OBS MODAL */}
        <Modal isVisible={modalVisible} onBackdropPress={toggleModal} style={styles.centeredModal}>
          <View style={styles.modalContainer}>
            <Text style={styles.btnText}>
              Você pode adicionar uma observação para o médico, como alergias, medicamentos em uso ou outras informações relevantes.
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Observação"
              placeholderTextColor="#888"
              value={observacao}
              multiline
              maxLength={200}
              onChangeText={onObsChange}
            />
            <TouchableOpacity onPress={saveModal} disabled={disabledObs}>
              <Send size={24} color={disabledObs ? '#aaa' : '#1E90FF'} />
            </TouchableOpacity>
          </View>
        </Modal>
      </SafeAreaView>

      <Rodape />
    </SafeAreaView>
  );
}
