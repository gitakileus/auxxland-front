export const shortenAddress = (address) => {
  if (!address) {
    return null
  }
  return (
    String(address).substring(0, 6) +
    '...' +
    String(address).substring(address.length - 6)
  )
}