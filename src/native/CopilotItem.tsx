import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import {
  Animated,
  View,
  Text,
  Image,
  useWindowDimensions,
  type LayoutChangeEvent,
  TouchableOpacity,
} from 'react-native';
import { useCopilotManger } from '../CopilotManger';
import { assets } from '../assets/index';

const ANIMATION_DURATION = 300;

interface CopilotItemProps extends PropsWithChildren {
  title?: string;
  canSkip?: boolean;
}

export const CopilotItem = ({
  title,
  canSkip = true,
  children,
}: CopilotItemProps) => {
  const {
    target,
    targetLayout,
    prevStep,
    nextStep,
    onFinish,
    currentStepIndex,
    totalSteps,
  } = useCopilotManger();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [tipLayout, setTipLayout] = useState({ height: 0, width: 0 });
  const [shouldRender, setShouldRender] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (target) {
      setShouldRender(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setShouldRender(false);
        }
      });
    }
  }, [target]);

  const contentOpacity = !tipLayout.height || !tipLayout.width ? 0 : 1;
  const circleWidth = 8;
  const lineWidth = 2;
  const lineHeight = 50;
  const contentWidth = 264;

  const isExceedingBottom =
    targetLayout.y + targetLayout.height + tipLayout.height + lineHeight >
    windowHeight;

  const getTipLayout = useCallback((event: LayoutChangeEvent) => {
    setTipLayout({
      height: event.nativeEvent.layout.height,
      width: event.nativeEvent.layout.width,
    });
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        width: windowWidth,
        height: windowHeight,
        backgroundColor: '#00000066',
        opacity: fadeAnim,
      }}
    >
      {shouldRender && (
        <>
          <View
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              zIndex: 1,
            }}
          >
            <View
              style={{
                position: 'absolute',
                top: targetLayout.y,
                left: targetLayout.x,
                width: targetLayout.width,
                height: targetLayout.height,
                pointerEvents: 'none',
              }}
            >
              {target}
            </View>

            {/* 圓點 */}
            <View
              style={{
                position: 'absolute',
                opacity: contentOpacity,
                height: circleWidth,
                width: circleWidth,
                borderRadius: 10,
                backgroundColor: 'white',
                left: targetLayout.x + targetLayout.width / 2 - circleWidth / 2,
                top: !isExceedingBottom
                  ? targetLayout.y + targetLayout.height + 10
                  : targetLayout.y - circleWidth - 10,
              }}
            />

            {/* 連接線 */}
            <View
              style={{
                position: 'absolute',
                opacity: contentOpacity,
                height: lineHeight,
                width: lineWidth,
                backgroundColor: 'white',
                left: targetLayout.x + targetLayout.width / 2 - lineWidth / 2,
                top: !isExceedingBottom
                  ? targetLayout.y + targetLayout.height + 10
                  : targetLayout.y - lineHeight - 10,
              }}
            />

            {/* 內容框 */}
            <View
              onLayout={getTipLayout}
              style={{
                opacity: contentOpacity,
                position: 'absolute',
                left:
                  targetLayout.x > windowWidth / 2
                    ? windowWidth - tipLayout.width - 16
                    : (windowWidth - tipLayout.width) / 2,
                top: !isExceedingBottom
                  ? targetLayout.y + targetLayout.height + lineHeight
                  : targetLayout.y - tipLayout.height - lineHeight,
                padding: 16,
                borderRadius: 8,
                width: contentWidth,
                justifyContent: 'center',
                backgroundColor: 'white',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.1,
                elevation: 5,
              }}
            >
              <View style={{ gap: 8 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    gap: 8,
                  }}
                >
                  <Text style={{ flex: 1, fontSize: 18, fontWeight: 600 }}>
                    {title}
                  </Text>
                  {canSkip && (
                    <TouchableOpacity onPress={() => onFinish()}>
                      <Image
                        style={{ height: 18, width: 18 }}
                        source={assets.icColorClose}
                      />
                    </TouchableOpacity>
                  )}
                </View>
                <View>{children}</View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                  }}
                >
                  <Text>
                    {currentStepIndex} / {totalSteps}
                  </Text>
                  <TouchableOpacity onPress={prevStep}>
                    <View
                      style={{
                        borderWidth: 1,
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 10,
                      }}
                    >
                      <Text>上一步</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={nextStep}>
                    <View
                      style={{
                        borderWidth: 1,
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 10,
                      }}
                    >
                      <Text>下一步</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </>
      )}
    </Animated.View>
  );
};
