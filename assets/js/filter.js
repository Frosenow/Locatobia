
const places = JSON.parse(window.sessionStorage.getItem('nearbyPlaces'))
const favPlaces = JSON.parse(window.localStorage.getItem('favPlaces'))

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

function getDataBaseStatus(){
    let placesStatus = []; 
    if(window.localStorage.key('favPlaces')){
        placesStatus = [...JSON.parse(window.localStorage.getItem('favPlaces'))]
        return placesStatus
    } else {
        return placesStatus
    }
}

// Create categories headers and html elements to render it on page dynamically
function createHeaders(categories){
    const ulElement = document.getElementById('places-names')

    categories.forEach(category => {
        // Create main ul with category title 
        const ulHeaderElement = document.createElement('li')
        ulHeaderElement.setAttribute('class', 'category-header')
        
        const ulSpanCategory = document.createElement('span')
        ulSpanCategory.setAttribute('id', 'category-name')
        ulSpanCategory.innerText = String(category)
       
        ulElement.appendChild(ulHeaderElement)
        ulHeaderElement.appendChild(ulSpanCategory)

        // Create  dropdown ul for storing places 
        let ulDropdown = document.createElement('ul')
        ulDropdown.setAttribute('class', `dropdown ${category}`)
        ulHeaderElement.appendChild(ulDropdown)

        // Add all li's places to dropdown ul 
        const placesArr = appendPlaces(places, category)

        placesArr.forEach(place => {

            // Create Like icon 
            const aTag = document.createElement('a')
            aTag.setAttribute('href', '#/')
            aTag.setAttribute('class', 'like-btn')

             // Check if palce is in data base, and if true, change icon 
            let iconType = 'fa-regular';
            if(!isInDatabase(favPlaces, place)){
                iconType = 'fa-solid'
            }
            aTag.innerHTML = `<i class="${iconType} fa-bookmark"></i>`
            aTag.id = place.place_id
            // Create lis with places 
            const liPlace = document.createElement('li')
            
            // Append aTag with icon and span with place name
            liPlace.appendChild(aTag)

            const liSpan = document.createElement('span')
            liSpan.innerText = place.name
            liPlace.appendChild(liSpan)
            liPlace.setAttribute('class', 'place-name')
            // Append whole section to ul with category
            ulDropdown.appendChild(liPlace)
        })
    })
}

function appendPlaces(places, category){
    // Return list of all places that fits into category passed as argument
    const categoryFormat = category
    .split(' ')
    .join('_')
    .toLowerCase()
    
    return places.filter(place => place
        .types
        .includes(categoryFormat))
}

const categories = defineCategories()
createHeaders(categories)

// Get input element 
const filterInput = document.getElementById('filter-input')

// Add event listener 
filterInput.addEventListener('keyup', filterNames)

function filterNames(){
    // Get value of input 
    const filterValue = filterInput.value.toUpperCase() 
    
    //Get all lis with places in category 
    const liNames = document.querySelectorAll('.dropdown li')

    // Loop through collection-item lis 
    liNames.forEach(li => {
        //If matched 
        if(li.innerHTML.toUpperCase().indexOf(filterValue) > -1){
            li.style.display = '';
        } else {
            li.style.display = 'none';
        }
    })
}

const likeBtns = document.querySelectorAll('.like-btn')

likeBtns.forEach(btn => btn.addEventListener('click', saveLocation))

function saveLocation(target){
    if(target.currentTarget.getElementsByTagName('i')[0].className === 'fa-solid fa-bookmark'){
        target.currentTarget.getElementsByTagName('i')[0].className = 'fa-regular fa-bookmark'
        removeFromFavourites(target)
    } else {
        target.currentTarget.getElementsByTagName('i')[0].className = 'fa-solid fa-bookmark'
        addToFavourites(target) 
    } 
}

function addToFavourites(target){
    // Get current items from "database"
    const placesStatus = getDataBaseStatus()

    // Get ID of place 
    const places_id = target.currentTarget.id

    // Find that place by ID and add to LocalStorage if it isn't already 
   places.forEach(place => {
        if(place["place_id"] == places_id && placesStatus.every(elem => elem.place_id != places_id)){
            placesStatus.push(place)
            localStorage.setItem(`favPlaces`, JSON.stringify(placesStatus))
            // Ustawic to pozniej, gdy opracuje zmiane stylu dla elementow ktore sa w bazie
            location.reload()
        }
    })
}

function removeFromFavourites(target){
    const placesStatus = getDataBaseStatus()
    // Get ID of place
    const places_id = target.currentTarget.id 
    // Find that place by ID and remove from LocalStorage
    places.forEach(place => {
        if(place["place_id"] == places_id){
            const baseUpdate = placesStatus.filter(placeInDB => placeInDB.place_id != places_id)
            window.localStorage.setItem('favPlaces', JSON.stringify(baseUpdate))
        }  
    })
    location.reload()
}


function isInDatabase(Database, elem){
    if(Database)
        return Database.every(item => item.place_id !== elem.place_id)
    else 
        return false; 
}
