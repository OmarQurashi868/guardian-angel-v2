import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { requestAllPermissions } from '@/services/permissions';

export const unstable_settings = {
	anchor: '(tabs)',
};

export default function RootLayout() {
	// ===== Hooks =====
	const colorScheme = useColorScheme();

	// ===== Effects - Request Permissions on App Launch =====
	useEffect(() => {
		console.log('[App] Initializing permissions...');
		requestAllPermissions().then((status) => {
			console.log('[App] Permission status:', status);
		});
	}, []);

	// ===== Render =====
	return (
		<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
			<Stack>
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
				<Stack.Screen name="ward" options={{ headerShown: false }} />
				<Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
			</Stack>
			<StatusBar style="auto" />
		</ThemeProvider>
	);
}
