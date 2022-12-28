// Getting user location
navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
    enableHighAccuracy: true, 
    timeout: 10000,
})

// Setting user location on map if success
function successLocation(position){
    const center = [position.coords.latitude, position.coords.longitude]
    setupMap(center)
}

// Setting default location (Tucson, Arizona) on map if error 
function errorLocation(){
    setupMap([-110.911789,32.253460])
}

function setupMap(center){
    console.log(center)
    const map = L.map('map').setView(center, 12);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19, 
    }).addTo(map); 
    const userMarker = L.marker(center).addTo(map); 
}


