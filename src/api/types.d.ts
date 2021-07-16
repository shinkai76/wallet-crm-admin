/* eslint-disable camelcase */

/*  customer list  */

export interface ICustomerData {
  user_id: string
  email: string
  registration_time: string
  level: string
}
export interface IExistingAssetsData {
  token: string
  quantity: string
}
export interface IDepositData {
  time: string
  token: string
  quantity: string
  from_address: string
}
export interface IWithdrawData {
  time: string
  token: string
  quantity: string
  fee: string
  to_address: string
}
export interface IAirdropData {
  time: string
  token: string
  quantity: string
}
/*  customer list  END  */



/*  token list  */
export interface ITokenListData {
  token_id: string
  name: string
  withdraw_fee: string
  internal_withdraw_fee: string
  contract_address: string
}


/*  token list  END  */

/* airdrop  */
export interface IAirdropListData {
  time: number
  token: string
  quantity: string
  level: string
}


/*  airdrop  END  */

/* withdraw  */
export interface IPendingListData {
  order: string
  account: string
  application_time: number
  token: string
  type: string
  quantity: string
  fee: string
  address: string
}
export interface IHistoryListData extends IPendingListData {
  chain_fee: string
}

/*  withdraw  END  */
