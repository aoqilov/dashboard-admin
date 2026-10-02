import { CusButton } from '@/components/ui/buttons/CusButton'
import { CusCard } from '@/components/shared/card/CusCard'
import { navigate } from '@/utils/navigate'
import { useAllProducts } from '@/features/products/api-hooks/useProducts'
import { cancelPicking, finishPicking, setDraftRows, useDiscountDraft } from '../utils/discountDraft'
import { DiscountRowList } from './DiscountRowList'

/** /products da "chegirma uchun tanlash" rejimidagi o'ng panel: tanlangan mahsulotlar va chegirmasi */
export function DiscountPickPanel() {
  const { draft } = useDiscountDraft()
  const { data: products = [] } = useAllProducts()
  if (!draft) return null

  const byId = new Map(products.map((product) => [String(product.id), product]))

  const back = (action: () => void) => {
    action()
    navigate('/discounts')
  }

  return (
    <CusCard className="flex flex-col gap-4 p-4 sm:p-4 xl:sticky xl:top-6">
      <div>
        <h2 className="text-base font-semibold text-heading">Chegirma: {draft.title || 'yangi'}</h2>
        <p className="mt-0.5 text-sm text-muted">
          Jadvaldan mahsulotni bosing — shu yerga qo'shiladi. Narxi bor mahsulotlarni tanlash mumkin.
        </p>
      </div>

      <div className="max-h-[60vh] min-h-40 overflow-y-auto rounded-card border border-border">
        {draft.rows.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-muted">Hali mahsulot tanlanmadi</p>
        ) : (
          <DiscountRowList rows={draft.rows} products={byId} onChange={setDraftRows} />
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-muted">{draft.rows.length} ta tanlandi</span>
        <div className="flex gap-2">
          <CusButton variant="outline" onClick={() => back(cancelPicking)}>
            Bekor qilish
          </CusButton>
          <CusButton onClick={() => back(finishPicking)}>Tayyor</CusButton>
        </div>
      </div>
    </CusCard>
  )
}
