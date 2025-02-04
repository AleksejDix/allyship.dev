export interface ChecklistItem {
  index: number
  label: string
}

export interface ChecklistSection {
  title: string
  items: ChecklistItem[]
}
