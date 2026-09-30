import type { ReactNode } from 'react'
import { Steps } from '@chakra-ui/react'

export interface StepItem {
  title: ReactNode
  description?: ReactNode
  content?: ReactNode
}

interface CusStepsProps {
  items: StepItem[]
  /** 0 dan boshlanadi */
  step?: number
  defaultStep?: number
  onChange?: (step: number) => void
  orientation?: 'horizontal' | 'vertical'
  size?: 'sm' | 'md' | 'lg'
  /** Oxirgi qadamdan keyin ko'rsatiladi */
  completedContent?: ReactNode
  className?: string
}

/** Bosqichma-bosqich jarayon (wizard) */
export function CusSteps({
  items,
  step,
  defaultStep = 0,
  onChange,
  orientation = 'horizontal',
  size = 'md',
  completedContent,
  className,
}: CusStepsProps) {
  return (
    <Steps.Root
      count={items.length}
      step={step}
      defaultStep={step === undefined ? defaultStep : undefined}
      onStepChange={(details) => onChange?.(details.step)}
      orientation={orientation}
      size={size}
      className={className}
    >
      <Steps.List>
        {items.map((item, index) => (
          <Steps.Item key={index} index={index}>
            <Steps.Indicator />
            <div className="flex flex-col">
              <Steps.Title>{item.title}</Steps.Title>
              {item.description && <Steps.Description>{item.description}</Steps.Description>}
            </div>
            <Steps.Separator />
          </Steps.Item>
        ))}
      </Steps.List>
      {items.map(
        (item, index) =>
          item.content && (
            <Steps.Content key={index} index={index}>
              {item.content}
            </Steps.Content>
          ),
      )}
      {completedContent && <Steps.CompletedContent>{completedContent}</Steps.CompletedContent>}
    </Steps.Root>
  )
}
