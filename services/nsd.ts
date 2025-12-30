// ============================================================================
// NSD Service - Network Service Discovery Broadcasting
// ============================================================================

import { Platform } from 'react-native';

// ============================================================================
// Types
// ============================================================================

export interface NSDServiceInfo {
	name: string;
	type: string;
	port: number;
}

// ============================================================================
// State
// ============================================================================

let isBroadcasting = false;
let serviceInfo: NSDServiceInfo | null = null;

// ============================================================================
// Functions
// ============================================================================

export async function getDeviceName(): Promise<string> {
	try {
		// Use a simple device identifier - expo-device requires native code
		// For now, use a generic name that can be customized later
		// In a production app, you'd want to use a custom native module or
		// store a user-defined device name
		const deviceName = Platform.OS === 'android' ? 'Android Device' : 'iOS Device';
		console.log('[NSD] Device name:', deviceName);
		return deviceName;
	} catch (error) {
		console.error('[NSD] Error getting device name:', error);
		return Platform.OS === 'android' ? 'Android Device' : 'iOS Device';
	}
}

export async function startBroadcasting(port: number = 8888): Promise<boolean> {
	try {
		if (isBroadcasting) {
			console.log('[NSD] Already broadcasting');
			return true;
		}

		console.log('[NSD] Init - Starting NSD broadcast...');
		const deviceName = await getDeviceName();

		// For Android, NSD requires native module
		// This is a placeholder - will need custom native module for full implementation
		if (Platform.OS === 'android') {
			console.log('[NSD] Stream Start - Broadcasting as:', deviceName);
			console.log('[NSD] Service Type: _guardian-angel._tcp');
			console.log('[NSD] Port:', port);

			// TODO: Implement native NSD broadcasting
			// This requires a custom native module using Android's NsdManager
			// For now, we log the intent and mark as broadcasting
			isBroadcasting = true;
			serviceInfo = {
				name: deviceName,
				type: '_guardian-angel._tcp',
				port,
			};

			console.log('[NSD] Buffer - Service registered:', serviceInfo);
			return true;
		}

		console.warn('[NSD] NSD not supported on this platform');
		return false;
	} catch (error) {
		console.error('[NSD] Error starting broadcast:', error);
		isBroadcasting = false;
		return false;
	}
}

export function stopBroadcasting(): void {
	try {
		if (!isBroadcasting) {
			console.log('[NSD] Not broadcasting');
			return;
		}

		console.log('[NSD] Stopping broadcast...');
		isBroadcasting = false;
		serviceInfo = null;
		console.log('[NSD] Broadcast stopped');
	} catch (error) {
		console.error('[NSD] Error stopping broadcast:', error);
	}
}

export function isCurrentlyBroadcasting(): boolean {
	return isBroadcasting;
}

export function getServiceInfo(): NSDServiceInfo | null {
	return serviceInfo;
}

