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

export interface ITokenQuery {
  id: number
  name: string
  withdrawal_fee: string
  internal_fee: string
  contract_address: string
  proto: string
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
export interface IWithdrawPendingListData {
  id: number
  user_code: string
  code: string
  token: string
  amount: string
  fee: string
  to: string
  application_time: number
  withdrawal_time: number
  processing_time: number
  withdrawal_type: number
  is_profit: boolean
}
export interface IHistoryListData extends IWithdrawPendingListData {
  chain_fee: string
}

/*  withdraw  END  */
/* deposit */
export interface IDepositPendingListData {
  id: number
  order:number
  code: string
  account: string
  deposit_time: number
  application_time: number
  processing_time: number
  token: string
  deposit_type: string
  deposit_quantity: number
  from: number
}

/* deposit END */
/*  finance   */

export interface ICollectListData {
  application_time: number
  token: string
  type: string
  user_code: string
  collect_quantity: string
  collection_address: string
  chain_cost: string
  status: number
  remark: string
}

export interface ICollectAccountListData {
  token: string
  address: string
  balance: string
}

export interface IFeeProfitListData {
  token: string
  balance: string
  id: number
}

/*  finance  END  */
