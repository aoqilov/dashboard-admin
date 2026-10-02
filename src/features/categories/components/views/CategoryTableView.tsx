import { CornerDownRight } from 'lucide-react'
import type { StoreCategory } from '@/api/routes/stores-categories/storeCategories.types'
import { CusBadge } from '@/components/ui/badge/CusBadge'
import { CusTable, type TableColumn } from '@/components/ui/table/CusTable'
import { CategoryThumb } from '../CategoryThumb'
import type { CategoryViewProps } from './types'

interface Row {
  category: StoreCategory
  /** 0 — asosiy kategoriya, 1 — subkategoriya */
  depth: 0 | 1
  /** Asosiy kategoriyada: subkategoriyalar soni */
  childCount: number
}

/** Jadval: har bir asosiy kategoriya ostida o'z subkategoriyalari (chekinish bilan) */
export function CategoryTableView({ tree, actions, onOpenProducts }: CategoryViewProps) {
  const rows: Row[] = tree.roots.flatMap((root) => {
    const children = tree.childrenOf.get(root.id) ?? []
    return [
      { category: root, depth: 0 as const, childCount: children.length },
      ...children.map((child) => ({ category: child, depth: 1 as const, childCount: 0 })),
    ]
  })

  const columns: TableColumn<Row>[] = [
    {
      key: 'name',
      header: 'Nomi',
      render: ({ category, depth }) => (
        <div className={depth ? 'flex items-center gap-3 pl-8' : 'flex items-center gap-3'}>
          {depth > 0 && <CornerDownRight className="size-4 shrink-0 text-subtle" />}
          <CategoryThumb category={category} className={depth ? 'size-9' : 'size-11'} />
          <span className={depth ? 'text-sm text-content' : 'text-sm font-medium text-heading'}>{category.name}</span>
          {category.visible === false && <CusBadge color="dark">Yashirin</CusBadge>}
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Turi',
      render: ({ depth }) =>
        depth ? <CusBadge color="info">Subkategoriya</CusBadge> : <CusBadge color="primary">Asosiy</CusBadge>,
    },
    {
      key: 'children',
      header: 'Subkategoriyalar',
      render: ({ depth, childCount }) => (
        <span className="text-sm text-muted">{depth ? '—' : `${childCount} ta`}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'end',
      width: '160px',
      render: ({ category }) => <div onClick={(event) => event.stopPropagation()}>{actions(category)}</div>,
    },
  ]

  return (
    <CusTable
      columns={columns}
      data={rows}
      rowKey={({ category }) => category.id}
      onRowClick={({ category }) => onOpenProducts(category)}
    />
  )
}
