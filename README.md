# react-tutorial-copilot

A guided tutorial/copilot component for **React** and **React Native**. Highlight elements on your page and walk users through step-by-step onboarding flows.

## Installation

```bash
# npm
npm install react-tutorial-copilot

# yarn
yarn add react-tutorial-copilot
```

## Quick Start

```tsx
import {
  CopilotMangerProvider,
  Copilot,
  CopilotItem,
  useCopilotManger,
} from 'react-tutorial-copilot';

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

## Customization

### Using built-in `<CopilotItem>` props

```tsx
<CopilotItem
  title="Step Title"        // Title displayed at the top
  buttonText="Got it"       // Custom next button text (default: "下一步")
  canSkip={false}           // Hide the close/skip button (default: true)
>
  {/* Any custom content */}
  <p>Your description here</p>
  <img src="demo.png" alt="demo" />
</CopilotItem>
```

### Fully custom tutorial UI

Since `GroupSteps.steps[].item` accepts any `ReactNode`, you can replace `<CopilotItem>` entirely with your own component. Use `useCopilotManger()` to access all tutorial state and controls:

```tsx
import { useCopilotManger } from 'react-tutorial-copilot';

function MyCustomItem() {
  const {
    target,           // The highlighted element (ReactNode)
    targetLayout,     // { x, y, width, height } of the target
    nextStep,
    prevStep,
    onFinish,
    currentStepIndex,
    totalSteps,
  } = useCopilotManger();

  if (!target) return null;

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }}>
      {/* Render highlighted target */}
      <div style={{
        position: 'absolute',
        top: targetLayout.y,
        left: targetLayout.x,
        width: targetLayout.width,
        height: targetLayout.height,
        pointerEvents: 'none',
      }}>
        {target}
      </div>

      {/* Your custom tooltip */}
      <div className="my-tooltip">
        <p>{currentStepIndex} / {totalSteps}</p>
        <button onClick={prevStep}>Back</button>
        <button onClick={nextStep}>Next</button>
        <button onClick={() => onFinish()}>Skip</button>
      </div>
    </div>
  );
}

// Usage
registerCopilotSteps('onboarding', {
  steps: [
    { stepId: 'step_1', item: <MyCustomItem /> },
  ],
});
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
