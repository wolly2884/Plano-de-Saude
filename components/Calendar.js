import { useState, useEffect } from 'react';
import { Text, View, ScrollView } from 'react-native';
import moment from 'moment';
import 'moment/locale/pt-br';
import { LocaleConfig } from 'react-native-calendars';
import Date from './date'; // Componente visual para um dia
import { useTheme } from '../context/ThemeContext';
import { getStyles } from './Styles_calendar'; // Importa seu style com suporte a tema


// Configuração de localidade
LocaleConfig.locales['pt-br'] = {
  monthNames: [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ],
  monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  today: 'Hoje',
};
LocaleConfig.defaultLocale = 'pt-br';
moment.locale('pt-br');

const Calendar = ({ onSelectDate, selected }) => {
  const [dates, setDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(moment().format('MMMM'));
  const { theme } = useTheme();
  const styles = getStyles(theme);

  useEffect(() => {
    const _dates = Array.from({ length: 10 }, (_, i) => moment().add(i, 'days'));
    setDates(_dates);
  }, []);

  useEffect(() => {
    if (selected) {
      const month = moment(selected).format('MMMM');
      setCurrentMonth(month);
    }
  }, [selected]);

  return (
    <>
      <View style={styles.centered}>
        <Text style={styles.title}>{currentMonth}</Text>
      </View>
      <View style={styles.dateSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {dates.map((date, index) => (
            <Date
              key={index}
              date={date}
              onSelectDate={onSelectDate}
              selected={selected}
            />
          ))}
        </ScrollView>
      </View>
    </>
  );
};

export default Calendar;
