
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

        // appendPlaces(places, category)

        // Add all li's places to dropdown ul 
        const placesArr = appendPlaces(places, category)
        placesArr.forEach(place => {
            liPlace = document.createElement('li') 
            liPlace.innerText = place.name
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

    // Lopp through collection-item lis 
    liNames.forEach(li => {
        //If matched 
        if(li.innerHTML.toUpperCase().indexOf(filterValue) > -1){
            li.style.display = '';
        } else {
            li.style.display = 'none';
        }
    })
}
