'use strict';

const apiKey = 'afdd760df5788d51bb3e5fb26eaabe8f37b02d9d';
const searchURL = 'https://calendarific.com/api/v2/holidays'

function watchLearnMore() {
    $('a').submit(event => {
        event.preventDefault();
        const holiday = $('#js-search-term').val();
        getHolidays(year, religion);
      });
}

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
  }

function displayResults(responseJson, religion) {
    $('#results-list').empty();


    for (let i = 0; i < responseJson.response.holidays.length; i++) {
       if (responseJson.response.holidays[i].type == religion) {
            $('#results-list').append(
                `<li><h3>${responseJson.response.holidays[i].name}</h3>
                <p>${responseJson.response.holidays[i].date.iso}</p>
                <p>${responseJson.response.holidays[i].description}</p>
                <a href=''>Learn More</a>
                </li>`
                
            );
        };

    };

    
    $('#results').removeClass('hidden');

    $(watchLearnMore);
};

function getHolidays(year, religion) {
    const params = {
        api_key : apiKey,
        country : 'us',
        year : year
    };
    const queryString = formatQueryParams(params) ;
    const url = searchURL + '?' + queryString;

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