import React from 'react';
import {
  Modal,
  TouchableOpacity,
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getStyles } from './DynamicSelectModalStyles';

const DynamicSelectModal = ({
  visible,
  onClose,
  options = [],
  selectedValue,
  onSelect,
  title = 'Selecione',
}) => {
  const renderItem = ({ item }) => {
    const isSelected = item.value === selectedValue;
    return (
      <Pressable
        style={({ pressed }) => [
          styles.row,
          isSelected && styles.rowSelected,
          pressed && styles.rowPressed,
        ]}
        onPress={() => {
          onSelect(item);
          onClose();
        }}
      >
        <Text style={[styles.rowText, isSelected && styles.rowTextSelected]}>
          {item.label}
        </Text>
      </Pressable>
    );
  };
    const { theme } = useTheme();
    const styles = getStyles(theme);

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <FlatList
            data={options}
            keyExtractor={(item) => item.key.toString()}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default DynamicSelectModal;
