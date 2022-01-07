
# Implementing a sticky banner with Animations in React Native

React Native brings React’s declarative UI framework to iOS and Android. With React Native, you use native UI controls and have full access to the native platform. (https://github.com/facebook/react-native)

Animations is an important part of React Native to provide a great user experience as [https://reactnative.dev/docs/animations](https://reactnative.dev/docs/animations) said. But actually, apart from the normal animation, Animations in React Native also allow us to implement some fascinating visual effects. We will implement a stick banner with Animations in this article.

## Setting up the development environment

First, we need to set up the development environment according to the official document ([Setting up the development environment](https://reactnative.dev/docs/environment-setup)), there are two ways to create a new project, with Expo or with React Native CLI. We would use React Native CLI in the tutorial.

Because we need Xcode to make the App run on iOS devices, I would follow the instructions on MacOS. I won’t mention too many details about how to install the dependencies because it is quite clear in the above official document.

After all dependencies are installed, let’s create a new project with React Native CLI (React Native Command Line Interface) by running the following command in a terminal

    npx react-native init StickyBanner --template react-native-template-typescript

It might take several minutes to install all of the dependencies. Be careful we have a parameter —-template react-native-template-typescript in the command. It means we are creating a project with a TypeScript template.

And you would find a new folder, StickyBanner has been created in the current working directory, which is the whole React Native project.

Then we need to open a terminal and go into the StickyBanner folder to install the node packages by running yarn install or npm install according to which package manager is installed. I would use yarn as an example in this article, but using npm should be the same. Be careful about the version compatibility issue.

And then go into the StickyBanner/ios folder and run the pod install to install the pods for the iOS app.

After all of the dependencies are installed, we can go back to StickyBanner folder and run yarn run ios to launch the app.

Then we would notice the React Native Metro server is running in a separate terminal and the app is running on an iOS simulator like

![](https://cdn-images-1.medium.com/max/2000/1*sotiKRVct56nQ9txcc5bGQ.gif)

Now we have created a new React Native project, although it is empty. We will add some components to it in the next chapter.

## Implement a sticky banner with React Native Animations

We can open the project with some IDE, such as VS Code or IntelliJ IDEA. I would use IntelliJ IDEA in this article.

And then let’s open the project with IntelliJ and open App.tsx, which is the main source file of this project. We will see the following code

    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={backgroundStyle}>
      <Header />
      <View
        style={{
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
        }}>
        <Section title="Step One">
          Edit <Text style={styles.highlight}>App.tsx</Text> to change this
          screen and then come back to see your edits.
        </Section>
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
    </ScrollView>

This is the major part the app, which is a ScrollView, and several customised components, called Section, inside the ScrollView. In this article, we will show how to make one Section stikcy.

### Change the ScrollView to Animated.ScrollView

The first step we need to do is to change the ScrollView to Animated.ScrollView, so we can make the sticky banner animated smoothly.

Then we also need to handle the onScroll event of the Animated.ScrollView with an Animated.event. In the handler, we need to save the Y offset of this ScrollView, then we can calculate the Y offset of the banner.

Next step is to add a new component, the banner, wrapped with Animated.View, and also set the the transform style with an interpolation function as followed.

    const screenHeight: number = Dimensions.get('window').height;
    const scrollY = useRef(new Animated.Value(0)).current;
    const topSpace = 300;
    const translateY = scrollY.interpolate({
      inputRange: [0, topSpace, topSpace + 1, topSpace + 1 + screenHeight],
      outputRange: [0, 0, 0, screenHeight],
    });
    
    return (
      <SafeAreaView style={backgroundStyle}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <Animated.ScrollView
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollY}}}],
            {
              useNativeDriver: true,
            },
          )}
          contentInsetAdjustmentBehavior="automatic"
          style={backgroundStyle}>
          <Header />
          <View
            style={{
              backgroundColor: isDarkMode ? Colors.black : Colors.white,
            }}>
            <Section title="Step One">
              Edit <Text style={styles.highlight}>App.tsx</Text> to change this
              screen and then come back to see your edits.
            </Section>
            <Animated.View style={{...styles.banner, transform: [{translateY}]}}>
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

And also add a new style for this banner as followed, but the style itself is not important.

    const styles = StyleSheet.*create*({
      ......
      banner: {
        backgroundColor: 'tomato',
        marginTop: 10,
        marginBottom: 12,
        zIndex: 1,
      },
    });

In this piece of code, we are using a local variable, scrollY to store the Y offset of the ScrollView, which value would be updated in the onScroll event.

And we need to set transform: [{translateY}] as part of the style of this Animated.View wrapper because we would calculate the Y position of it according to the Y offset of the ScrollView in function translateY with interploation. Briefly speaking, it is a multi-section linear interpolation for generating output according to the input value.

