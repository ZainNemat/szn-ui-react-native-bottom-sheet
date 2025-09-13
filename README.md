# React Native Bottom Sheet

A smooth, customizable bottom sheet component for React Native with gesture support and TypeScript definitions.


![Bottom Sheet Demo](./demo.gif)


## Features

- 🎯 **TypeScript Support** - Full TypeScript definitions included
- 🎨 **Customizable** - Highly customizable appearance and behavior
- 📱 **Cross Platform** - Works on both iOS and Android
- ✋ **Gesture Support** - Smooth drag-to-dismiss functionality
- ⌨️ **Keyboard Aware** - Proper keyboard handling
- 🎭 **Flexible Content** - Support for any content with scroll view
- 🎪 **Animation** - Smooth enter/exit animations

## Installation

```bash
npm install szn-ui-react-native-bottom-sheet
```

### Peer Dependencies

This package requires the following peer dependencies:

```bash
npm install react-native-gesture-handler react-native-reanimated
```

Make sure to follow the installation instructions for:
- [react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler/docs/fundamentals/installation)
- [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started)

## Usage

```tsx
import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { BottomSheet } from '@yourname/react-native-bottom-sheet';

const App = (): JSX.Element => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Open Bottom Sheet" onPress={() => setIsVisible(true)} />
      
      <BottomSheet
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
      >
        <View style={{ padding: 20 }}>
          <Text>Hello from bottom sheet!</Text>
        </View>
      </BottomSheet>
    </View>
  );
};

export default App;
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isVisible` | `boolean` | - | Controls the visibility of the bottom sheet |
| `onClose` | `() => void` | - | Callback called when the sheet should be closed |
| `children` | `ReactNode` | - | Content to render inside the bottom sheet |
| `height` | `number` | `Screen height * 0.9` | Height of the bottom sheet |
| `showDragHandle` | `boolean` | `true` | Whether to show the drag handle |
| `containerStyle` | `ViewStyle` | - | Additional styles for the sheet container |
| `title` | `string` | - | Title text for the header |
| `showHeader` | `boolean` | `false` | Whether to show the header with title and cancel button |
| `cancelText` | `string` | `'Cancel'` | Text for the cancel button in header |

## Examples

### With Header

```tsx
<BottomSheet
  isVisible={isVisible}
  onClose={() => setIsVisible(false)}
  showHeader
  title="Settings"
  cancelText="Done"
>
  <View style={{ padding: 20 }}>
    <Text>Settings content here</Text>
  </View>
</BottomSheet>
```

### Custom Height

```tsx
<BottomSheet
  isVisible={isVisible}
  onClose={() => setIsVisible(false)}
  height={400}
>
  <View style={{ padding: 20 }}>
    <Text>Custom height content</Text>
  </View>
</BottomSheet>
```

### Custom Styling

```tsx
<BottomSheet
  isVisible={isVisible}
  onClose={() => setIsVisible(false)}
  containerStyle={{
    backgroundColor: '#f0f0f0',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  }}
>
  <View style={{ padding: 20 }}>
    <Text>Custom styled content</Text>
  </View>
</BottomSheet>
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.