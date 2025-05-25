import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, ScrollView, Text, ActivityIndicator, View } from 'react-native';
import { CalendarProvider, ExpandableCalendar, LocaleConfig } from 'react-native-calendars';
import Timeline from 'react-native-timeline-flatlist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../../../api/api';
import { getStyles } from './Styles';
import dateUtils from '../../../../../api/functions';
import { useTheme } from '../../../../../context/ThemeContext';

LocaleConfig.locales['pt-br'] = {
  monthNames: dateUtils.getMonth(),
  monthNamesShort: dateUtils.getMonthName(),
  dayNames: dateUtils.getdayNames(),
  dayNamesShort: dateUtils.getdayNamesShort(),
  today: 'Hoje',
};
LocaleConfig.defaultLocale = 'pt-br';

const App = ({ navigation }) => {
  const { theme, isNightMode } = useTheme();
  const styles = getStyles(theme);

  const EVENT_COLOR = isNightMode ? theme.tabBarActiveTextColor : theme.tabBarActiveTextColor;
  const currentDate = dateUtils.getFormattedDate();
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState({});
  const [error, setError] = useState(null);

  const fetchEventsForMonth = useCallback(
    async (year, month) => {
      setLoading(true);
      setError(null);
      try {
        const storedID = await AsyncStorage.getItem('ID');
        if (!storedID) {
          navigation.navigate('Logout');
          return;
        }

        const userAge = await api.get(`/Beneficiario/get/${storedID}`);
        const cpfArray = userAge.data.rows.map((item) => `'${item.cd_cpf}'`);
        const userData = await api.get(`/Agenda/find/${cpfArray}`);
        const newEvents = {};

        const daysInMonth = new Date(year, month, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
          const date = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
          newEvents[date] = [];
        }

        if (userData.data.rowCount > 0) {
          userData.data.rows.forEach((event) => {
            const date = event.dt_agendamento.substring(0, 10);
            if (new Date(date).getMonth() + 1 === month && new Date(date).getFullYear() === year) {
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
                obs: event.ds_observacao,
              });
            }
          });
        }
        setEvents((prev) => ({ ...prev, ...newEvents }));
      } catch (error) {
        console.error('Erro ao recuperar os dados:', error);
        setError('Não foi possível carregar os eventos. Tente novamente.');
      } finally {
        setLoading(false);
      }
    },
    [navigation]
  );

  useEffect(() => {
    const today = new Date();
    fetchEventsForMonth(today.getFullYear(), today.getMonth() + 1);
  }, [fetchEventsForMonth]);

  const onDateChanged = (date) => {
    setSelectedDate(date);
  };

  const onMonthChange = (monthObj) => {
    fetchEventsForMonth(monthObj.year, monthObj.month);
  };

  const eventsForSelectedDate = events[selectedDate] || [];
  const formattedEvents = eventsForSelectedDate.map((event) => ({
    time: event.time,
    title: `${event.title} - ${event.nome}`,
    description: `${event.desp ? `Especialidade: ${event.desp}` : ''}${event.obs ? `\nObs: ${event.obs}` : ''}`,
    circleColor: styles.timelineCircleColor.backgroundColor,
    lineColor: styles.timelineLineColor.backgroundColor,
  }));

  const markedDates = Object.keys(events).reduce((acc, date) => {
    const hasEvents = events[date].length > 0;
    acc[date] = {
      ...(hasEvents && { marked: true, dotColor: styles.calendarDotColor.backgroundColor }),
      ...(date === selectedDate && {
        selected: true,
        selectedColor: styles.calendarSelectedColor.backgroundColor,
      }),
    };
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
          theme={{
            backgroundColor: styles.calendarBackground.backgroundColor,
            calendarBackground: styles.calendarBackground.backgroundColor,
            textSectionTitleColor: styles.calendarText.color,
            selectedDayBackgroundColor: styles.calendarSelectedColor.backgroundColor,
            selectedDayTextColor: theme.buttonTextColor,
            todayTextColor: styles.calendarSelectedColor.backgroundColor,
            dayTextColor: styles.calendarText.color,
            textDisabledColor: isNightMode ? '#666666' : '#cccccc',
            dotColor: styles.calendarDotColor.backgroundColor,
            selectedDotColor: theme.buttonTextColor,
            arrowColor: styles.calendarText.color,
            monthTextColor: styles.calendarText.color,
            textDayFontWeight: '400',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '500',
          }}
        />
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={styles.calendarSelectedColor.backgroundColor}
            />
          </View>
        ) : error ? (
          <View style={styles.emptyDate}>
            <Text style={styles.emptyText}>{error}</Text>
          </View>
        ) : eventsForSelectedDate.length === 0 ? (
          <View style={styles.emptyDate}>
            <Text style={styles.emptyText}>Nenhum evento para esta data</Text>
          </View>
        ) : (
          <ScrollView style={styles.timelineContainer}>
            <Timeline
              data={formattedEvents}
              circleSize={20}
              circleColor={styles.timelineCircleColor.backgroundColor}
              lineColor={styles.timelineLineColor.backgroundColor}
              timeStyle={styles.timelineTimeStyle}
              timeContainerStyle={{ minWidth: 52 }}
              descriptionStyle={{ color: styles.calendarText.color }}
              titleStyle={{ color: styles.calendarText.color }}
              options={{ style: { paddingTop: 5 } }}
              innerCircle="dot"
              isUsingFlatlist={true}
            />
          </ScrollView>
        )}
      </CalendarProvider>
    </SafeAreaView>
  );
};

export default App;