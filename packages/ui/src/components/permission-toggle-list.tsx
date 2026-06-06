import { PermissionToggleItem } from './permission-toggle-item'

export interface PermissionToggleListItem {
  key: string
  label: string
  inBaseline: boolean
  override: 'grant' | 'revocation' | null
  disabled?: boolean
}

export interface PermissionToggleListProps {
  items: PermissionToggleListItem[]
  onToggle: (key: string) => void
}

export function PermissionToggleList({ items, onToggle }: PermissionToggleListProps) {
  return (
    <>
      {items.map((item, i) => (
        <PermissionToggleItem
          key={item.key}
          id={item.key}
          label={item.label}
          inBaseline={item.inBaseline}
          override={item.override}
          disabled={item.disabled}
          isLast={i === items.length - 1}
          onToggle={onToggle}
        />
      ))}
    </>
  )
}
