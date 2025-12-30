import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

// ============================================================================
// Constants
// ============================================================================

const WARM_BLUE = '#5A9BC4';
const WARM_RED = '#D04A3F';

// ============================================================================
// Components
// ============================================================================

function SplitButton({
	backgroundColor,
	text,
	onPress,
}: {
	backgroundColor: string;
	text: string;
	onPress: () => void;
}) {
	return (
		<Pressable
			style={[styles.splitButton, { backgroundColor }]}
			onPress={onPress}
			android_ripple={{ color: 'rgba(255, 255, 255, 0.2)' }}>
			<Text style={styles.buttonText}>{text}</Text>
		</Pressable>
	);
}

export default function HomeScreen() {
	// ===== Hooks =====
	const router = useRouter();

	// ===== Event Handlers =====
	const handleGuardianPress = () => {
		console.log('GUARDIAN pressed');
	};

	const handleWardPress = () => {
		console.log('WARD pressed');
		router.push('/ward');
	};

	// ===== Render =====
	return (
		<View style={styles.container}>
			<SplitButton
				backgroundColor={WARM_BLUE}
				text="GUARDIAN"
				onPress={handleGuardianPress}
			/>
			<SplitButton
				backgroundColor={WARM_RED}
				text="WARD"
				onPress={handleWardPress}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
	},
	splitButton: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonText: {
		color: '#FFFFFF',
		fontSize: 44,
		fontWeight: 'bold',
		textTransform: 'uppercase',
	},
});
