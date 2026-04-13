import { type PropsWithChildren, useEffect, useState } from 'react';
import { useCopilotManger } from '../CopilotManger';

const ANIMATION_DURATION = 300;

interface CopilotItemProps extends PropsWithChildren {
  title?: string;
  buttonText?: string;
  canSkip?: boolean;
}

export const CopilotItem = ({
  title,
  buttonText,
  canSkip = true,
  children,
}: CopilotItemProps) => {
  const {
    target,
    targetLayout,
    prevStep,
    nextStep,
    onFinish,
    currentStepIndex,
    totalSteps,
  } = useCopilotManger();
  const { innerWidth: windowWidth } = window;

  const [shouldRender, setShouldRender] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (target) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setVisible(true);
        });
      });
      return;
    }

    setVisible(false);
    const timer = setTimeout(() => setShouldRender(false), ANIMATION_DURATION);
    return () => clearTimeout(timer);
  }, [target]);

  const circleWidth = 8;
  const lineWidth = 50;
  const lineHeight = 2;
  const contentWidth = 264;
  const isExceedingRight =
    targetLayout.x + targetLayout.width + lineWidth + contentWidth >
    windowWidth;

  return (
    <div
      style={{
        position: 'absolute',
        backgroundColor: '#00000066',
        width: '100%',
        height: '100%',
        opacity: visible ? 1 : 0,
        transition: `opacity ${ANIMATION_DURATION}ms ease-in-out`,
      }}
    >
      {shouldRender && (
        <>
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              zIndex: 1,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: targetLayout.y,
                left: targetLayout.x,
                width: targetLayout.width,
                height: targetLayout.height,
                pointerEvents: 'none',
              }}
            >
              {target}
            </div>
            {/* 圓點 */}
            <div
              style={{
                position: 'absolute',
                height: circleWidth,
                width: circleWidth,
                borderRadius: 10,
                backgroundColor: 'white',
                left: !isExceedingRight
                  ? targetLayout.x + targetLayout.width + 10
                  : targetLayout.x - 10,
                top: targetLayout.y + targetLayout.height / 2 - circleWidth / 2,
              }}
            />

            {/* 連接線 */}
            <div
              style={{
                position: 'absolute',
                height: lineHeight,
                width: lineWidth,
                backgroundColor: 'white',
                left: !isExceedingRight
                  ? targetLayout.x + targetLayout.width + 10
                  : targetLayout.x - lineWidth - 10,
                top: targetLayout.y + targetLayout.height / 2 - lineHeight / 2,
              }}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                position: 'absolute',
                width: contentWidth,
                left: !isExceedingRight
                  ? targetLayout.x + targetLayout.width + lineWidth
                  : targetLayout.x - lineWidth - contentWidth,
                top: targetLayout.y,
                borderRadius: 8,
                backgroundColor: 'white',
                padding: '12px',
                gap: '8px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <label>{title}</label>
                {canSkip && (
                  <svg
                    onClick={() => onFinish()}
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    style={{ cursor: 'pointer', flexShrink: 0 }}
                  >
                    <line
                      x1="4"
                      y1="4"
                      x2="14"
                      y2="14"
                      stroke="#999"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <line
                      x1="14"
                      y1="4"
                      x2="4"
                      y2="14"
                      stroke="#999"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </div>
              {children}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <label>{`${currentStepIndex}/${totalSteps}`}</label>
                <div
                  style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}
                >
                  <div
                    onClick={prevStep}
                    style={{
                      padding: '4px',
                      border: '1px solid black',
                      borderRadius: '8px',
                    }}
                  >
                    上一步
                  </div>
                  <div
                    onClick={nextStep}
                    style={{
                      padding: '4px',
                      border: '1px solid black',
                      borderRadius: '8px',
                    }}
                  >
                    {buttonText || '下一步'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
