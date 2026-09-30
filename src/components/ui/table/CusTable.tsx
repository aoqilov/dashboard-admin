import type { ReactNode } from 'react'
import { Table } from '@chakra-ui/react'
import { CusEmptyState } from '../empty-state/CusEmptyState'
import { CusSpinner } from '../spinner/CusSpinner'

export interface TableColumn<T> {
  key: string
  header: ReactNode
  /** Berilmasa row[key] ko'rsatiladi */
  render?: (row: T, index: number) => ReactNode
  align?: 'start' | 'center' | 'end'
  width?: string
}

interface CusTableProps<T> {
  columns: TableColumn<T>[]
  data: T[]
  rowKey: (row: T) => string | number
  onRowClick?: (row: T) => void
  isLoading?: boolean
  emptyText?: string
  size?: 'sm' | 'md' | 'lg'
  striped?: boolean
  /** Sarlavha qatori scroll paytida yopishib turadi */
  stickyHeader?: boolean
  className?: string
}

export function CusTable<T>({
  columns,
  data,
  rowKey,
  onRowClick,
  isLoading,
  emptyText,
  size = 'md',
  striped,
  stickyHeader,
  className,
}: CusTableProps<T>) {
  return (
    <Table.ScrollArea borderWidth="1px" borderColor="border.muted" borderRadius="xl" className={className}>
      <Table.Root size={size} striped={striped} interactive={Boolean(onRowClick)} stickyHeader={stickyHeader}>
        <Table.Header>
          <Table.Row bg="bg.subtle">
            {columns.map((column) => (
              <Table.ColumnHeader
                key={column.key}
                textAlign={column.align}
                width={column.width}
                color="fg.muted"
                fontWeight="medium"
                fontSize="xs"
                py="3"
              >
                {column.header}
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {isLoading || data.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={columns.length}>
                {isLoading ? <CusSpinner fullArea /> : <CusEmptyState size="sm" title={emptyText} />}
              </Table.Cell>
            </Table.Row>
          ) : (
            data.map((row, index) => (
              <Table.Row
                key={rowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                cursor={onRowClick ? 'pointer' : undefined}
              >
                {columns.map((column) => (
                  <Table.Cell key={column.key} textAlign={column.align} borderColor="border.muted">
                    {column.render
                      ? column.render(row, index)
                      : String((row as Record<string, unknown>)[column.key] ?? '')}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  )
}
