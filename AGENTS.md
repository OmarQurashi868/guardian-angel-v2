---
alwaysApply: false
---

# PROJECT PROTOCOL

## Core Tech Stack
- **Framework:** Expo (React Native) - Managed Workflow.
- **Engine:** Hermes (Mandatory for Android 6 memory management).
- **Target OS:** Android 6.0 (API Level 23) - Low-end hardware.
- **Audio Stack:** `react-native-track-player` for robust background streaming.

## Architectural Rules (Vibe Coding)
- **Zero-Code Policy:** I (the user) will not write code. You (the agent) are responsible for full implementation, debugging, and refactoring.
- **Bridge Optimization:** Minimize the data sent between the JavaScript side and the Native side. Audio processing must stay in the native layer; JS should only send "Start/Stop" signals.
- **No Heavy Dependencies:** Do not install `reanimated`, `lottie`, or `expo-router` unless absolutely necessary. Keep the bundle size minimal.
- **Functional Logic:** Use React Hooks (`useEffect`, `useCallback`, `useMemo`) to prevent unnecessary re-renders that would lag an old CPU.

## Android 6 (API 23) Constraints
- **Permissions:** Always include checks for `RECORD_AUDIO` and `WRITE_EXTERNAL_STORAGE` at runtime.
- **Memory:** Assume the device has < 2GB RAM. Clear audio buffers and listeners on component unmount to prevent memory leaks.
- **UI:** Use standard `View`, `Text`, and `Pressable`. Avoid complex shadows, blurs, or high-resolution images.

## Voice Streaming Specs
- **Backgrounding:** The stream must persist if the user minimizes the app.
- **Latency:** Prioritize low-latency audio over high-fidelity audio (use lower sample rates if necessary for stability).
- **Logging:** Always include `console.log` markers at key lifecycle stages (Init, Buffer, Stream Start, Error) so I can provide terminal feedback.

## Debugging Protocol
- If a "Red Screen" occurs, I will provide the `@Terminal` output.
- You must analyze the stack trace, identify the specific file/line, and provide a direct fix rather than a complete rewrite.
- If a library is incompatible with API 23, suggest the last stable version that supported it.


# CODE STRUCTURE

## Import Organization

````

## Section Dividers

Use consistent dividers to separate major sections:

```typescript
// ============================================================================
// Types & Configuration
// ============================================================================
````

Within components, use shorter dividers:

```typescript
// ===== Hooks =====
// ===== Derived State - Category Name =====
// ===== Effects - Purpose =====
// ===== Guards =====
// ===== Render =====
```

## Component Structure

Organize components in this exact order:

```typescript
function ComponentName() {
	// ===== Hooks =====
	const router = useRouter();
	const { user } = useUser();
	const [state, setState] = useState();

	// ===== Derived State - Category =====
	const filteredData = data?.filter(...);
	const isLoading = !data;

	// ===== Effects - Purpose =====
	useEffect(() => {
		// Side effects
	}, [deps]);

	// ===== Event Handlers =====
	const handleClick = () => {};

	// ===== Guards =====
	if (isLoading) return <LoadingScreen />;

	// ===== Render =====
	return <div>{/* JSX */}</div>;
}
```

**Key principles:**

-   Group ALL hooks together at the top
-   Put derived/computed values in "Derived State" sections with descriptive category names
-   Group effects together with descriptive purpose
-   Place guards (early returns) before the main render
-   Always mark the final return with `// ===== Render =====`

## Configuration Patterns

Use maps for O(1) lookups instead of arrays:

```typescript
// ✅ Good: Direct lookup
const CONFIG: Record<string, NavConfig> = {
	"/dashboard": { name: "Dashboard", icon: Home },
	"/settings": { name: "Settings", icon: Settings },
};

// Derive array when needed for iteration
const CONFIG_ITEMS = Object.entries(CONFIG).map(([key, value]) => ({
	key,
	...value,
}));
```

## Component Extraction

Extract sub-components when:

-   JSX exceeds ~30 lines with clear responsibility
-   Logic needs testing in isolation
-   Readability improves by reducing nesting

Place sub-components BEFORE the main export:

```typescript
// ============================================================================
// Components
// ============================================================================

function SubComponent({ prop }: Props) {
	return <div>{/* ... */}</div>;
}

export default function MainComponent() {
	return <SubComponent prop={value} />;
}
```

## FILES
Use different files for different services/modules for organization