import React, {
  JSX,
  useEffect,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from "react";
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
  StyleSheet,
  PanResponder,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { BottomSheetProps, BottomSheetRef } from "./types";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export const BottomSheetComponent = forwardRef<
  BottomSheetRef,
  BottomSheetProps
>(
  (
    {
      isVisible,
      onClose,
      children,
      height = SCREEN_HEIGHT * 0.9,
      showDragHandle = true,
      containerStyle,
      title,
      showHeader = false,
      cancelText = "Cancel",
      backgroundColor,
    }: BottomSheetProps,
    ref
  ): JSX.Element | null => {
    const translateY = useSharedValue(height);
    const backdropOpacity = useSharedValue(0);
    const DISMISS_THRESHOLD = 150;

    const dismissWithAnimation = (): void => {
      translateY.value = withTiming(height, { duration: 250 });
      backdropOpacity.value = withTiming(0, { duration: 200 }, () => {
        scheduleOnRN(onClose);
      });
    };

    useImperativeHandle(ref, () => ({
      dismiss: dismissWithAnimation,
    }));

    useEffect(() => {
      if (isVisible) {
        translateY.value = withTiming(0, { duration: 300 });
        backdropOpacity.value = withTiming(1, { duration: 300 });
      } else {
        translateY.value = withTiming(height, { duration: 250 });
        backdropOpacity.value = withTiming(0, { duration: 200 });
      }
    }, [isVisible, height]);

    const panResponder = useMemo(() => {
      let startY = 0;

      return PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dy) > 5,
        onPanResponderGrant: () => {
          startY = translateY.value;
        },
        onPanResponderMove: (_, gestureState) => {
          const newY = startY + gestureState.dy;
          const clampedY = Math.max(0, Math.min(newY, height));
          translateY.value = clampedY;
        },
        onPanResponderRelease: () => {
          if (translateY.value > DISMISS_THRESHOLD) {
            dismissWithAnimation();
          } else {
            translateY.value = withSpring(0, {
              damping: 15,
              stiffness: 150,
            });
          }
        },
      });
    }, [translateY, height, onClose]);

    const sheetStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: translateY.value }],
    }));

    const backdropStyle = useAnimatedStyle(() => ({
      opacity: backdropOpacity.value,
    }));

    if (!isVisible) return null;

    return (
      <Modal
        visible
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={dismissWithAnimation}
      >
        <View style={styles.container}>
          <TouchableWithoutFeedback onPress={dismissWithAnimation}>
            <Animated.View style={[styles.backdrop, backdropStyle]} />
          </TouchableWithoutFeedback>

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
              <View
                {...panResponder.panHandlers}
                style={styles.dragHandleContainer}
              >
                <View style={styles.dragHandle} />
              </View>
            )}

            {showHeader && (
              <View style={styles.header}>
                <TouchableOpacity onPress={dismissWithAnimation}>
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
        </View>
      </Modal>
    );
  }
);
export const BottomSheet = BottomSheetComponent;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  dragHandleContainer: {
    alignItems: "center",
    paddingVertical: 8,
    minHeight: 32,
  },
  dragHandle: {
    width: 48,
    height: 4,
    backgroundColor: "#d1d5db",
    borderRadius: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#f3f4f6",
  },
  cancelText: {
    color: "#3b82f6",
    fontSize: 16,
    fontWeight: "500",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
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
