import { ReactNode } from 'react';
import { ViewStyle } from 'react-native';

export interface BottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  children: ReactNode;
  height?: number;
  showDragHandle?: boolean;
  containerStyle?: ViewStyle;
  title?: string;
  showHeader?: boolean;
  cancelText?: string;
  backgroundColor?: string;
}
export interface BottomSheetRef {
  dismiss: () => void;
}
