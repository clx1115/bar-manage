export interface GamePropItem {
  id: number
  productId: number
  productName: string
  productImage: string
  productPrice: number
  effectId: number
  effectCode: string
  effectName: string
  payType: number
  consumePoints: number
  status: number
  orgId?: number
}

export interface GamePropEffectItem {
  id: number
  effectCode: string
  effectName: string
  effectDesc?: string
  status: number
}

export interface GamePropStatisticsItem {
  productId: number
  productName?: string
  payType: number
  salesVolume: number
  totalAmount: number
}

export interface GamePropStatisticsTotal {
  salesVolume: number
  totalAmount: number
}
