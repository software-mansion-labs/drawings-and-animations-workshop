import { ReactNode } from 'react';
import { SafeAreaView } from 'react-native';

export function CenterScreen({ children }: { children: ReactNode }) {
  return (
    <SafeAreaView
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: 'white',
      }}>
      {children}
    </SafeAreaView>
  );
}
