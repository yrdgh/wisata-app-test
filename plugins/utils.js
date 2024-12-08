import { format } from 'date-fns';
import axios from 'axios';

export default defineNuxtPlugin(nuxtApp => {
  // Function http request axios
  const axiosRequest = async (method, url, data = null, headers = {}, params = null) => {
    const server_url = 'https://project-technical-test-api.up.railway.app/'; // Development URL
    // const server_url = 'https://'; // Live URL
    url = server_url + url; // Construct the full URL

    try {
      const response = await axios({
        method, // HTTP method (GET, POST, PUT, DELETE, etc.)
        url,    // The endpoint you want to request
        data,   // The request body (for POST, PUT, etc.)
        headers,// Any additional headers if needed
        params, // Query parameters (for GET and others)
      });

      return response.data; // Return only the response data
    } catch (error) {
      console.error('API Request Error:', error.response || error); // Log the error
      throw error; // Rethrow for further handling in components or utilities
    }
  };
  nuxtApp.provide('axiosRequest', axiosRequest);

  // Function to capitalize the first letter of each word
  nuxtApp.provide('capitalizeWords', (str) => {
      return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
  });

  // Function to format date search
  nuxtApp.provide('formatDateSearch', (dateStart, dateEnd) => {
      const dateStartYear = format(dateStart, 'yyyy');
      const dateEndYear = format(dateEnd, 'yyyy');
      const dateStartMonth = format(dateStart, 'MM');
      const dateEndMonth = format(dateEnd, 'MM');
      const dateStartDay = format(dateStart, 'd');
      let value = null;
      if(dateStartYear == dateEndYear && dateStartMonth == dateEndMonth){ //1 - 3 Dec 2024
          dateEnd = format(dateEnd, 'd MMM yyyy');

          value = dateStartDay + ' \u2013 ' + dateEnd;
      }else if(dateStartYear == dateEndYear && dateStartMonth != dateEndMonth){ //31 Nov - 1 Dec 2024
          dateStart = format(dateStart, 'd MMM');
          dateEnd = format(dateEnd, 'd MMM yyyy');

          value = dateStart + ' \u2013 ' + dateEnd;
      }else{ //31 Dec 2024 - 1 Jan 2025
          dateStart = format(dateStart, 'd MMM yyyy');
          dateEnd = format(dateEnd, 'd MMM yyyy');

          value = dateStart + ' \u2013 ' + dateEnd;
      }
      return value;
  });

  nuxtApp.provide('formatGuestSearch', (guest) => {
    let value = 'Group of ' + guest;
    if(guest == 1){
      value = 'Single Room';
    }else if(guest == 2){
      value = 'Double Room';
    }else if(guest == 3){
      value = 'Triple Room';
    }
    return value;
  });

  // You can add more utility functions here

});
  