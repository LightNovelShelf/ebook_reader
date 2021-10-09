export type BookList = (BookCardData | BookGroupCardData)[]

export interface BookData {
  id?: string
  title: string
  cover: string
}

export interface BookCardData {
  id: string
  type: 'BookCard'
  data: BookData
}

export interface BookGroupCardData {
  id: string
  type: 'BookGroupCard'
  groupName: string
  data: BookData[]
}
