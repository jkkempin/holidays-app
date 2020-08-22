'use strict';

const calApiKey = 'afdd760df5788d51bb3e5fb26eaabe8f37b02d9d';
const calSearchURL = 'https://calendarific.com/api/v2/holidays';

function displaySearchResults(responseJson, holidayName) {
    console.log(responseJson);
    $(`.${holidayName}`).append(
        `<h4>${responseJson.query.search[0].title}</h4>
        <p>${responseJson.query.search[0].snippet}<p>`
    );
};


function getMoreInfo(holidayName) {

    fetch(`https://en.wikipedia.org/w/api.php?origin=*&action=query&list=search&format=json&srsearch=${holidayName}&srinterwiki=true`)
    .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(responseJson => displaySearchResults(responseJson, holidayName))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
};


function watchLearnMore() {
    $('a').on('click', event => {
        event.preventDefault();
        const holidayName = $(event.target).data('holidayname');
        console.log(holidayName)
        getMoreInfo(holidayName);
    });   
};

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
};

function displayResults(responseJson, religion) {
    $('#results-list').empty();

    for (let i = 0; i < responseJson.response.holidays.length; i++) {

       if (responseJson.response.holidays[i].type == religion) {
            $('#results-list').append(
                `<li><h3>${responseJson.response.holidays[i].name}</h3>
                    <div class= ${responseJson.response.holidays[i].name}>
                        <p>${responseJson.response.holidays[i].date.iso}</p>
                        <p>${responseJson.response.holidays[i].description}</p>
                        <a data-holidayname= '${responseJson.response.holidays[i].name}' class = 'learn-more' href=''>Learn More</a>
                        
                    </div>
                </li>`
                
            );
        };
    };
 
    $('#results').removeClass('hidden');

    $(watchLearnMore);
};

function getHolidays(year, religion) {
    const params = {
        api_key : calApiKey,
        country : 'us',
        year : year
    };
    const queryString = formatQueryParams(params) ;
    const url = calSearchURL + '?' + queryString;

    fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson, religion))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });

}

function watchForm() {
    $('form').submit(event => {
      event.preventDefault();
      const religion = $('#js-search-term').val();
      const year = $('#js-year-results').val();
      getHolidays(year, religion);
    });
}

$(watchForm);