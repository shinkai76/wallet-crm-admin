export const isValidUsername = (str: string) => ['admin', 'editor'].indexOf(str.trim()) >= 0

export const isExternal = (path: string) => /^(https?:|mailto:|tel:)/.test(path)

export const validateFee = (rule, value, callback) => {
  if (Number(value) <= 0 || isNaN(Number(value))) {
    callback(new Error('Must be greater than 0'))
  } else {
    callback()
  }
}
