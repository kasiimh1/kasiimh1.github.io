function getTokenPrice() {
    fetch('https://farmerapi.storx.io/get-asset-price')
    .then((resp) => resp.json())
    console.log(resp)
}