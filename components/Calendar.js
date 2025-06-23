import { useState, useEffect } from 'react';
import { Text, View, ScrollView } from 'react-native';
import moment from 'moment';
import './calendarLocale'; 
import Date from './date';
import { useTheme } from '../context/ThemeContext';
import { getStyles } from './Styles_calendar';

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
