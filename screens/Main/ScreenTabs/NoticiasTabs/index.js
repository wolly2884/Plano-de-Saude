// src/screens/ScreenTabs/NoticiasTabs/index.js
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { Noticias } from '../../../../components/Noticia';
import { getStyles } from './styles';

const NoticiasTabs = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const renderNoticias = ({ item }) => (
    <TouchableOpacity
      style={styles.NoticiasContainer}
      onPress={() => {}}
      accessibilityLabel={`Notícia: ${item.Titulo}`}
    >
      {item.Imagem ? (
        <Image
          source={{ uri: item.Imagem }}
          style={styles.Noticiasimagem}
          resizeMode="cover"
        />
      ) : (
        <Text style={styles.errorText}>Imagem não disponível</Text>
      )}
      <Text style={styles.Noticiastitulo}>{item.Titulo}</Text>
      <Text style={styles.Noticiashistoria}>{item.Historia}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.Noticiascontainer}>
      <FlatList
        data={Noticias}
        renderItem={renderNoticias}
        keyExtractor={(item) => item.id?.toString() || item.Titulo}
      />
    </View>
  );
};

export default NoticiasTabs;