export const getCityCode = (address: string) => {
  const cityMap: Record<string, string> = {
    mumbai: 'BOM',
    delhi: 'DEL',
    bangalore: 'BLR',
    bengaluru: 'BLR',
    jaipur: 'JAI',
    goa: 'GOI',
    srinagar: 'SXR',
    agra: 'AGR',
    chennai: 'MAA',
    hyderabad: 'HYD',
    kolkata: 'CCU',
    pune: 'PNQ',
  }

  const lowerAddress = address.toLowerCase()
  for (const [city, code] of Object.entries(cityMap)) {
    if (lowerAddress.includes(city)) return code
  }

  return 'DEL' // fallback
}
