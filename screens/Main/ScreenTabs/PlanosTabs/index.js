// src/screens/ScreenTabs/PlanosTabs/index.js
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { items } from '../../../../components/produto';
import { getStyles } from './styles';

const PlanosTabs = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const renderPlano = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.productId}
        accessibilityLabel={`Plano ${item.description}`}
      >
        {item.image ? (
          <Image
            source={item.image}
            style={styles.planImage}
            resizeMode="contain"
          />
        ) : (
          <Text style={styles.errorText}>Imagem não disponível</Text>
        )}
        <View style={styles.textContainer}>
          <Text style={styles.descricao}>{item.description}</Text>
          <Text style={styles.versao}>{item.version}</Text>
          <Text style={styles.caracteristica}>{item.information}</Text>
          <View style={styles.botaofake}>
            <Text style={styles.botaofakeText}>Conheça o {item.description}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderPlano}
        keyExtractor={(item) => item.productId.toString()}
      />
    </View>
  );
};

export default PlanosTabs;