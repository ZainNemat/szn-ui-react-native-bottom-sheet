import { ReactNode } from 'react';
import { ViewStyle } from 'react-native';

export interface BottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  children: ReactNode;
  height?: number;
  openAtHeight?: number;
  showDragHandle?: boolean;
  containerStyle?: ViewStyle;
  title?: string;
  showHeader?: boolean;
  cancelText?: string;
  sheetBackgroundColor?: string;
}
