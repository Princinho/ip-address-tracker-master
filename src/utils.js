export async function getIpLocation(ip) {
    let adress = 'https://geo.ipify.org/api/v2/country,city?apiKey=at_JYwJ9SSMfIVJnokFn1qy8gbhfKECe'
    if (ip) {
        adress += `&ipAddress=${ip}`
    }
    let response = await fetch(adress)
    let json = await response.json()
    console.log(json)
    return json
}