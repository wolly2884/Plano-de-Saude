import React, { useState, useEffect } from 'react';
import { View, Animated } from 'react-native';
import Screen from './Cartao';

const App = ({items, navigation}) => {
  const [xOffset] = useState(new Animated.Value(0));
  const itemLength = items.length;
  return (
    <Animated.ScrollView
      scrollEventThrottle={16}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { x: xOffset } } }],
        { useNativeDriver: false }
      )}
      horizontal
      pagingEnabled
      style={{ flex: 1, top: 100 }}
    >
      {items.map((item, index) => (
        <View key={index} style={{ flex: 1 }}>
          <Screen items={item} index={index} xOffset={xOffset} navigation={navigation} tamarray={itemLength}/>
        </View>
      ))}
    </Animated.ScrollView>
  );
};

export default App;
