import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, Text, ActivityIndicator, View, StyleSheet } from 'react-native';
import { CalendarProvider, ExpandableCalendar, LocaleConfig } from 'react-native-calendars';
import Timeline from 'react-native-timeline-flatlist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../../../api/api';
import { useTheme } from '../../../../../context/ThemeContext';
import { getStyles } from './Styles';

LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  monthNamesShort: ['Jan.', 'Fev.', 'Mar.', 'Abr.', 'Mai.', 'Jun.', 'Jul.', 'Ago.', 'Set.', 'Out.', 'Nov.', 'Dez.'],
  dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  dayNamesShort: ['Dom.', 'Seg.', 'Ter.', 'Qua.', 'Qui.', 'Sex.', 'Sáb.'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';

const EVENT_COLOR = 'blue';
const getDate = (offset = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().split('T')[0];
};

const App = ({ navigation }) => {
  const currentDate = getDate();
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState({});
  const theme = useTheme();
  const styles = getStyles(theme);


  const fetchEventsForMonth = useCallback(async (year, month) => {

    try {
      const storedID = await AsyncStorage.getItem('ID');
      if (!storedID) {
        navigation.navigate('Logout');
        return;
      }
      const userAge   = await api.get(`/Beneficiario/get/${storedID}`);
      const cpfArray  = userAge.data.rows.map(item => `'${item.cd_cpf}'`);
      const userData  = await api.get(`/Agenda/find/${cpfArray}`);
      const dataesp   = await api.get('/Especialidade');
      const usermed   = await api.get('/Medicamento');  
  
      const newEvents = {};

      if (userData.data.rowCount > 0) {
        userData.data.rows.forEach(event => {
          const date          = event.dt_agendamento.substring(0, 10);
          const eventMonth    = new Date(date).getMonth() + 1;
          const eventYear     = new Date(date).getFullYear();
          const especialidade = dataesp.data.rows.find(esp => esp.cd_especialidade === event.cd_especialidade);
          const MatMed = usermed.data.rows.find(med =>
            (med.cd_medicamento || '').replace(/\s/g, '') === (event.cd_crm || '').replace(/\s/g, '')
          );

          let medName, crmmed; // Declare variables outside to avoid re-declaration

          if (['Medicamentos', 'Materiais', 'Taxas e Gases'].includes(event.ds_tipo_agendamento)) {
            medName = `${event.ds_tipo_agendamento}: ${MatMed?.ds_medicamento || 'Desconhecido'}`;
            crmmed = `Codigo: ${(event.cd_crm || '').replace(/\s/g, '')}`;
          } else {
            medName = `Médico: ${event.nm_medico || 'Desconhecido'}`;
            crmmed = `CRM: ${(event.cd_crm || '').replace(/\s/g, '')}`;
          }

          if (eventMonth === month && eventYear === year) {
            if (!newEvents[date]) newEvents[date] = [];
            newEvents[date].push({
              id: Math.random().toString(),
              time: event.hr_agendamento,
              title: event.ds_tipo_agendamento,
              nome: medName,
              esp: event.cd_especialidade,
              desp: especialidade ? especialidade.ds_especialidade : 'Desconhecida', // Fixed
              obs: event.ds_observacao,
              crm: crmmed,
            });
          }
        });
      }
      setEvents(newEvents);
    } catch (error) {
      console.error('Erro ao recuperar os dados:', error);
      setEvents({});
      setError('Falha ao carregar os eventos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [navigation]);


  useEffect(() => {
    const today = new Date();
    fetchEventsForMonth(today.getFullYear(), today.getMonth() + 1);
  }, [fetchEventsForMonth]);

  const onDateChanged = (date) => {
    setSelectedDate(date);
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const onMonthChange = (monthObj) => {
    fetchEventsForMonth(monthObj.year, monthObj.month);
  };

  const eventsForSelectedDate = events[selectedDate] || [];
  const formattedEvents = eventsForSelectedDate.map(event => ({
    time: event.time,
    title: event.title,
    description: event.obs,
    nome: event.nome, // Incluindo no formattedEvents
    esp: event.esp,
    desp: event.desp,
    crm: event.crm,
    circleColor: EVENT_COLOR,
    lineColor: EVENT_COLOR,
  }));

  const markedDates = Object.keys(events).reduce((acc, date) => {
    acc[date] = { marked: true, dotColor: EVENT_COLOR };
    return acc;
  }, {});

  // Função para renderizar o card personalizado
  const renderDetail = (rowData, sectionTitle, rowID) => {
    return (
      <View style={cardStyles.card}>
        <Text style={cardStyles.title}>{rowData.title}</Text>
        <Text style={cardStyles.detail}>{rowData.nome}</Text>
        <Text style={cardStyles.detail}>{rowData.crm}</Text>
        <Text style={cardStyles.detail}>Especialidade: {rowData.desp}</Text>
        {rowData.description ? (
          <Text style={cardStyles.detail}>Observação: {rowData.description}</Text>
        ) : null}
        <Text style={cardStyles.time}>Horário: {rowData.time}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <CalendarProvider
        date={currentDate}
        onDateChanged={onDateChanged}
        onMonthChange={onMonthChange}
        showTodayButton
        todayBottomMargin={38}
        disabledOpacity={0.6}
      >
        <ExpandableCalendar
          firstDay={1}
          markedDates={markedDates}
          onDayPress={(day) => setSelectedDate(day.dateString)}
        />
        <View style={styles.timelineContainer}>
          <Timeline
            data={formattedEvents}
            circleSize={20}
            lineColor='rgb(45,156,219)'
            timeStyle={{
              textAlign: 'center',
              backgroundColor: theme.buttonBackground,
              color: theme.isNightMode ? '#ffffff' : '#121212',
              padding: 5,
              borderRadius: 13,
            }}
            options={{ style: { paddingTop: 5 } }}
            innerCircle={'dot'}
            isUsingFlatlist={true}
            renderDetail={renderDetail} // Adicionando o renderDetail
            renderFooter={() => (loading ? <ActivityIndicator /> : <Text style={styles.ActivityIndicator}>~</Text>)}
          />
        </View>
      </CalendarProvider>
    </SafeAreaView>
  );
};

// Estilos para o card
const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#121212',
    marginBottom: 5,
  },
  detail: {
    fontSize: 14,
    color: '#555',
    marginBottom: 3,
  },
  time: {
    fontSize: 14,
    fontWeight: '600',
    color: '#121212',
    marginTop: 5,
  },
});

export default App;