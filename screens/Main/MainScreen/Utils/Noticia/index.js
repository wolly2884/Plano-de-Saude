import React from 'react';
import {View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { Noticias } from '../../../../../components/Noticia'
import {getstyles} from './Styles'
import { useTheme } from '../../../../../context/ThemeContext';
import Rodape  from '../../../../../components/Rodape'

const App = () => {
    const { theme, isThemeLoaded } = useTheme();
  const styles = getstyles(theme);

  const renderNoticias = ({ item }) => (
      <TouchableOpacity style={styles.NoticiasContainer} onPress={() => {}}>
        <Image source={{ uri: item.Imagem }} style={styles.Noticiasimagem} />
        <Text style={styles.Noticiastitulo}>{item.Titulo}</Text>
        <Text style={styles.Noticiashistoria}>{item.Historia}</Text>
      </TouchableOpacity>
  );
  
  return (
    <View style={{flex: 1}} >
      <View style={styles.Noticiascontainer} >
        <FlatList
            data={Noticias}
            renderItem={renderNoticias}
          />
      </View>
      <Rodape />
    </View>
  );
};

export default App;