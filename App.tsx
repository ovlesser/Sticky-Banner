/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  LayoutChangeEvent,
  NativeScrollEvent, NativeSyntheticEvent, RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const Section: React.FC<{
  title: string;
  onLayout?: ((event: LayoutChangeEvent) => void) | undefined;
}> = ({children, title, onLayout}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer} onLayout={onLayout}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const screenHeight: number = Dimensions.get('window').height;
  const scrollY = useRef(new Animated.Value(0)).current;
  const yView = useRef(0);
  const yBanner = useRef(0);
  const topSpace = yView.current + yBanner.current;
  const translateY = scrollY.interpolate({
    inputRange: [0, topSpace, topSpace + 1, topSpace + 1 + screenHeight],
    outputRange: [0, 0, 0, screenHeight],
  });
  const [sticky, setSticky] = useState(false);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Animated.ScrollView
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {
            useNativeDriver: true,
            listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
              setSticky(event.nativeEvent.contentOffset.y >= topSpace);
            },
          },
        )}
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={
          <RefreshControl refreshing={true} onRefresh={async () => {}} />
        }
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}
          onLayout={(event: any) => {
            yView.current = event.nativeEvent.layout.y;
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Animated.View
            style={{
              ...styles.banner,
              transform: [{translateY}],
              marginHorizontal: sticky ? 0 : 16,
            }}
            onLayout={(event: any) => {
              yBanner.current = event.nativeEvent.layout.y;
            }}>
            <Section title="Sticky Banner" />
          </Animated.View>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  banner: {
    backgroundColor: 'tomato',
    marginTop: 10,
    marginBottom: 12,
    zIndex: 1,
  },
});

export default App;
