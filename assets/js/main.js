// TO AVOID "UNCAUGHT REFERENCE ERROR" API SCRIPT SHOULD BE LOADED BEFEROE MAIN JS SCRIPT (!)
//THIS METHOD IS TEMPORARY, TO PROTECT API KEY 
// Setting up hidden API key
const placesAPIKey = config.API_KEY;

// Appendig script with GoogleMapAPI and Places Library to html DOM to prevent API key for leaking 
const scriptAPI = document.createElement('script')
scriptAPI.setAttribute('src', `https://maps.googleapis.com/maps/api/js?key=${placesAPIKey}&v=weekly&libraries=places&callback=initMap`)
document.body.appendChild(scriptAPI)

// Getting user location
navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
    enableHighAccuracy: true, 
    timeout: 10000,
})

// Setting user location on map if success
function successLocation(position){ 
    const userPosition = [position.coords.latitude, position.coords.longitude]
    initMap({lat: userPosition[0], lng: userPosition[1]})
    getPOI(userPosition, 10000)
}

// Setting default location (Tucson, Arizona) on map if error 
function errorLocation(){
    initMap([-110.911789,32.253460])
}

// Generating map image and adding marker with user current location
function initMap(userPosition){
    const mapDiv = document.getElementById("map")
    const map = new google.maps.Map(mapDiv, {
        zoom: 15, 
        center: userPosition,   
    })

    const marker = new google.maps.Marker({
        position: userPosition,
        map: map, 
    })
}

// Getting list of places within given location and radius 
async function getPOI(position, radius){
        service = new google.maps.places.PlacesService(document.createElement('div'));
        coordinatesObj = new google.maps.LatLng(position[0],position[1])
        service.nearbySearch({
            location: coordinatesObj,
            radius: radius,
        }, callback)
}

function callback(results, status, next_page_token){
    
    window.sessionStorage.setItem('nearbyPlaces', JSON.stringify(results)) 
    if(status == google.maps.places.PlacesServiceStatus.OK){
        results.forEach(result => console.log(result))
    }else{
        console.log("PlaceService Error")
    }
    if(next_page_token.hasNextPage){
        // const pageToken = next_page_token.C
        // scriptAPI.setAttribute('src', `https://maps.googleapis.com/maps/api/js?key=${placesAPIKey}&v=weekly&libraries=places&callback=initMap&pagetoken=${pageToken}`) 
        // console.log(pageToken)
    }
}

// RANGE SLIDER 

let slider = document.getElementById('slider')
let selector = document.getElementById('selector')
let selectValue = document.getElementById('selectValue')
let progressBar = document.getElementById('progressBar')

selectValue.innerHTML = slider.value

slider.oninput = function() {
  selectValue.innerHTML = this.value
  selector.style.left = this.value + '%'
  progressBar.style.width = this.value + '%'
}
