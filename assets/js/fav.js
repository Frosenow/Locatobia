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
  
    await attachPlaces(favPlaces, placesDetails);
  }

const favPlaces = JSON.parse(window.localStorage.getItem('favPlaces'))

// Display info if there is no data in database 
if(favPlaces.length > 0){
  document.querySelector('.user-info').style.display = 'none';
}


function attachPlaces(databaseContent, placesDetails){
    const cardHolder = document.querySelector('.card-holder')
    databaseContent.forEach(async element => {
        const card = document.querySelector('template')
        .content
        .cloneNode(true)

        let cardElement = await setInformations(card, element, placesDetails)
        cardHolder.appendChild(cardElement)
    })
}

function setInformations(cardNode, placeElement, placesDetails){
    cardNode.querySelector('.name').innerText = placeElement.name 
    placesDetails.forEach(detail => {
      if(detail.place_id === placeElement.place_id){
        if(detail.photos){
          cardNode.querySelector('.source-image').src = detail.photos[0].getUrl()
        } else {
          cardNode.querySelector('.source-image').src = "assets/images/image_not_found.jpg"
        }
        if(detail.adr_address){
          cardNode.querySelector('.heading').innerHTML = detail.adr_address
        }
        if(detail.formatted_phone_number){
          cardNode.querySelector('.phone-num').innerText = `tel. ${detail.formatted_phone_number}`
        } 
        if(detail.rating){
          cardNode.querySelector('.rating').innerText = `Rating: ${detail.rating}`
        }
      }
    })
    return cardNode
}


