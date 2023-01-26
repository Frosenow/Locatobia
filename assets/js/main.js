// TO AVOID "UNCAUGHT REFERENCE ERROR" API SCRIPT SHOULD BE LOADED BEFEROE MAIN JS SCRIPT (!)
//THIS METHOD IS TEMPORARY, TO PROTECT API KEY 
// Setting up hidden API key
const placesAPIKey = config.API_KEY;
window.sessionStorage.clear()

// Appendig script with GoogleMapAPI and Places Library to html DOM to prevent API key for leaking 
const scriptAPI = document.createElement('script')
scriptAPI.setAttribute('src', `https://maps.googleapis.com/maps/api/js?key=${placesAPIKey}&v=weekly&libraries=places&callback=getLocation`)
document.body.appendChild(scriptAPI)


getLocation()
// Getting user location
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
            enableHighAccuracy: true, 
            timeout: 10000,
        })
    } 
}


// Setting user location on map if success
async function successLocation(position){ 
    const userPosition = [position.coords.latitude, position.coords.longitude]
    await initMap({lat: userPosition[0], lng: userPosition[1]})
    getPOI(userPosition, 1000)
}

// Setting default location using IPAPI API
function errorLocation(){
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            const userPosition = [data.latitude, data.longitude]
            initMap({lat: userPosition[0], lng: userPosition[1]})
            getPOI(userPosition, 1000)
    })
    .catch(error => {
    console.error("IPAPI Error:", error);
    });
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
function getPOI(position, radius){
        service = new google.maps.places.PlacesService(document.createElement('div'));
        coordinatesObj = new google.maps.LatLng(position[0],position[1])
        service.nearbySearch({
            location: coordinatesObj,
            radius: radius,
        }, callback)
}

function callback(results, status, next_page_token){
    if(status == google.maps.places.PlacesServiceStatus.OK){
        window.sessionStorage.setItem('nearbyPlaces', JSON.stringify(results)) 
        if(next_page_token){
            service.nearbySearch({
                location: coordinatesObj,
                radius: 100,
                pagetoken: next_page_token
            }, callback)
        }
    }else{
        console.log("PlaceService Error")
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
