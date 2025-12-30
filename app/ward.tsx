import { StyleSheet, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ============================================================================
// Constants
// ============================================================================

const WARM_RED = '#D04A3F';

// ============================================================================
// Components
// ============================================================================

function BroadcastingWidget() {
	// ===== Hooks =====
	const insets = useSafeAreaInsets();

	return (
		<View style={[styles.broadcastingWidget, { paddingTop: insets.top + 16 }]}>
			<Text style={styles.broadcastingText}>Broadcasting</Text>
		</View>
	);
}

function ConnectedGuardiansList() {
	const colorScheme = useColorScheme();
	const guardians: string[] = []; // Placeholder for guardian names

	// ===== Derived State =====
	const backgroundColor = colorScheme === 'dark' ? Colors.dark.background : Colors.light.background;
	const borderColor = colorScheme === 'dark' ? '#2A2A2A' : '#E0E0E0';

	return (
		<ThemedView style={styles.guardiansContainer}>
			<ThemedText type="subtitle" style={styles.guardiansHeader}>
				Connected guardians
			</ThemedText>
			<View
				style={[
					styles.guardiansList,
					{
						backgroundColor,
						borderColor,
					},
				]}>
				{guardians.length === 0 ? (
					<ThemedText style={styles.emptyText}>No guardians connected</ThemedText>
				) : (
					guardians.map((guardian, index) => (
						<View
							key={`guardian-${index}`}
							style={[
								styles.guardianItem,
								{ borderBottomColor: borderColor },
								index === guardians.length - 1 && styles.guardianItemLast,
							]}>
							<ThemedText>{guardian}</ThemedText>
						</View>
					))
				)}
			</View>
		</ThemedView>
	);
}

export default function WardScreen() {
	const router = useRouter();

	// ===== Render =====
	return (
		<ThemedView style={styles.container}>
			<BroadcastingWidget />
			<ConnectedGuardiansList />
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	broadcastingWidget: {
		backgroundColor: WARM_RED,
		paddingVertical: 16,
		paddingHorizontal: 20,
		alignItems: 'center',
		justifyContent: 'center',
	},
	broadcastingText: {
		color: '#FFFFFF',
		fontSize: 20,
		fontWeight: 'bold',
		textTransform: 'uppercase',
	},
	guardiansContainer: {
		padding: 16,
	},
	guardiansHeader: {
		marginBottom: 12,
	},
	guardiansList: {
		borderWidth: 1,
		borderRadius: 8,
		padding: 12,
	},
	guardianItem: {
		paddingVertical: 12,
		borderBottomWidth: 1,
	},
	guardianItemLast: {
		borderBottomWidth: 0,
	},
	emptyText: {
		textAlign: 'center',
		paddingVertical: 24,
		opacity: 0.6,
	},
});

