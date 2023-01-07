
const places = JSON.parse(window.sessionStorage.getItem('nearbyPlaces'))
console.log(places)


// This function scrap all categories of places nearby and format them  
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

function createHeaders(categories){
    const ulElement = document.getElementById('places-names')
    categories.forEach(category => {
        ulHeaderElement = document.createElement('li')
        ulHeaderElement.setAttribute('id', String(category))
        ulHeaderElement.innerText = String(category)
        ulElement.appendChild(ulHeaderElement)
    })
}

const items = defineCategories()
createHeaders(items)