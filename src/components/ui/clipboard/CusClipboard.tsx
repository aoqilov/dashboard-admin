import { Clipboard, IconButton, Input, InputGroup } from '@chakra-ui/react'

interface CusClipboardProps {
  value: string
  /** true — o'qish uchun input + nusxa tugmasi, false — faqat tugma */
  withInput?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/** Matnni nusxalash (API kalit, havola) */
export function CusClipboard({ value, withInput = true, size = 'md', className }: CusClipboardProps) {
  const button = (
    <Clipboard.Trigger asChild>
      <IconButton aria-label="Nusxalash" variant="surface" size="xs" me={withInput ? '-2' : undefined}>
        <Clipboard.Indicator />
      </IconButton>
    </Clipboard.Trigger>
  )

  return (
    <Clipboard.Root value={value} width={withInput ? 'full' : undefined} className={className}>
      {withInput ? (
        <InputGroup endElement={button}>
          <Clipboard.Input asChild>
            <Input size={size} readOnly />
          </Clipboard.Input>
        </InputGroup>
      ) : (
        button
      )}
    </Clipboard.Root>
  )
}
