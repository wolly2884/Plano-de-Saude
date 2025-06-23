import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DatePickerModal } from 'react-native-paper-dates';
import { useTheme } from '../context/ThemeContext';
import DynamicSelectModal from './DynamicSelectModal';

// Tradução do date-picker para português
import { pt, registerTranslation } from 'react-native-paper-dates';
registerTranslation('pt', pt);

// Utilitário: Formatar data (dd/mm/yyyy)
export const formatDate = (date) => {
  const d = date && typeof date === 'object' && 'date' in date ? date.date : date;
  if (!(d instanceof Date) || isNaN(d.getTime())) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

// Utilitário: Converter string para Date
export const parseDate = (dateString) => {
  if (typeof dateString !== 'string') return new Date();
  const [day, month, year] = dateString.split('/').map(Number);
  const d = new Date(year, month - 1, day);
  return isNaN(d.getTime()) ? new Date() : d;
};

const InputTexto = ({
  // texto / valor
  text = 'Texto',
  value = '',
  onChange = () => {},
  onBlur = () => {},
  onLong = () => {},
  funcao = () => {},

  // comportamento
  keyboard = 'default',
  editable = true,
  maxLength = 255,
  multiline = false,
  numberOfLines = 5,

  // modos especiais
  isDatePicker = false,
  isSelect = false,
  selectOptions = [],
  selectTitle = 'Selecione',
  istrue = false,

  // ícone
  icon = 'calendar',
  redicon = false,

  // estilo
  style = {},
}) => {
  const { theme } = useTheme();
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [selectModalVisible, setSelectModalVisible] = useState(false);
  const [internal, setInternal] = useState(value); // valor interno

  // Atualiza valor interno quando valor externo muda
  useEffect(() => {
    setInternal(value);
  }, [value]);

  const openDatePicker = () => setDatePickerVisible(true);
  const openSelectModal = () => setSelectModalVisible(true);

  const handleIconPress = () => {
    if (isDatePicker) openDatePicker();
    else if (isSelect) openSelectModal();
    else onLong();
  };

  const commonInputProps = {
    placeholder: `Entre com ${text}`,
    value: internal,
    onChangeText: (isDatePicker || isSelect) ? () => {} : funcao ,
    onBlur,
    secureTextEntry: istrue,
    keyboardType: (isDatePicker || isSelect) ? 'numeric' : keyboard,
    editable: !isDatePicker && !isSelect && editable,
    maxLength,
    multiline,
    numberOfLines: multiline ? numberOfLines : 1,
    mode: 'outlined',
    label: text,
    textColor: theme.textColor,
    underlineColor: 'transparent',
    activeOutlineColor: theme.textColor,
    outlineColor: theme.textColor,
    style: [{ backgroundColor: 'transparent' }, style],
    theme: {
      colors: {
        text: theme.textColor,
        placeholder: theme.textColor,
        primary: theme.textColor,
      },
    },
    left: (
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
    ),
  };

  return (
    <View style={{ marginBottom: 15 }}>
      {(isDatePicker || isSelect) ? (
        <TouchableOpacity onPress={handleIconPress}>
          <TextInput
            {...commonInputProps}
            editable={false}
            pointerEvents="none"
          />
        </TouchableOpacity>
      ) : (
        <TextInput {...commonInputProps} />
      )}

      {/* Seletor de data */}
      {isDatePicker && (
        <DatePickerModal
          locale="pt"
          mode="single"
          visible={datePickerVisible}
          onDismiss={() => setDatePickerVisible(false)}
          date={internal ? parseDate(internal) : undefined}
          onConfirm={({ date }) => {
            const formatted = formatDate({ date });
            setInternal(formatted);
            onChange(formatted);
            setDatePickerVisible(false);
          }}
          validRange={{
            startDate: new Date(1900, 0, 1),
            endDate: new Date(),
          }}
        />
      )}

      {/* Modal de seleção de opções */}
      {isSelect && (
        <DynamicSelectModal
          title={selectTitle}
          visible={selectModalVisible}
          onClose={() => setSelectModalVisible(false)}
          options={selectOptions}
          selectedValue={internal}
          onSelect={(item) => {
            setInternal(item.value);
            onChange(item.value);
            setSelectModalVisible(false);
          }}
        />
      )}
    </View>
  );
};

export default InputTexto;
