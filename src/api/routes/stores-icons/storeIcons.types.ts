export interface Icon {
  id: number
  name: string
}

export interface IconRequest {
  name: string
}

export type IconUpdateRequest = Partial<IconRequest>
