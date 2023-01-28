// TO AVOID "UNCAUGHT REFERENCE ERROR" API SCRIPT SHOULD BE LOADED BEFEROE MAIN JS SCRIPT (!)
//THIS METHOD IS TEMPORARY, TO PROTECT API KEY 
// Setting up hidden API key
const placesAPIKey = config.API_KEY;

// Rendering the map after the page is open
window.addEventListener('load', getLocation)

// Range Slider Elements
const slider = document.getElementById('slider')
const selector = document.getElementById('selector')
const selectValue = document.getElementById('selectValue')
const progressBar = document.getElementById('progressBar')

// Set Default value 
selectValue.innerHTML = slider.value

// Setting default radius
let searchRadius = slider.value;

slider.addEventListener('change', setRadius)

// Geting radius value from slider and then looking for places nearby
function setRadius(){
    searchRadius = this.value
    clearLocations()
    getLocation()
}

// Changes input value smoothly
slider.oninput = function() {
  selectValue.innerHTML = this.value 
  selector.style.left = (this.value/slider.max)*100 + '%'
  progressBar.style.width = (this.value/slider.max)*100 + '%'
}

// Appendig script with GoogleMapAPI and Places Library to HTML DOM to prevent API key for leaking 
const scriptAPI = document.createElement('script')
scriptAPI.setAttribute('src', `https://maps.googleapis.com/maps/api/js?key=${placesAPIKey}&v=weekly&libraries=places&callback=clearLocations`)
document.body.appendChild(scriptAPI)

// Clearing the sessionStorage to get current places
function clearLocations(){
    window.sessionStorage.clear()
}

// Getting user location
async function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(await successLocation, errorLocation, {
            enableHighAccuracy: true, 
            timeout: 10000,
        })
    } 
}

// Setting user location on map if success
async function successLocation(position){
    const userPosition = [position.coords.latitude, position.coords.longitude] 
    initMap({lat: userPosition[0], lng: userPosition[1]})
    getPOI(userPosition, searchRadius)
}

// Setting default location using IPAPI API
function errorLocation(){
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            const userPosition = [data.latitude, data.longitude]
            initMap({lat: userPosition[0], lng: userPosition[1]})
            getPOI(userPosition, searchRadius)
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
        addToFavourites(results)
        if(next_page_token){
            next_page_token.nextPage()
        }
    }else{
        console.log("PlaceService Error")
    }
}

// Getting all places (if there are any)
function getDataBaseStatus(){
    let placesStatus = []; 
    if(window.sessionStorage.key('nearbyPlaces')){
        placesStatus = [...JSON.parse(window.sessionStorage.getItem('nearbyPlaces'))]
        return placesStatus
    } else {
        return placesStatus
    }
}

// Method to update sessionStorage without deleting the files that are in specified key 
function addToFavourites(places){
    // Get current items from "database"
    const placesStatus = getDataBaseStatus()
    // Find that place by ID and add to SessionStorage if it isn't already 
   places.forEach(place => {
        if(placesStatus.every(elem => elem.place_id !== place["place_id"])){
            placesStatus.push(place)
            sessionStorage.setItem(`nearbyPlaces`, JSON.stringify(placesStatus))
        }
    })
}
