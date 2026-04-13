import { type PropsWithChildren, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { useCopilotManger } from '../CopilotManger';

interface CopilotProps extends PropsWithChildren {
  copilotId: string;
  isActive?: boolean;
}

export const Copilot = ({
  copilotId,
  isActive = true,
  children,
}: CopilotProps) => {
  const { setTargetLayout, setTarget, currentStepId } = useCopilotManger();
  const viewRef = useRef<View>(null);

  useEffect(() => {
    if (copilotId !== currentStepId || !isActive) {
      return;
    }
    viewRef.current?.measure((_x, _y, width, height, pageX, pageY) => {
      setTargetLayout({ x: pageX, y: pageY, width, height });
      setTarget(children);
    });
  }, [currentStepId, isActive]);

  return (
    <View ref={viewRef} collapsable={false}>
      {children}
    </View>
  );
};
