import { FileUpload } from '@chakra-ui/react'
import { CloudUpload } from 'lucide-react'

interface CusFileUploadProps {
  /** Eng ko'p fayllar soni */
  maxFiles?: number
  /** Masalan ['image/*'] yoki ['.pdf'] */
  accept?: string[]
  /** Baytlarda */
  maxFileSize?: number
  onChange?: (files: File[]) => void
  title?: string
  description?: string
  isDisabled?: boolean
  className?: string
}

/** Sudrab tashlash (drag & drop) zonasi + yuklangan fayllar ro'yxati */
export function CusFileUpload({
  maxFiles = 1,
  accept,
  maxFileSize,
  onChange,
  title = 'Faylni shu yerga tashlang yoki tanlang',
  description = 'PNG, JPG, PDF — 5 MB gacha',
  isDisabled,
  className,
}: CusFileUploadProps) {
  return (
    <FileUpload.Root
      maxFiles={maxFiles}
      accept={accept}
      maxFileSize={maxFileSize}
      onFileChange={(details) => onChange?.(details.acceptedFiles)}
      disabled={isDisabled}
      alignItems="stretch"
      className={className}
    >
      <FileUpload.HiddenInput />
      <FileUpload.Dropzone
        width="full"
        minHeight="40"
        borderRadius="l3"
        bg="bg.subtle"
        _hover={{ borderColor: 'brand.solid' }}
      >
        <span className="flex size-12 items-center justify-center rounded-full bg-hover text-muted">
          <CloudUpload className="size-6" />
        </span>
        <FileUpload.DropzoneContent>
          <p className="text-sm font-medium text-heading">{title}</p>
          <p className="text-xs text-muted">{description}</p>
        </FileUpload.DropzoneContent>
      </FileUpload.Dropzone>
      <FileUpload.List showSize clearable />
    </FileUpload.Root>
  )
}
