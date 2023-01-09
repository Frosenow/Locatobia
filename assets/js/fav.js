// Setting up hidden API key
const placesAPIKey = config.API_KEY;

// Appendig script with GoogleMapAPI and Places Library to html DOM to prevent API key for leaking 
const scriptAPI = document.createElement('script')
scriptAPI.setAttribute('src', `https://maps.googleapis.com/maps/api/js?key=${placesAPIKey}&callback=getPlacesDetails&libraries=places&v=weekly`)
document.head.appendChild(scriptAPI)

async function getPlacesDetails() {
    const placesDetails = [];
    service = new google.maps.places.PlacesService(document.createElement('div'));
    for (const place of favPlaces) {
      const request = {
        placeId: place.place_id,
        fields: ['adr_address', 'rating', 'formatted_phone_number', 'opening_hours', 'photo', 'place_id']
      };
      const placeDetail = await new Promise((resolve, reject) => {
        service.getDetails(request, (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            resolve(place);
          } else {
            reject(status);
          }
        });
      });
      placesDetails.push(placeDetail);
    }
  
    console.log(placesDetails);
    await attachPlaces(favPlaces);
  }

const favPlaces = JSON.parse(window.localStorage.getItem('favPlaces'))


function attachPlaces(databaseContent){
    const cardHolder = document.querySelector('.card-holder')
    databaseContent.forEach(async element => {
        const card = document.querySelector('template')
        .content
        .cloneNode(true)

        let cardElement = await setInformations(card, element)
        cardHolder.appendChild(cardElement)
    })
}

function setInformations(cardNode, placeElement){
    cardNode.querySelector('.category').innerText = placeElement.name 
    return cardNode
}