The details of the interpolation can be found at [https://reactnative.dev/docs/animated#interpolate](https://reactnative.dev/docs/animated#interpolate).

In our interpolation, we are mapping the input value, that is the Y offset of the ScrollView, from 0 to topSpace, which is set to 300 temporarily and we will update is later, to 0. That means we own’t change the relative position of the Animated.View. And we would map the input value greater than topSpace to the input value minus topSpace, which means we would increase the Y position of the Animated.View according to the increament of the Y offset of the ScrollView with same gradient. So the banner would look to be stucked on the screen like the following screenshot.

![](https://cdn-images-1.medium.com/max/2000/1*R0_hfyl-WefDTVvmxP9-hg.gif)

Now we have implemented a sticky banner with React Native Animation. With this approach, we can update the Y position of any component to make it be displayed at any position on the screen along with the scrolling.

Now we still have some hardcoded value, 300, in our code. That is not nice, let us optimise it in the next chapter.

### Calculate the topSpace at run-time

We would listen onLayout event to get the Y position of the components at run-time. So we need to add two variables to keep the Y position of the container and the banner itself, and also update the calculation of the topSpace as followed.

    const yView = useRef(0);
    const yBanner = useRef(0);
    const topSpace = yView.current + yBanner.current;

And add onLayout props to the container view and the banner like this

    <View
      onLayout={(event: any) => {
        yView.current = event.nativeEvent.layout.y;
      }}
      style={{
        backgroundColor: isDarkMode ? Colors.black : Colors.white,
      }}>
      <Section title="Step One">
        Edit <Text style={styles.highlight}>App.tsx</Text> to change this
        screen and then come back to see your edits.
      </Section>
      <Animated.View
        style={{...styles.banner, transform: [{translateY}]}}
        onLayout={(event: any) => {
          yBanner.current = event.nativeEvent.layout.y;
        }}>
        <Section title="Sticky Banner" />
      </Animated.View>
    ......

And update the signature of Section to

    const Section: React.FC<{
      title: string;
      onLayout?: ((event: LayoutChangeEvent) => void) | undefined;
    }> = ({children, title, onLayout}) => {
      const isDarkMode = useColorScheme() === 'dark';
      return (
        <View style={styles.sectionContainer} onLayout={onLayout}>
    ......

Then we would see the banner would scroll up along with the ScrollView, but stick on the top when it hits the top of screen.

![](https://cdn-images-1.medium.com/max/2000/1*kCf1EL8Y4jv1A6LYsKuTSA.gif)

But if we check the document of the Animation ([https://reactnative.dev/docs/transforms](https://reactnative.dev/docs/transforms)), we will find we can only change decomposedMatrix, rotation, scaleX, scaleY, transformMatrix, translateX, translateY with this approach. What should we do if we want to change other styles like margin? That is not easy and official, but we might have a workaround in the next chapter.

### Modify other styles

In this chapter, we will try to set the banner with different horizontal margin when it hits to the top of the screen.

The first step is to add a new state like

    const [sticky, setSticky] = useState(false);

And update the state in the onScroll event handler as

    <Animated.ScrollView
      onScroll={Animated.event(
        [{nativeEvent: {contentOffset: {y: scrollY}}}],
        {
          useNativeDriver: true,
          listener: (event:NativeSyntheticEvent<NativeScrollEvent>) => {
            setSticky(event.nativeEvent.contentOffset.y >= topSpace);
          },
        },
      )}

And set the horizontal margin as part of the style of the Animated.View as

    <Animated.View
      style={{
        ...styles.banner,
        transform: [{translateY}],
        marginHorizontal: sticky ? 0 : 16,
      }}

So, we can modify the margin by adding customized listener in the onScroll event handler.

There might be better way to do that instead of using state. Any suggestion are welcome.

So the final version would be like

![](https://cdn-images-1.medium.com/max/2000/1*WJV9Vs5K5L_-In4KAS-HpA.gif)

### Other interesting ideas

Actually, the Animated.ScrollView is just a wrapped ScrollView with AnimatedComponent as

    export const ScrollView: AnimatedComponent<typeof _ScrollView>;

So when we are writing the unit test with JEST / enzyme, we get access the original wrapped component with some find() like the following example

    ......
    <Animated.ScrollView
      onScroll={Animated.event(
        [{nativeEvent: {contentOffset: {y: scrollY}}}],
        {
          useNativeDriver: true,
          listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
            setSticky(event.nativeEvent.contentOffset.y >= topSpace);
            // do something special
          },
        },
      )}
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={
        <RefreshControl refreshing={true} onRefresh={async () => {}} />
      }
      style={backgroundStyle}>
    ......

as we see, we have a props refreshControl and we can shallow render the whole compnent with this props in unit test like

    const wrapper = shallow(<App />);
    
    const refreshControl = wrapper
      .find(Animated.ScrollView)
      .dive()
      .dive()
      .dive()
      .dive()
      .find(RefreshControl);
    expect(refreshControl.props().refreshing).toEqual(true);

This approach should be also applicable for other Animated components.

Ok. That all for this article about how to implement a sticky banner with Aninmations. Any comments are welcome.
