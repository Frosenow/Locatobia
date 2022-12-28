// Setting up hidden API key
const placesAPIKey = config.API_KEY; 
const my_script = document.createElement('script');
my_script.setAttribute('src', `https://maps.googleapis.com/maps/api/js?key=${placesAPIKey}&libraries=places`);
document.body.appendChild(my_script);


// Getting user location
navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
    enableHighAccuracy: true, 
    timeout: 10000,
})

// Setting user location on map if success
function successLocation(position){ 
    const center = [position.coords.latitude, position.coords.longitude]
    setupMap(center)
    getPOI(position)

}

// Setting default location (Tucson, Arizona) on map if error 
function errorLocation(){
    setupMap([-110.911789,32.253460])
}

// Generating map image and adding marker with user current location
function setupMap(center){
    const map = L.map('map').setView(center, 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19, 
    }).addTo(map); 
    const userMarker = L.marker(center).addTo(map); 
}

// Getting list of places within given location and radius 
function getPOI(position){
    const location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    const request = {
        location: location,
        radius: '5000',
    };

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
}

// Displaying gathered list of places 
function callback(results, status){
    if(status == google.maps.places.PlacesServiceStatus.OK){
        for(let i = 0; i < results.length; i++)
            console.log(results[i])
    }
}


