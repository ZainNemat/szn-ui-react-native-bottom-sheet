import React, { JSX, ReactNode, useEffect } from 'react';
import {
  View,
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Text,
  TouchableOpacity,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { BottomSheetProps } from "./types";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export const BottomSheet = ({
  isVisible,
  onClose,
  children,
  height = SCREEN_HEIGHT * 0.9,
  showDragHandle = true,
  containerStyle,
  title,
  openAtHeight,
  showHeader = false,
  cancelText = "Cancel",
  backgroundColor,
}: BottomSheetProps): JSX.Element | null => {
  const translateY = useSharedValue(height);
  const backdropOpacity = useSharedValue(0);
  const finalOpenAtHeight = openAtHeight ?? SCREEN_HEIGHT * 0.1;
  const DISMISS_THRESHOLD = 150;

  useEffect(() => {
    if (isVisible) {
      translateY.value = withTiming(finalOpenAtHeight, { duration: 300 });
      backdropOpacity.value = withTiming(1, { duration: 300 });
    } else {
      translateY.value = withTiming(height, { duration: 250 });
      backdropOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [isVisible, height, finalOpenAtHeight]);

  const startY = useSharedValue(0);

  const dismissWithAnimation = (): void => {
    translateY.value = withTiming(height, { duration: 250 });
    backdropOpacity.value = withTiming(0, { duration: 200 }, () => {
      scheduleOnRN(onClose);
    });
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      "worklet";
      startY.value = translateY.value;
    })
    .onUpdate((event) => {
      "worklet";
      const newTranslateY = startY.value + event.translationY;
      if (newTranslateY > 0) {
        translateY.value = newTranslateY;
      }
    })
    .onEnd(() => {
      "worklet";
      if (translateY.value > finalOpenAtHeight + DISMISS_THRESHOLD) {
        translateY.value = withTiming(height, { duration: 250 });
        backdropOpacity.value = withTiming(0, { duration: 200 }, (finished) => {
          "worklet";
          if (finished) {
            scheduleOnRN(onClose);
          }
        });
      } else {
        translateY.value = withTiming(finalOpenAtHeight, { duration: 250 });
      }
    });

  const sheetStyle = useAnimatedStyle(() => {
    "worklet";
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const backdropStyle = useAnimatedStyle(() => {
    "worklet";
    return {
      opacity: backdropOpacity.value,
    };
  });

  if (!isVisible) return null;

  const handleDismiss = (): void => {
    dismissWithAnimation();
  };
  return (
    <Modal
      visible
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleDismiss}
    >
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={handleDismiss}>
          <Animated.View style={[styles.backdrop, backdropStyle]} />
        </TouchableWithoutFeedback>
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              styles.sheet,
              { height },
              containerStyle,
              {
                backgroundColor:
                  backgroundColor ?? containerStyle?.backgroundColor ?? "white",
              },
              sheetStyle,
            ]}
          >
            {showDragHandle && (
              <View style={styles.dragHandleContainer}>
                <View style={styles.dragHandle} />
              </View>
            )}

            {showHeader && (
              <View style={styles.header}>
                <TouchableOpacity onPress={handleDismiss}>
                  <Text style={styles.cancelText}>{cancelText}</Text>
                </TouchableOpacity>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.headerSpacer} />
              </View>
            )}
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              style={styles.keyboardView}
            >
              <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {children}
              </ScrollView>
            </KeyboardAvoidingView>
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    minHeight: 32,
  },
  dragHandle: {
    width: 48,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f3f4f6',
  },
  cancelText: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  headerSpacer: {
    width: 50,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});