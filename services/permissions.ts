// ============================================================================
// Permission Service
// ============================================================================

import { Platform, PermissionsAndroid } from 'react-native';

// ============================================================================
// Types
// ============================================================================

export interface PermissionStatus {
	notifications: boolean;
	microphone: boolean;
}

// ============================================================================
// Functions
// ============================================================================

export async function requestNotificationPermission(): Promise<boolean> {
	try {
		console.log('[Permissions] Requesting notification permission...');

		// For Android, notifications are typically granted by default
		// For iOS, we need expo-notifications which requires native code
		if (Platform.OS === 'android') {
			console.log('[Permissions] Android notifications are granted by default');
			return true;
		}

		// Try to use expo-notifications for iOS, but handle gracefully if it fails
		try {
			const Notifications = await import('expo-notifications');
			const { status: existingStatus } = await Notifications.getPermissionsAsync();

			if (existingStatus === 'granted') {
				console.log('[Permissions] Notification permission already granted');
				return true;
			}

			const { status } = await Notifications.requestPermissionsAsync();
			const granted = status === 'granted';
			console.log(`[Permissions] Notification permission ${granted ? 'granted' : 'denied'}`);
			return granted;
		} catch (nativeError) {
			console.warn(
				'[Permissions] expo-notifications not available (requires native build). Skipping notification permission request.',
			);
			return false;
		}
	} catch (error) {
		console.error('[Permissions] Error requesting notification permission:', error);
		return false;
	}
}

export async function requestMicrophonePermission(): Promise<boolean> {
	try {
		console.log('[Permissions] Requesting microphone permission...');

		// Use React Native's PermissionsAndroid for Android (works in Expo Go)
		if (Platform.OS === 'android') {
			try {
				const granted = await PermissionsAndroid.request(
					PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
					{
						title: 'Microphone Permission',
						message: 'This app needs access to your microphone to enable voice streaming.',
						buttonNeutral: 'Ask Me Later',
						buttonNegative: 'Cancel',
						buttonPositive: 'OK',
					},
				);
				const isGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
				console.log(
					`[Permissions] Microphone permission ${isGranted ? 'granted' : 'denied'}`,
				);
				return isGranted;
			} catch (androidError) {
				console.error('[Permissions] Error requesting Android microphone permission:', androidError);
				return false;
			}
		}

		// For iOS, try expo-av but handle gracefully if it fails
		try {
			const Audio = await import('expo-av');
			const { status: existingStatus } = await Audio.Recording.getPermissionsAsync();

			if (existingStatus === 'granted') {
				console.log('[Permissions] Microphone permission already granted');
				return true;
			}

			const { status } = await Audio.Recording.requestPermissionsAsync();
			const granted = status === 'granted';
			console.log(`[Permissions] Microphone permission ${granted ? 'granted' : 'denied'}`);
			return granted;
		} catch (nativeError) {
			console.warn(
				'[Permissions] expo-av not available (requires native build). Skipping microphone permission request.',
			);
			return false;
		}
	} catch (error) {
		console.error('[Permissions] Error requesting microphone permission:', error);
		return false;
	}
}

export async function requestAllPermissions(): Promise<PermissionStatus> {
	console.log('[Permissions] Requesting all permissions...');
	const [notifications, microphone] = await Promise.all([
		requestNotificationPermission(),
		requestMicrophonePermission(),
	]);

	return {
		notifications,
		microphone,
	};
}

export async function checkAllPermissions(): Promise<PermissionStatus> {
	console.log('[Permissions] Checking all permissions...');

	// Check notifications
	let notificationsGranted = false;
	if (Platform.OS === 'android') {
		notificationsGranted = true; // Android grants notifications by default
	} else {
		try {
			const Notifications = await import('expo-notifications');
			const { status } = await Notifications.getPermissionsAsync();
			notificationsGranted = status === 'granted';
		} catch (error) {
			console.warn('[Permissions] Could not check notification permission:', error);
		}
	}

	// Check microphone
	let microphoneGranted = false;
	if (Platform.OS === 'android') {
		try {
			const granted = await PermissionsAndroid.check(
				PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
			);
			microphoneGranted = granted;
		} catch (error) {
			console.warn('[Permissions] Could not check Android microphone permission:', error);
		}
	} else {
		try {
			const Audio = await import('expo-av');
			const { status } = await Audio.Recording.getPermissionsAsync();
			microphoneGranted = status === 'granted';
		} catch (error) {
			console.warn('[Permissions] Could not check microphone permission:', error);
		}
	}

	return {
		notifications: notificationsGranted,
		microphone: microphoneGranted,
	};
}

