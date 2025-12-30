// ============================================================================
// Microphone Streaming Service
// ============================================================================

import { Platform } from 'react-native';

// ============================================================================
// Types
// ============================================================================

export interface MicrophoneStreamConfig {
	sampleRate?: number;
	numberOfChannels?: number;
	bitRate?: number;
	linearPCMBitDepth?: number;
	linearPCMBigEndian?: boolean;
}

// ============================================================================
// State
// ============================================================================

let recording: any = null;
let isStreaming = false;

// ============================================================================
// Functions
// ============================================================================

export async function startMicrophoneStream(
	config: MicrophoneStreamConfig = {},
): Promise<boolean> {
	try {
		if (isStreaming) {
			console.log('[Microphone] Already streaming');
			return true;
		}

		console.log('[Microphone] Init - Starting microphone stream...');

		// Dynamic import to avoid bundling issues
		// Note: expo-av requires native code and won't work in Expo Go
		let Audio;
		try {
			Audio = await import('expo-av');
		} catch (importError) {
			console.error('[Microphone] Error - expo-av not available (requires native build)');
			throw new Error('expo-av requires native code. Please build a custom development client.');
		}

		// Configure audio mode for call-like behavior (loudspeaker mode)
		// setAudioModeAsync is at the top level of the Audio module
		if (Audio.setAudioModeAsync) {
			await Audio.setAudioModeAsync({
				allowsRecordingIOS: true,
				playsInSilentModeIOS: true,
				staysActiveInBackground: true,
				shouldDuckAndroid: false,
				playThroughEarpieceAndroid: false, // Use loudspeaker
			});
		} else if (Audio.Audio && Audio.Audio.setAudioModeAsync) {
			// Try alternative structure
			await Audio.Audio.setAudioModeAsync({
				allowsRecordingIOS: true,
				playsInSilentModeIOS: true,
				staysActiveInBackground: true,
				shouldDuckAndroid: false,
				playThroughEarpieceAndroid: false,
			});
		} else {
			console.warn('[Microphone] setAudioModeAsync not available, skipping audio mode configuration');
		}

		console.log('[Microphone] Buffer - Audio mode configured');

		// Access Recording API - handle different import structures
		// expo-av exports Recording as a named export or nested
		let Recording;
		if (Audio.Recording) {
			Recording = Audio.Recording;
		} else if (Audio.default && Audio.default.Recording) {
			Recording = Audio.default.Recording;
		} else if (Audio.Audio && Audio.Audio.Recording) {
			Recording = Audio.Audio.Recording;
		} else {
			// expo-av requires native code - this is expected in Expo Go
			console.warn('[Microphone] Recording API not available - expo-av requires native build');
			console.log('[Microphone] To enable microphone streaming, build a custom development client');
			return false;
		}

		// Request permissions
		const { status } = await Recording.getPermissionsAsync();
		if (status !== 'granted') {
			console.error('[Microphone] Error - Microphone permission not granted');
			return false;
		}

		// Configure recording options for low-latency streaming
		// Lower sample rate for Android 6 compatibility and lower latency
		const recordingOptions: any = {
			android: {
				extension: '.m4a',
				outputFormat: Audio.AndroidOutputFormat?.MPEG_4 || 2,
				audioEncoder: Audio.AndroidAudioEncoder?.AAC || 3,
				sampleRate: config.sampleRate || 16000, // Lower sample rate for latency
				numberOfChannels: config.numberOfChannels || 1,
				bitRate: config.bitRate || 64000,
			},
			ios: {
				extension: '.m4a',
				outputFormat: Audio.IOSOutputFormat?.MPEG4AAC || 0,
				audioQuality: Audio.IOSAudioQuality?.LOW || 127,
				sampleRate: config.sampleRate || 16000,
				numberOfChannels: config.numberOfChannels || 1,
				bitRate: config.bitRate || 64000,
				linearPCMBitDepth: config.linearPCMBitDepth || 16,
				linearPCMBigEndian: config.linearPCMBigEndian || false,
			},
			web: {
				mimeType: 'audio/webm',
				bitsPerSecond: config.bitRate || 64000,
			},
		};

		console.log('[Microphone] Buffer - Recording options configured:', recordingOptions);

		// Create and start recording
		const { recording: newRecording } = await Recording.createAsync(recordingOptions);
		recording = newRecording;
		isStreaming = true;

		console.log('[Microphone] Stream Start - Recording started');
		console.log('[Microphone] Status:', await recording.getStatusAsync());

		return true;
	} catch (error) {
		console.error('[Microphone] Error starting stream:', error);
		isStreaming = false;
		recording = null;
		return false;
	}
}

export async function stopMicrophoneStream(): Promise<void> {
	try {
		if (!isStreaming || !recording) {
			console.log('[Microphone] Not streaming');
			return;
		}

		console.log('[Microphone] Stopping stream...');
		await recording.stopAndUnloadAsync();
		recording = null;
		isStreaming = false;

		// Reset audio mode
		try {
			const Audio = await import('expo-av');
			if (Audio.setAudioModeAsync) {
				await Audio.setAudioModeAsync({
					allowsRecordingIOS: false,
					playsInSilentModeIOS: false,
				});
			} else if (Audio.Audio && Audio.Audio.setAudioModeAsync) {
				await Audio.Audio.setAudioModeAsync({
					allowsRecordingIOS: false,
					playsInSilentModeIOS: false,
				});
			}
		} catch (error) {
			// Ignore errors when resetting audio mode
			console.warn('[Microphone] Could not reset audio mode:', error);
		}

		console.log('[Microphone] Stream stopped');
	} catch (error) {
		console.error('[Microphone] Error stopping stream:', error);
		isStreaming = false;
		recording = null;
	}
}

export function isCurrentlyStreaming(): boolean {
	return isStreaming;
}

export async function getStreamStatus(): Promise<any> {
	try {
		if (!recording) {
			return null;
		}
		return await recording.getStatusAsync();
	} catch (error) {
		console.error('[Microphone] Error getting status:', error);
		return null;
	}
}

