import { useEffect, useMemo } from 'react'
import type { StoreProductPhoto } from '@/api/routes/stores-product-photos/storeProductPhotos.types'
import { CusFileUpload } from '@/components/ui/inputs/CusFileUpload'
import { CusLabel } from '@/components/ui/typography/CusTypography'
import { photoUrl } from '@/utils/media'

interface ImageFieldProps {
  label: string
  /** Serverdagi joriy rasm (tahrirda) */
  current?: StoreProductPhoto | null
  /** Yangi tanlangan fayl — forma uni multipart bilan yuboradi */
  file: File | null
  onChange: (file: File | null) => void
}

/** Bitta rasm maydoni (yangilik, chegirma): joriy yoki yangi tanlangan rasm ko'rinishi + fayl tanlash */
export function ImageField({ label, current, file, onChange }: ImageFieldProps) {
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : undefined), [file])
  useEffect(() => () => (preview ? URL.revokeObjectURL(preview) : undefined), [preview])

  const src = preview ?? photoUrl(current ?? undefined, 'medium')

  return (
    <div className="flex flex-col gap-2">
      <CusLabel>{label}</CusLabel>
      {src && (
        <div className="flex items-center gap-3">
          <img src={src} alt="" className="aspect-3/4 w-24 rounded-control bg-hover object-cover" />
          <span className="text-xs text-muted">{file ? 'Saqlaganda yuklanadi' : 'Yangisini tanlasangiz almashtiriladi'}</span>
        </div>
      )}
      <CusFileUpload
        maxFiles={1}
        accept={['image/*']}
        onChange={(files) => onChange(files[0] ?? null)}
        title="Rasmni shu yerga tashlang"
        description="PNG, JPG yoki WEBP"
      />
    </div>
  )
}
