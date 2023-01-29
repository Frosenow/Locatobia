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
}


// Clearing the sessionStorage to get current places
function clearLocations(){
    window.sessionStorage.clear()
}

// Getting user location and setting up API
async function getLocation(){

    // Avoid adding sciprt every time the function is invoked
    if(!document.querySelector('.api-key')){
        // Setting up hidden API key
        const placesAPIKey = config.API_KEY;

        // Appendig script with GoogleMapAPI and Places Library to HTML DOM to prevent API key for leaking 
        const scriptAPI = document.createElement('script')
        scriptAPI.setAttribute('class', 'api-key')
        scriptAPI.setAttribute('src', `https://maps.googleapis.com/maps/api/js?key=${placesAPIKey}&v=weekly&libraries=places&callback=clearLocations`)
        document.body.appendChild(scriptAPI)    
    }
    
    // Get user location
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
    // Create map element
    const mapDiv = document.getElementById("map")
    const map = new google.maps.Map(mapDiv, {
        zoom: 14, 
        center: userPosition,   
    });
    // Create marker in the place where user is located
    const marker = new google.maps.Marker({
        position: userPosition,
        map: map,
    });
    // Create circle with the user choosen radius
    const cityCircle = new google.maps.Circle({
        strokeColor: "#FCA311",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FCA311",
        fillOpacity: 0.25,
        map,
        center: userPosition,
        radius: Number(searchRadius), 
    });
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

// Set flag to get only first 20 results 
let recivedResults = true; 

// Callback function to generate next results (places)
function callback(results, status, next_page_token){
    if(status == google.maps.places.PlacesServiceStatus.OK){
        addToFavourites(results)
        if(next_page_token){
            next_page_token.nextPage()
        }

        // Get only the results with images
        const imgArr = []; 
        results.forEach(result => {
                if(result.photos && recivedResults){
                    imgArr.push(result)
                }
            })
        
        if(recivedResults){
            getRandIdx(imgArr)
        }
            recivedResults = false; 
    }else{
        console.log("PlaceService Error")
    }
}


// Get random placs to display them on a page 
function getRandIdx(places){
    if(places.length > 2){
        const randNums = []; 
        // Get 3 random places with image
        for(let i = 0; i < 3; i++){
            // Get random index of array of places
            let randIdx = Math.round(Math.random()*(places.length - 1));
            // Look for duplicates 
            if(randNums.includes(randIdx)){
                while(!randNums.includes(randIdx)){
                    randIdx = Math.round(Math.random()*5);
                }
                randNums.push(randIdx)
            } else {
                randNums.push(randIdx)
            }
        }
        attachPlaces(places, randNums)
    }else{
        attachPlaces(null, _)
        alert('No places found')
    }
    
}

async function attachPlaces(result, amount){
    if(result){
        const cardHolder = document.querySelector('.like-places')
        for(let i = 0; i < amount.length; i++){
            const card = document.querySelector('template')
            .content
            .cloneNode(true)

            let cardElement = await setInformations(card, result[amount[i]])
            cardHolder.appendChild(cardElement)
        }
    }
}

function setInformations(cardNode, element){
    cardNode.querySelector('.name').innerText = element.name
    cardNode.querySelector('.source-image').src = element.photos[0].getUrl()
    return cardNode
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
