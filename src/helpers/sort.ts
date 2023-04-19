import { Ref } from 'vue'

export type ReadOnlyRef<T> = Readonly<Ref<T>>
export type MaybeRef<T> = T | Ref<T>

export interface SortableItem {
  type?: string
}

export interface SortField {
  name: string
  // eslint-disable-next-line @typescript-eslint/ban-types
  sortable?: MaybeRef<boolean | Function | string>
  sortDir?: MaybeRef<SortDir>
  label?: string
}

export enum SortDir {
  Desc = 'desc',
  Asc = 'asc'
}

export const sortHelper = <T extends SortableItem>(
  items: T[],
  fields: SortField[],
  sortBy: string,
  sortDir: SortDir
) => {
  const field = fields.find((f) => f.name === sortBy)
  if (!field) {
    return items
  }
  const { sortable } = field
  const collator = new Intl.Collator(navigator.language, { sensitivity: 'base', numeric: true })

  if (sortBy === 'name') {
    const folders = [...items.filter((i) => i.type === 'folder')].sort((a, b) =>
      compare(a, b, collator, sortBy, sortDir, sortable)
    )
    const files = [...items.filter((i) => i.type !== 'folder')].sort((a, b) =>
      compare(a, b, collator, sortBy, sortDir, sortable)
    )
    if (sortDir === SortDir.Asc) {
      return folders.concat(files)
    }
    return files.concat(folders)
  }
  return [...items].sort((a, b) => compare(a, b, collator, sortBy, sortDir, sortable))
}

const compare = (
  a: SortableItem,
  b: SortableItem,
  collator: Intl.Collator,
  sortBy: string,
  sortDir: SortDir,
  sortable
) => {
  let aValue = a[sortBy]
  let bValue = b[sortBy]
  const modifier = sortDir === SortDir.Asc ? 1 : -1

  if (sortable) {
    if (typeof sortable === 'string') {
      const genArrComp = (vals) => {
        return vals.map((val) => val[sortable]).join('')
      }

      aValue = genArrComp(aValue)
      bValue = genArrComp(bValue)
    } else if (typeof sortable === 'function') {
      aValue = sortable(aValue)
      bValue = sortable(bValue)
    }
  }

  if (!isNaN(aValue) && !isNaN(bValue)) {
    return (aValue - bValue) * modifier
  }
  const c = collator.compare((aValue || '').toString(), (bValue || '').toString())
  return c * modifier
}
