/* eslint-disable camelcase */

/*  customer list  */

export interface ICustomerData {
  user_code: string
  email: string
  registration_time: number
  level: number
}
export interface IExistingAssetsData {
  name: string
  num: string
}
export interface IDepositData {
  time: number
  coin: string
  amount: string
  from: string
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
  id: number
  name: string
  withdraw_fee: string
  internal_fee: string
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

/*  finance   */

export interface ICollectListData {
  application_time: number
  token: string
  type: string
  quantity: string
  cost: string
  state: string
  info: string
}

export interface ICollectAccountListData {
  token: string
  address: string
  balance: string
}

export interface IFeeProfitListData {
  token: string
  balance: string
}

/*  finance  END  */
