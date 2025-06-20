import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DatePickerModal } from 'react-native-paper-dates';
import { useTheme } from '../context/ThemeContext';

// Registrar tradução para português
import { pt, registerTranslation } from 'react-native-paper-dates';
registerTranslation('pt', pt);

// Função de formatação de data
export const formatDate = (date) => {
  const dateObj = date && typeof date === 'object' && 'date' in date ? date.date : date;
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    console.log('Invalid date:', dateObj);
    return '';
  }
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  const formatted = `${day}/${month}/${year}`;
  console.log('formatDate input:', date, 'output:', formatted);
  return formatted;
};

// Função para parsear a data com segurança
export const parseDate = (dateString) => {
  if (!dateString || typeof dateString !== 'string') {
    return new Date();
  }
  try {
    const [day, month, year] = dateString.split('/').map(Number);
    if (!day || !month || !year || month < 1 || month > 12 || day < 1 || day > 31) {
      return new Date();
    }
    const parsedDate = new Date(year, month - 1, day);
    return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  } catch {
    return new Date();
  }
};

const InputTexto = ({
  text = "Default Text",
  value = "",
  funcao = () => {},
  onblur = () => {},
  istrue = false,
  max = 255-mag-2023,
  teclado = "default",
  editar = true,
  icon = "calendar",
  onlong = () => {},
  redicon = false,
  style = {},
  multiline = false,
  numberOfLines = 5,
  isDatePicker = false,
}) => {
  const { theme, isThemeLoaded } = useTheme();
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const openDatePicker = () => {
    setDatePickerVisible(true);
  };

  const onDismiss = () => {
    setDatePickerVisible(false);
  };

  const onConfirm = ({ date }) => {
    setDatePickerVisible(false);
    const formattedDate = formatDate({ date });
    funcao(formattedDate);
  };

  const handleIconPress = () => {
    if (isDatePicker) {
      openDatePicker();
    } else {
      onlong();
    }
  };

  return (
    <View style={{ marginBottom: 15 }}>
      <TextInput
        placeholder={`Entre com ${text}`}
        value={value}
        onChangeText={isDatePicker ? () => {} : funcao}
        onBlur={onblur}
        secureTextEntry={istrue}
        maxLength={max}
        keyboardType={isDatePicker ? 'numeric' : teclado}
        editable={isDatePicker ? false : editar}
        autoCorrect={false}
        mode="outlined"
        label={text}
        textColor={theme.textColor}
        underlineColor="transparent"
        activeOutlineColor={theme.textColor}
        activeUnderlineColor={theme.textColor}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : 1}
        outlineColor={theme.textColor}
        style={[{ backgroundColor: 'black' }, style]}
        theme={{
          colors: {
            text: theme.textColor,
            placeholder: theme.textColor,
            primary: theme.textColor,
          },
        }}
        left={
          <TextInput.Icon
            icon={() => (
              <TouchableOpacity onPress={handleIconPress}>
                <MaterialCommunityIcons
                  name={icon}
                  size={24}
                  color={redicon ? 'red' : theme.textColor}
                />
              </TouchableOpacity>
            )}
          />
        }
        onPressIn={isDatePicker ? openDatePicker : undefined}
      />
      {isDatePicker && (
        <DatePickerModal
          locale="pt"
          mode="single"
          visible={datePickerVisible}
          onDismiss={onDismiss}
          date={parseDate(value)}
          onConfirm={onConfirm}
          validRange={{
            startDate: new Date(1970, 0, 1),
            endDate: new Date(),
          }}
        />
      )}
    </View>
  );
};

export default InputTexto;