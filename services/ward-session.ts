// ============================================================================
// Ward Session Service - Coordinates NSD and Microphone
// ============================================================================

import { startBroadcasting, stopBroadcasting } from './nsd';
import { startMicrophoneStream, stopMicrophoneStream } from './microphone';
import { requestMicrophonePermission } from './permissions';

// ============================================================================
// Types
// ============================================================================

export interface WardSessionStatus {
	isActive: boolean;
	isBroadcasting: boolean;
	isStreaming: boolean;
}

// ============================================================================
// State
// ============================================================================

let sessionActive = false;

// ============================================================================
// Functions
// ============================================================================

export async function startWardSession(port: number = 8888): Promise<boolean> {
	try {
		if (sessionActive) {
			console.log('[WardSession] Session already active');
			return true;
		}

		console.log('[WardSession] Init - Starting ward session...');

		// Request microphone permission first
		const hasPermission = await requestMicrophonePermission();
		if (!hasPermission) {
			console.error('[WardSession] Error - Microphone permission denied');
			return false;
		}

		// Start NSD broadcasting
		const nsdStarted = await startBroadcasting(port);
		if (!nsdStarted) {
			console.warn('[WardSession] Warning - NSD broadcast failed, continuing anyway');
		}

		// Start microphone stream
		// Note: expo-av requires native code, so this will fail in Expo Go
		// It will work once you build a custom development client
		const micStarted = await startMicrophoneStream({
			sampleRate: 16000, // Low sample rate for Android 6 and low latency
			numberOfChannels: 1, // Mono for lower bandwidth
			bitRate: 64000, // Lower bitrate for stability
		}).catch((error) => {
			console.warn('[WardSession] Microphone stream not available (requires native build):', error);
			return false;
		});

		if (!micStarted) {
			console.warn('[WardSession] Warning - Microphone stream unavailable, continuing without audio');
			// Don't fail the entire session - NSD broadcasting can still work
			// In production, you'd want microphone, but for now we'll continue
		}

		sessionActive = true;
		console.log('[WardSession] Stream Start - Ward session active');
		return true;
	} catch (error) {
		console.error('[WardSession] Error starting session:', error);
		await stopWardSession();
		return false;
	}
}

export async function stopWardSession(): Promise<void> {
	try {
		if (!sessionActive) {
			console.log('[WardSession] Session not active');
			return;
		}

		console.log('[WardSession] Stopping session...');
		sessionActive = false;

		await Promise.all([stopBroadcasting(), stopMicrophoneStream()]);

		console.log('[WardSession] Session stopped');
	} catch (error) {
		console.error('[WardSession] Error stopping session:', error);
		sessionActive = false;
	}
}

export function isSessionActive(): boolean {
	return sessionActive;
}

export function getSessionStatus(): WardSessionStatus {
	return {
		isActive: sessionActive,
		isBroadcasting: false, // Will be updated when NSD is fully implemented
		isStreaming: false, // Will be updated when microphone is fully implemented
	};
}

