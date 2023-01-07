
const places = JSON.parse(window.sessionStorage.getItem('nearbyPlaces'))


// Scrap all categories of places nearby and format them  
function defineCategories(){
    const categories = []; 
    places.forEach(place => {
        place.types.forEach(type => {
            let typeName = type.toUpperCase().split('_').join(' ')
            if(!categories.includes(typeName)){
                categories.push(typeName)
            }
        })
    })
    return categories
}

// Create categories headers and html elements to render it on page dynamically
function createHeaders(categories){
    const ulElement = document.getElementById('places-names')
    categories.forEach(category => {
        ulHeaderElement = document.createElement('li')
        ulHeaderElement.setAttribute('id', String(category))
        ulHeaderElement.innerText = String(category)
        ulElement.appendChild(ulHeaderElement)
        appendPlaces(places, category)
    })
}

function appendPlaces(places, category){
    // Return list of all places that fits into category passed as argument
    return places.filter(place => place
        .types
        .includes(String(category)
        .toLowerCase()))
}

const items = defineCategories()
createHeaders(items)
