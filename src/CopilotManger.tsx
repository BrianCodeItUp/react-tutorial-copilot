import {
  type Dispatch,
  type PropsWithChildren,
  type ReactNode,
  type SetStateAction,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export enum COPILOT_STATUS {
  /* 跳過 */
  SKIP,
  /* 完成 */
  FINISH,
  /* 查無教學 */
  NOT_FOUND,
  /* 非預期行為 */
  UNEXPECTED_BEHAVIOR,
}

export interface GroupSteps {
  beforeNext?: (currentStepInfo: {
    stepId: string;
  }) => Promise<boolean> | boolean;
  steps: {
    stepId: string;
    item: ReactNode;
  }[];
}

type IContextType = {
  copilotType: string | null;
  totalSteps: number;
  currentStepIndex: number;
  currentStepId: string;
  registerCopilotSteps: (key: string, groupSteps: GroupSteps) => void;
  onStart: (type: string) => Promise<COPILOT_STATUS>;
  onFinish: (value?: COPILOT_STATUS) => void;
  nextStep: () => void;
  prevStep: () => void;
  target: ReactNode;
  setTarget: Dispatch<SetStateAction<ReactNode>>;
  targetLayout: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  setTargetLayout: Dispatch<
    SetStateAction<{
      x: number;
      y: number;
      height: number;
      width: number;
    }>
  >;
};

const initialState: IContextType = {
  copilotType: null,
  totalSteps: 0,
  currentStepIndex: 0,
  currentStepId: '',
  registerCopilotSteps: () => {},
  onStart: (_type: string) =>
    new Promise((resolve) => resolve(COPILOT_STATUS.NOT_FOUND)),
  onFinish: () => {},
  nextStep: () => {},
  prevStep: () => {},
  target: null,
  setTarget: () => {},
  targetLayout: { x: 0, y: 0, width: 0, height: 0 },
  setTargetLayout: () => {},
};

export const CopilotManger = createContext(initialState);

export const useCopilotManger = () => useContext(CopilotManger);

export const CopilotMangerProvider = ({ children }: PropsWithChildren) => {
  /* ui 相關 */
  const defaultLayout = { x: 0, y: 0, height: 0, width: 0 };
  const [targetLayout, setTargetLayout] = useState(defaultLayout);
  const [target, setTarget] = useState<ReactNode>(null);

  const [copilotType, setCopilotType] = useState<string | null>(null);
  const [allSteps, setAllSteps] = useState<{
    [key: string]: GroupSteps;
  }>({});
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const groupSteps = useMemo(
    () => (copilotType ? allSteps[copilotType]?.steps || [] : []),
    [copilotType]
  );

  const beforeNext = useCallback(
    async (currentStepInfo: { stepId: string }) => {
      let result = true;
      if (copilotType && allSteps[copilotType]) {
        const tutorialConfig = allSteps[copilotType];
        result =
          typeof tutorialConfig?.beforeNext === 'function'
            ? await tutorialConfig.beforeNext(currentStepInfo)
            : true;
      }
      return result;
    },
    [copilotType, allSteps]
  );

  const step = groupSteps[currentStepIndex - 1];
  const totalSteps = groupSteps.length;
  const currentStepId = step?.stepId || '';
  const promise =
    useRef<(value: COPILOT_STATUS | PromiseLike<COPILOT_STATUS>) => void>();

  const registerCopilotSteps = (key: string, steps: GroupSteps) => {
    setAllSteps((prev) => ({ ...prev, [key]: steps }));
  };

  const onStart = (type: string) => {
    return new Promise<COPILOT_STATUS>((resolve) => {
      promise.current = resolve;
      if (!allSteps[type]) {
        resolve(COPILOT_STATUS.NOT_FOUND);
        return;
      }
      setCopilotType(type);
    });
  };

  const onFinish = (value: COPILOT_STATUS = COPILOT_STATUS.SKIP) => {
    setTarget(null);
    if (!copilotType) {
      return;
    }
    setCopilotType(null);
    if (promise.current) {
      promise.current(value);
    }
  };

  const nextStep = async () => {
    const result = await beforeNext({
      stepId: currentStepId,
    });
    if (!result) {
      return;
    }
    const nextStepIndex = currentStepIndex + 1;
    if (nextStepIndex <= totalSteps) {
      setTarget(null);
      setTimeout(() => {
        setCurrentStepIndex(nextStepIndex);
      }, 500);
    } else {
      onFinish(COPILOT_STATUS.FINISH);
    }
  };

  const prevStep = () => {
    const prevStepIndex = currentStepIndex - 1;
    if (prevStepIndex > 0) {
      setTarget(null);
      setTimeout(() => {
        setCurrentStepIndex(prevStepIndex);
      }, 500);
    }
  };

  useEffect(() => {
    if (!copilotType) {
      setCurrentStepIndex(0);
      return;
    }
    setTimeout(() => {
      setCurrentStepIndex(1);
    }, 500);
  }, [copilotType]);

  return (
    <CopilotManger.Provider
      value={{
        copilotType,
        totalSteps,
        currentStepIndex,
        currentStepId,
        registerCopilotSteps,
        onStart,
        onFinish,
        nextStep,
        prevStep,
        targetLayout,
        setTargetLayout,
        target,
        setTarget,
      }}
    >
      {children}
      {copilotType && <>{isValidElement(step?.item) && step.item}</>}
    </CopilotManger.Provider>
  );
};
