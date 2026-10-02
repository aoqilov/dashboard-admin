import { CusCard } from '@/components/shared/card/CusCard'
import { CusButton } from '@/components/ui/buttons/CusButton'
import { useAllProducts } from '@/features/products/api-hooks/useProducts'
import { navigate } from '@/utils/navigate'
import { cancelNewsPicking, finishNewsPicking, setDraftProducts, useNewsDraft } from '../utils/newsDraft'
import { NewsProductList } from './NewsProductList'

/** /products da "yangilik uchun tanlash" rejimidagi o'ng panel: tanlangan mahsulotlar */
export function NewsPickPanel() {
  const { draft } = useNewsDraft()
  const { data: products = [] } = useAllProducts()
  if (!draft) return null

  const byId = new Map(products.map((product) => [product.id, product]))

  const back = (action: () => void) => {
    action()
    navigate('/news')
  }

  return (
    <CusCard className="flex flex-col gap-4 p-4 sm:p-4 xl:sticky xl:top-6">
      <div>
        <h2 className="text-base font-semibold text-heading">Yangilik: {draft.title || 'yangi'}</h2>
        <p className="mt-0.5 text-sm text-muted">Jadvaldan mahsulotni bosing — shu yerga qo'shiladi.</p>
      </div>

      <div className="max-h-[60vh] min-h-40 overflow-y-auto rounded-card border border-border">
        {draft.products.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-muted">Hali mahsulot tanlanmadi</p>
        ) : (
          <NewsProductList ids={draft.products} products={byId} onChange={setDraftProducts} />
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-muted">{draft.products.length} ta tanlandi</span>
        <div className="flex gap-2">
          <CusButton variant="outline" onClick={() => back(cancelNewsPicking)}>
            Bekor qilish
          </CusButton>
          <CusButton onClick={() => back(finishNewsPicking)}>Tayyor</CusButton>
        </div>
      </div>
    </CusCard>
  )
}
