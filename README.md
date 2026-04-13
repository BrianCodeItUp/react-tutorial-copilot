# react-copilot

A guided tutorial/copilot component for **React** and **React Native**. Highlight elements on your page and walk users through step-by-step onboarding flows.

## Installation

```bash
# npm
npm install react-copilot

# yarn
yarn add react-copilot
```

## Quick Start

```tsx
import {
  CopilotMangerProvider,
  Copilot,
  CopilotItem,
  useCopilotManger,
} from 'react-copilot';

function App() {
  return (
    <CopilotMangerProvider>
      <TutorialContent />
    </CopilotMangerProvider>
  );
}

function TutorialContent() {
  const { registerCopilotSteps, onStart } = useCopilotManger();

  useEffect(() => {
    registerCopilotSteps('onboarding', {
      steps: [
        {
          stepId: 'step_1',
          item: (
            <CopilotItem title="Welcome">
              <p>This is the first step of the tutorial.</p>
            </CopilotItem>
          ),
        },
        {
          stepId: 'step_2',
          item: (
            <CopilotItem title="Next Feature" buttonText="Finish">
              <p>Here is another feature to explore.</p>
            </CopilotItem>
          ),
        },
      ],
    });
  }, []);

  const handleStart = async () => {
    const status = await onStart('onboarding');
    console.log('Tutorial ended with status:', status);
  };

  return (
    <div>
      <Copilot copilotId="step_1">
        <button>Feature A</button>
      </Copilot>

      <Copilot copilotId="step_2">
        <button>Feature B</button>
      </Copilot>

      <button onClick={handleStart}>Start Tutorial</button>
    </div>
  );
}
```

## API Reference

### `<CopilotMangerProvider>`

Context provider that manages tutorial state. Wrap your app or page with this component.

### `<Copilot>`

Wraps a target element to be highlighted during a tutorial step.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `copilotId` | `string` | *required* | Unique identifier matching a step's `stepId` |
| `isActive` | `boolean` | `true` | Whether this target is active |

### `<CopilotItem>`

The tooltip/popover UI displayed next to the highlighted element.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | — | Title text for the step |
| `buttonText` | `string` | `"下一步"` | Custom text for the next button |
| `canSkip` | `boolean` | `true` | Whether the user can skip the tutorial |
| `children` | `ReactNode` | — | Custom content for the step |

### `useCopilotManger()`

Hook to access tutorial controls.

| Property | Type | Description |
|----------|------|-------------|
| `registerCopilotSteps(key, groupSteps)` | `function` | Register a set of tutorial steps |
| `onStart(type)` | `(type: string) => Promise<COPILOT_STATUS>` | Start a tutorial flow, resolves when finished |
| `onFinish(status?)` | `function` | Manually end the tutorial |
| `nextStep()` | `function` | Advance to the next step |
| `prevStep()` | `function` | Go back to the previous step |
| `copilotType` | `string \| null` | Currently active tutorial type |
| `currentStepIndex` | `number` | Current step index (1-based) |
| `totalSteps` | `number` | Total number of steps |

### `GroupSteps`

```typescript
interface GroupSteps {
  beforeNext?: (currentStepInfo: { stepId: string }) => Promise<boolean> | boolean;
  steps: { stepId: string; item: ReactNode }[];
}
```

- `beforeNext` — Optional async guard called before advancing. Return `false` to prevent navigation.

### `COPILOT_STATUS`

```typescript
enum COPILOT_STATUS {
  SKIP,                // User skipped the tutorial
  FINISH,              // User completed all steps
  NOT_FOUND,           // No steps registered for the given type
  UNEXPECTED_BEHAVIOR, // Unexpected error
}
```

## Platform Support

| Platform | Support |
|----------|---------|
| React (Web) | ✅ |
| React Native | ✅ |

The package automatically uses the correct implementation based on the platform:

- **Web** — Uses pure DOM APIs (`getBoundingClientRect`, CSS transitions)
- **React Native** — Uses native APIs (`View.measure`, `Animated`)

No additional configuration is needed.

## License

MIT
