import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, Text, ActivityIndicator, View } from 'react-native';
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

      const userAge = await api.get(`/Beneficiario/get/${storedID}`);
      const cpfArray = userAge.data.rows.map(item => `'${item.cd_cpf}'`);
      const userData = await api.get(`/Agenda/find/${cpfArray}`);
      const newEvents = {};

      if (userData.data.rowCount > 0) {
        userData.data.rows.forEach(event => {
          const date = event.dt_agendamento.substring(0, 10);
          const eventMonth = new Date(date).getMonth() + 1;
          const eventYear = new Date(date).getFullYear();

          if (eventMonth === month && eventYear === year) {
            if (!newEvents[date]) newEvents[date] = [];
            newEvents[date].push({
              id: Math.random().toString(),
              time: event.hr_agendamento,
              title: event.ds_tipo_agendamento,
              nome: ['Medicamentos', 'Materiais', 'Taxas e Gases'].includes(event.ds_tipo_agendamento)
                ? event.ds_medicamento
                : event.nm_medico,
              crm: ['Medicamentos', 'Materiais', 'Taxas e Gases'].includes(event.ds_tipo_agendamento)
                ? event.cd_medicamento
                : event.cd_crm,
              esp: event.cd_especialidade,
              desp: event.ds_especialidade,
              obs: event.ds_observacao
            });
          }
        });
      }
      setEvents(newEvents);
    } catch (error) {
      console.error('Erro ao recuperar os dados:', error);
      setEvents({});
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
    circleColor: EVENT_COLOR,
    lineColor: EVENT_COLOR
  }));

  const markedDates = Object.keys(events).reduce((acc, date) => {
    acc[date] = { marked: true, dotColor: EVENT_COLOR };
    return acc;
  }, {});

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
              color: theme.isNightMode ?  '#ffffff' : '#121212',
              padding: 5,
              borderRadius: 13
            }}
            options={{ style: { paddingTop: 5 } }}
            innerCircle={'dot'}
            isUsingFlatlist={true}
            renderFooter={() => loading ? <ActivityIndicator /> : <Text style={styles.ActivityIndicator}>~</Text>}
          />
        </View>
      </CalendarProvider>
    </SafeAreaView>
  );
};

export default App;
