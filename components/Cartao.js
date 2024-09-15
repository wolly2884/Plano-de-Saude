import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image, Animated } from 'react-native';
import { styles } from '../screens/Main/MainScreen/navigation/Styles';

const Screen = ({ items, index, navigation, xOffset, tamarray }) => {
  const SCREEN_WIDTH = 401;
  
    const transitionAnimation = {
      transform: [
        { perspective: 800 },
        {
            scale: xOffset.interpolate({
              inputRange: [(index - 10) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 10) * SCREEN_WIDTH],
              outputRange: [0.25, 1, 0.25],
            }),
          },
          {
            rotateX: xOffset.interpolate({
              inputRange: [(index - 10) * SCREEN_WIDTH, (index ) * SCREEN_WIDTH, (index + 20) * SCREEN_WIDTH],
              outputRange: ["-120deg", "0deg", "120deg"],
            }),
          },
          {
            rotateY: xOffset.interpolate({
              inputRange: [(index - 1) * SCREEN_WIDTH , (index  ) * SCREEN_WIDTH, (index + 10) * SCREEN_WIDTH],
              outputRange: ["-120deg", "0deg", "120deg"],
            }),
          },
   
      ],
    };

  return (
    <View style={[styles.scrollPage, { left: index === tamarray -1 && tamarray > 1 ? 12 : 19 + (index * 5), width: SCREEN_WIDTH, top: 10  }]}>
      <Animated.View style={[styles.screen, transitionAnimation]}>
        <SafeAreaView style={{ backgroundColor: 'red', borderTopStartRadius: 10, borderTopEndRadius: 10, width: '97%' }}>
          <View style={{ flexDirection: 'row' }}>
            <Image source={require('../assets/src/pessoa.png')} style={styles.image} />
            <SafeAreaView style={styles.userInfo}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.TextoCard}>Olá,</Text>
                <Text style={styles.TextoBenef}>{items.nm_beneficiario}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.TextoCard}>CNS :</Text>
                <Text style={styles.TextoBenef}>{items.cd_cns}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.TextoCard}>Matrícula :</Text>
                <Text style={styles.TextoBenef}>{items.cd_cardnumber}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.TextoCard}>Plano :</Text>
                <Text style={styles.TextoBenef}>{items.ds_healthplan}</Text>
              </View>
            </SafeAreaView>
          </View>

          <SafeAreaView style={styles.buttonsContainer}>
            <TouchableOpacity style={[styles.button1, { flexDirection: 'row' }]} onPress={() => navigation.navigate('Carterinha Virtual', {items})}>
              <Image source={require('../assets/cartao.png')} style={{ width: 22, height: 18, justifyContent: 'space-evenly', right: 5 }} />
              <Text style={styles.buttonText}>Carterinha Virtual</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button2, { flexDirection: 'row' }]} onPress={() => navigation.navigate('Gerar Token', {items})}>
              <Image source={require('../assets/qrcode.png')} style={{ width: 22, height: 18, justifyContent: 'space-evenly', right: 5 }} />
              <Text style={styles.buttonText}>Gerar Token</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
};

export default Screen;
