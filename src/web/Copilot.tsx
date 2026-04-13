import { type PropsWithChildren, useEffect, useRef } from 'react';
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
  const viewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePosition = () => {
      if (viewRef.current) {
        const rect = viewRef.current.getBoundingClientRect();

        setTargetLayout({
          x: rect.x + window.scrollX,
          y: rect.y + window.scrollY,
          width: rect.width,
          height: rect.height,
        });
        setTarget(children);
      }
    };

    if (copilotId !== currentStepId || !isActive) {
      return;
    }

    // Initial position update
    updatePosition();

    // Update position on window resize
    window.addEventListener('resize', updatePosition);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', updatePosition);
    };
  }, [currentStepId, isActive]);

  return <div ref={viewRef}>{children}</div>;
};
