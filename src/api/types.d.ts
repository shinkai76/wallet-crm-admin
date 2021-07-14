export interface IArticleData {
  id: number
  status: string
  title: string
  abstractContent: string
  fullContent: string
  sourceURL: string
  imageURL: string
  timestamp: string | number
  platforms: string[]
  disableComment: boolean
  importance: number
  author: string
  reviewer: string
  type: string
  pageviews: number
}

/*  customer list  */

export interface CustomerData {
  user_id: string
  email: string
  registration_time: string
  level: string
}
export interface ExistingAssetsData {
  token: string
  quantity: string
}
export interface DepositData {
  time: string
  token: string
  quantity: string
  from_address: string
}
export interface WithdrawData {
  time: string
  token: string
  quantity: string
  fee: string
  to_address: string
}
export interface AirdropData {
  time: string
  token: string
  quantity: string
}
/*  customer list  END  */
