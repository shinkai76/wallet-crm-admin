export const formatNumber = (num:number):string => {
  if (num)
    return num.toString().replace(/\B(?=(?:\d{3})+\b)/g, ',')
  else
    return '0'
}

export const formatTime = (timestamp:number):string => {
  if (!timestamp) return ''
  const date = new Date(timestamp * 1000);
  const Y = date.getFullYear() + '-';
  const M = (date.getMonth() + 1).toString().padStart(2, '0') + '-'
  const D = date.getDate().toString().padStart(2, '0') + ' ';
  const h = date.getHours().toString().padStart(2, '0') + ':'
  const m = date.getMinutes().toString().padStart(2, '0') + ':'
  const s = date.getSeconds().toString().padStart(2, '0')
  return Y + M + D + h + m + s;
}
