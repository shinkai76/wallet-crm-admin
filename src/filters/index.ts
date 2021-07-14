export const formatNumber = (num:number):string => {
  if (num)
    return num.toString().replace(/\B(?=(?:\d{3})+\b)/g, ',')
  else
    return '0'
}
