
const places = JSON.parse(window.sessionStorage.getItem('nearbyPlaces'))


// Scrap all categories of places nearby and format them  
function defineCategories(){
    const categories = []; 
    places.forEach(place => {
        place.types.forEach(type => {
            const typeName = type.toUpperCase().split('_').join(' ')
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
        // Create main ul with category title 
        ulHeaderElement = document.createElement('li')
        ulHeaderElement.setAttribute('class', 'category-header')
        ulHeaderElement.innerText = String(category)
        ulElement.appendChild(ulHeaderElement)
        // Create  dropdown ul for storing places 
        ulDropdown = document.createElement('ul')
        ulDropdown.setAttribute('class', `dropdown ${category}`)
        ulHeaderElement.appendChild(ulDropdown)

        // Add all li's places to dropdown ul 
        const placesArr = appendPlaces(places, category)
        console.log(placesArr, category)
        placesArr.forEach(place => {
            liPlace = document.createElement('li') 
            liPlace.innerText = place.name
            ulDropdown.appendChild(liPlace)
        })
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
