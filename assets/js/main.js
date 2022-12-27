mapboxgl.accessToken = 'pk.eyJ1IjoiZnJvc2Vub3ciLCJhIjoiY2xjNmJyYnI5MDAyMjNucWY0bW9oMzZtYiJ9.QILrch7pIvNYPQjNKRijuw';

// Getting user location
navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
    enableHighAccuracy: true 
})

// Setting user location on map if success
function successLocation(position){
    const center = [position.coords.longitude, position.coords.latitude]
    setupMap(center)
}

// Setting default location (Tucson, Arizona) on map if error 
function errorLocation(){
    setupMap([-110.911789,32.253460])
}

function setupMap(center){
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v12', // style URL
        center: center, // starting position [lng, lat]
        zoom: 12, // starting zoom
        });
    map.addControl(new mapboxgl.NavigationControl());
    const userMarker = new mapboxgl.Marker()
    .setLngLat(center)
    .addTo(map)
}


