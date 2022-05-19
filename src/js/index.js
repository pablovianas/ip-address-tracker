const formResults = $('form')[0];
const mapContainer = $('#map');
const hideIspContainer = $('.isp-informations')[0];


formResults.addEventListener('submit', (e)=> {

    e.preventDefault();
    const ipAdressInput = $('#ipAdress').val();
    mapContainer.remove();
    updateInformationsFromInput(ipAdressInput);
    
})

hideIspContainer.addEventListener('mouseleave', ()=>{
   
    if (hideIspContainer.classList.contains('hidden')){
        hideIspContainer.classList.remove('hidden')  
    }else{
        hideIspContainer.classList.add('hidden') 
    }
    
})

$(document).ready(function () {
    firstLoadUpdateInformations();
});

/**
 * Function to update dom informations from api when page load for first time
 */

const firstLoadUpdateInformations = async () => {

    const ipAddressInfo = await fetch('https://ipapi.co/json/');
    const responseAdressInfoJson = await ipAddressInfo.json();

    if (responseAdressInfoJson.error === true) return;

    updateDivIspInformations(responseAdressInfoJson);
    
    loadMap(responseAdressInfoJson.latitude, responseAdressInfoJson.longitude);
}

/**
 * A function to fetch internet informations from ipapi using ip address parameter 
 * @param {*} ipAddress 
 */

const updateInformationsFromInput = async (ipAddress) => {

    const ipAddressInfo = await fetch(`https://ipapi.co/${ipAddress}/json/`);

    const responseAdressInfoJson = await ipAddressInfo.json();

    if (responseAdressInfoJson.error === true){
        Snackbar.show({
            text: responseAdressInfoJson.reason,
            textColor: '#FFFFFF',
            actionTextColor: '#99ccff',
            pos: 'top-center',
        });
        return;
    }

    updateDivIspInformations(responseAdressInfoJson);

    if (mapContainer){
        $('#map').remove();
        $('<div id="map"></div>').appendTo('.container');

        loadMap(responseAdressInfoJson.latitude, responseAdressInfoJson.longitude);        
    }
    
}

/**
 * A function to load a leafletjs map 
 * @param {*} latitude  
 * @param {*} longitude 
 */

const loadMap = (latitude, longitude) => {
    var map = L.map('map').setView([latitude, longitude], 13);

    map.removeControl(map.zoomControl);

    L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=ZMC2vbaRrQUSdjPg9fm3', {
        attribuition: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
    }).addTo(map);

    L.marker([latitude, longitude]).addTo(map);
}

/**
 * A function to update isp information div elements after form submit event
 * @param {*} responseAdressInfoJson 
 */

const updateDivIspInformations = (responseAdressInfoJson) =>{

    let timezoneUpdated = convertUtcStringToTime(responseAdressInfoJson)
  
    $('#ip').html(responseAdressInfoJson.ip);
    $('#location').html(responseAdressInfoJson.city);
    $('#timezone').html(timezoneUpdated);
    $('#org').html(responseAdressInfoJson.org);

}

/**
 * A function to return a coverted string to time format e.g (1000 -> 10:00)
 * @param {*} responseAdressInfoJson 
 * @returns timezone string updated
 */
const convertUtcStringToTime = (responseAdressInfoJson) =>{
    const originalUtcString = responseAdressInfoJson.utc_offset;

    const editedUtcTimeWithColon = originalUtcString.replace(/\b(\d{1,2})(\d{2})/g, '$1:$2');

    let timezoneUpdated = `<span> UTC ${editedUtcTimeWithColon} </span>`;

    return timezoneUpdated;

}