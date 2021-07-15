/* eslint-disable camelcase */

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



/*  token list  */
export interface TokenListData {
  token_id: string
  name: string
  withdraw_fee: string
  internal_withdraw_fee: string
  contract_address: string
}


/*  token list  END  */
/* airdrop  */
export interface AirdropListData {
  time: number
  token: string
  quantity: string
  level: string
}


/*  airdrop  END  */
