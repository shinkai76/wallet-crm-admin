


export const isExternal = (path: string) => /^(https?:|mailto:|tel:)/.test(path)

export const validateFee = (rule:any, value:any, callback:any) => {
  if (Number(value) <= 0 || isNaN(Number(value))) {
    callback(new Error('Must be greater than 0'))
  } else {
    callback()
  }
}
