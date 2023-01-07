let response = window.sessionStorage.getItem('nearbyPlaces')
response = JSON.parse(response)
console.log(response)

response.forEach(element => console.log(element.name))
