// Setting up hidden API key
const placesAPIKey = config.API_KEY; 

// Getting user location
navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
    enableHighAccuracy: true, 
    timeout: 10000,
})

// Setting user location on map if success
function successLocation(position){ 
    const userPosition = [position.coords.latitude, position.coords.longitude]
    initMap({lat: userPosition[0], lng: userPosition[1]})
    const LatLng = `${userPosition[0]},${userPosition[1]}`
    getPOI(LatLng, 1000)
}

// Setting default location (Tucson, Arizona) on map if error 
function errorLocation(){
    initMap([-110.911789,32.253460])
}

// Generating map image and adding marker with user current location
function initMap(userPosition){
    const mapDiv = document.getElementById("map")
    const map = new google.maps.Map(mapDiv, {
        zoom: 12, 
        center: userPosition,   
    })

    const marker = new google.maps.Marker({
        position: userPosition,
        map: map, 
    })
}

// Getting list of places within given location and radius 
async function getPOI(position, radius){

        const URL = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${placesAPIKey}&location=${position}&radius=${radius}`;
        const res = await fetch(URL, {
            method: 'get',
            headers: {},
        })
        if(res.ok){
            const resJson = await res.json()
            console.log(...resJson.results)
        }else{
            console.log("FETCH: ERROR")
        }
}


