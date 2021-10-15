export type BookCard = BookCardData | BookGroupCardData

// 书籍的情况不需要id，书籍组时需要
export interface BookData {
  id?: string
  title?: string
  cover?: string
  path: string
}

export interface BookCardData {
  type: 'BookCard'
  id: string
  data: BookData
}

export interface BookGroupCardData {
  id: string
  type: 'BookGroupCard'
  groupName: string
  data: BookData[]
}
