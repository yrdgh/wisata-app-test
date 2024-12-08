<template>
  <header class="header">
    <div class="header-left">
      <img :src="logoSrc" alt="Logo" class="logo" style="min-width: 197px;" />
    </div>

    <div class="header-center">
      <div class="search-bar w-full searchnav-width" style="border: none !important;">
        <button class="appsearchbar-btn v-btn v-btn--block v-btn--has-bg theme--light elevation-0 v-size--default" style="height:40px; max-width:70%;" @click="isPopupOpen = true">
          <span class="v-btn__content v-application">
            <i style="margin-right: 0.4em;" class="fas fa-magnifying-glass"></i>
            <span class="text-truncate" style="min-width:0; min-height:0;">{{ hotelDetails }}</span>
          </span>
        </button>
      </div>
    </div>

    <!-- Popup Window Search -->
    <div v-if="isPopupOpen" class="popup-overlay-top" @click.self="isPopupOpen = false; isPopupRoomOpen = false;">
      <div v-if="isPopupOpen" class="popup-overlay" @click.self="isPopupOpen = false; isPopupRoomOpen = false;">
        <div class="popup-content">
          <div class="location-input">
            <div class="input-container"
              @mouseover="onHoverLocation"
              @mouseleave="onLeaveLocation">
              <span class="location-label"
                :class="{ active: isFocusedLocation }">Where are you going?</span>
              <div class="location-label" style="top: 15px; left: 11px; font-size: 20px;"
                :class="{ active: isFocusedLocation }">
                <i class="fas fa-location-dot"></i>
              </div>
              <!-- @input="debouncedInputLocation" -->
              <!-- :options="locationOptions" -->
              <multiselect
                ref="selectLocation"
                v-model="selectedLocation"
                :options="locationOptions"
                track-by="id"
                label="label"
                placeholder="Search for hotels, apartments or villas"
                :loading="isLoading"
                @input="debouncedInputLocation"
                searchable
                clearable
                :style="{
                  width: '25em',
                  // width: '26em',
                  paddingTop: '5px',
                  paddingBottom: '11px !important',
                  paddingLeft: '20px',
                  // padding: '7px 100px 5px 25px',
                  borderRadius: '8px', 
                  border: locationBorderStyle, }"
                @open="onFocusLocation"
                @close="onBlurLocation"
              >
              
                <!-- Custom option slot for rendering multi-line options -->
                <template #option="{ option, search }">
                  <div>
                    <div v-if="option.location_type === 'HOTEL'"
                      class="location-type"
                      style="background-color: var(--bs-primary-bg-subtle); color: var(--bs-primary)">
                      <i class="icon-location fas fa-bed"></i>
                      <div style="display: inline;">{{ option.location_type }}</div>
                    </div>
                    <div v-else-if="option.location_type === 'POINT_OF_INTEREST'"
                      class="location-type">
                      <i class="icon-location fas fa-landmark"></i>
                      <div style="display: inline;">{{ option.location_type }}</div>
                    </div>
                    <div v-else-if="option.location_type === 'METRO_STATION' || option.location_type === 'TRAIN_STATION'"
                      class="location-type">
                      <i class="icon-location fas fa-bus"></i>
                      <div style="display: inline;">{{ option.location_type }}</div>
                    </div>
                    <div v-else-if="option.location_type === 'AIRPORT'"
                      class="location-type">
                      <i class="icon-location fas fa-location-dot"></i>
                      <div style="display: inline;">{{ option.location_type }}</div>
                    </div>
                    <div v-else class="location-type">
                      <i class="icon-location fas fa-city"></i>
                      <div style="display: inline;">{{ option.location_type }}</div>
                    </div>
                    <div v-html="highlightText(option.name, search)" style="margin-bottom: 5px; margin-top: 5px;"></div>
                    <div v-html="highlightText(option.name_suffix, search)" style="margin-bottom: 5px; font-size: 13px;"></div>
                  </div>
                </template>
              </multiselect>
              <button v-if="Object.keys(selectedLocation).length > 0 || searchLocation !== null" 
                class="clear-button"
                :class="{ active: isFocusedLocation }"
                @click="clearSelectedLocation">✖</button>
            </div>
          </div>

          <div class="dp-container"
            @mouseover="onHoverDatePicker"
            @mouseleave="onLeaveDatePicker">
            <span class="dp-label"
            :class="{ active: isFocusedDatePicker }">Check in - Check out</span>
            <!-- Date Range Picker -->
            <VueDatePicker
              v-model="dateRange"
              range
              :format="customFormat"
              :clearable="false"
              :style="{
                width: '13.4em',
                // top: '-81px',
                left: '435px',
                border: datePickerBorderStyle,
                paddingTop: '10px',
                paddingBottom: '10px',
                borderRadius: '8px',
                color: '#212121', }"
              @open="onFocusDatePicker"
              @blur="onBlurDatePicker"
            />
          </div>

          <div class="room-picker-container" @click="isPopupRoomOpen = !isPopupRoomOpen">
            <span class="room-picker-label"
              :class="{ active: isPopupRoomOpen }">Guests & Rooms</span>
            <button class="room-picker-btn"
              :class="{ active: isPopupRoomOpen }"
            >
              <div class="room-picker-icon" style="color: #757575; display: inline;" :class="{ active: isPopupRoomOpen }"><i class="fas fa-user-group" style="margin-right: 0.1em; margin-left: -12px;"></i></div>
              {{ roomValue }}</button>
          </div>

          <!-- Popup Window Room Picker -->
          <div v-if="isPopupRoomOpen" class="popup-overlay-guest-room" @click.self="isPopupRoomOpen = false">
            <div class="popup-content-guest-room">
              <div style="margin-top: 10px; color: #212121; margin-bottom: 5px;">{{ roomTitle }}</div>

              <div class="guest-picker">
                <button class="guest-btn-minus" @click="guestCounter('minus')">&ndash;</button>
                <div style="display: inline-block;">
                  <div style="margin-bottom: -5px;"><span style="font-size: 1.25rem; font-weight: medium; color: var(--bs-primary)">{{ guestSearch }}</span> guest<span v-if="guestSearch > 1">s</span>/room</div>
                  <button class="info-children-btn"><i class="fas fa-info-circle" style="margin-right: 0.4em;"></i>What about children?</button>
                </div>
                <button class="guest-btn-plus" @click="guestCounter('plus')">+</button>
              </div>

              <div class="room-picker">
                <button class="room-btn-minus" @click="roomCounter('minus')">&ndash;</button>
                <div style="width: 9em;"><span style="font-size: 1.25rem; font-weight: medium; color: var(--bs-primary)">{{ roomSearch }}</span> room<span v-if="roomSearch > 1">s</span></div>
                <button class="room-btn-plus" @click="roomCounter('plus')">+</button>
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <button class="search-btn" @click="performSearch"><i class="fas fa-magnifying-glass" style="margin-right: 0.4em"></i>Search</button>
        </div>
      </div>
    </div>

    <div class="header-right">
      <button class="signin-button">Sign in</button>
    </div>
  </header>
</template>
  
<script setup>
const logoSrc = '/logo.png';
const props = defineProps({
  appName: {
    type: String,
    default: 'Wisata App',
  },
  hotelName: {
    type: String,
    required: false,
  },
  hotelNameSuffix: {
    type: String,
    required: false,
  },
  checkin: {
    type: String,
    required: true,
  },
  checkout: {
    type: String,
    required: true,
  },
  hotelDetails: {
    type: String,
    required: false,
  },
  guest: {
    type: Number,
    required: true,
  },
  room: {
    type: Number,
    required: true,
  },
});

import { ref } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'; // Import the CSS for the picker
import { format } from 'date-fns';

import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.css';
import debounce from "lodash/debounce"; // Install lodash for debouncing

import { useRoute, useRouter } from 'vue-router';

const nuxtApp = useNuxtApp();  // Access Nuxt app context
const formatDateSearch = nuxtApp.$formatDateSearch; // Access the globally provided function
const formatGuestSearch = nuxtApp.$formatGuestSearch; // Access the globally provided function
const axiosRequest = nuxtApp.$axiosRequest; // Access the globally provided function

const isPopupOpen = ref(false);

const isPopupRoomOpen = ref(false);

// const { checkin, checkout, hotelName, hotelNameSuffix, guest, room } = props;

const locationOptions = ref([]); // Holds the options for the dropdown
const selectedLocation = ref({}); // Holds the selected value
const searchLocation = ref(null); // Holds the selected value
const isLoading = ref(false); // Controls the loading state

const selectLocation = ref(null);
const isFocusedLocation = ref(false);
const isFocusedDatePicker = ref(false);
const locationBorderStyle = ref('solid 1px #757575 !important');
const datePickerBorderStyle = ref('solid 1px #757575 !important');

const roomTitle = ref(null);
const roomValue = ref(null);
const guestSearch = ref(props.guest);
const roomSearch = ref(props.room);

const checkin = ref(props.checkin);
const checkout = ref(props.checkout);
const hotelName = ref(props.hotelName);
const hotelNameSuffix = ref(props.hotelNameSuffix);
const guest = ref(props.guest);
const room = ref(props.room);

const dateRange = ref([new Date(checkin.value), new Date(checkout.value)]); // Store the selected range (start and end dates)

const route = useRoute();
const router = useRouter();

const onFocusLocation = () => {
  isFocusedLocation.value = true;
  locationBorderStyle.value = 'solid 3px var(--bs-primary) !important';

  isPopupRoomOpen.value = false;
}

const onBlurLocation = () => {
  isFocusedLocation.value = false;
  locationBorderStyle.value = 'solid 1px #757575 !important';
}

const onHoverLocation = () => {
  if(!isFocusedLocation.value){
    locationBorderStyle.value = 'solid 1px black !important';
  }
}

const onLeaveLocation = () => {
  if(!isFocusedLocation.value){
    locationBorderStyle.value = 'solid 1px #757575 !important';
  }
}

const onFocusDatePicker = () => {
  isFocusedDatePicker.value = true;
  datePickerBorderStyle.value = 'solid 3px var(--bs-primary) !important';

  isPopupRoomOpen.value = false;
}

const onBlurDatePicker = () => {
  isFocusedDatePicker.value = false;
  datePickerBorderStyle.value = 'solid 1px #757575 !important';
}

const onHoverDatePicker = () => {
  if(!isFocusedDatePicker.value){
    datePickerBorderStyle.value = 'solid 1px black !important';
  }
}

const onLeaveDatePicker = () => {
  if(!isFocusedDatePicker.value){
    datePickerBorderStyle.value = 'solid 1px #757575 !important';
  }
}

// Debounced version of the API call
const debouncedInputLocation = debounce((query) => {
  fetchDataLocation(query.target.value);
}, 300); // Adjust delay as needed (300ms is typical)

const fetchDataLocation = async (query) => {
  if (query.length <= 3) {
    locationOptions.value = []; // Clear results if search query is too short
    return;
  }

  isLoading.value = true;

  try {
    const params = {
      query: query
    };
    const response = await axiosRequest('GET', 'location/search', null, {}, params);

    locationOptions.value = response.map((item) => ({
      id: item.id, // Unique identifier for each item
      label: item.name + ', ' + item.name_suffix, // Display name in the dropdown
      value: item.id, // Bind this to v-model to get the selected value
      name: item.name, // Additional properties to display
      name_suffix: item.name_suffix, // Additional properties to display
      location_type: item.location_type.toUpperCase(), // Additional properties to display
    }));

    searchLocation.value = query;
  } catch (err) {
    console.error("Error fetching options:", err);
    locationOptions.value = [];
    searchLocation.value = null;
  } finally {
    isLoading.value = false;
  }
};

const clearSelectedLocation = () => {
  selectedLocation.value = {};
  searchLocation.value = null;
};

watch(isPopupOpen, (newVal) => {
  if (newVal) {
    openPopup();
    // document.body.style.overflow = 'hidden';
  }else{
    // document.body.style.overflow = '';
  }
});

watch(isPopupRoomOpen, (newVal) => {
  if (newVal) {
    openPopupRoom();
  }
});

const openPopup = () => {
  if(hotelName.value && hotelNameSuffix.value){
    selectedLocation.value = {
      id: 0, // Unique identifier for each item
      label: hotelName.value + ', ' + hotelNameSuffix.value, // Display name in the dropdown
      value: '', // Bind this to v-model to get the selected value
      name: hotelName.value, // Additional properties to display
      name_suffix: hotelName.value, // Additional properties to display
      location_type: 'HOTEL', // Additional properties to display
    };
  }

  dateRange.value = [new Date(checkin.value), new Date(checkout.value)];
  roomValue.value = formatGuestSearch(guest.value) + ' x ' + room.value;

  locationOptions.value = [];
  searchLocation.value = null;
};

const openPopupRoom = () => {
  roomTitle.value = formatGuestSearch(guest.value);
  roomValue.value = roomTitle.value + ' x ' + room.value;

  guestSearch.value = guest.value;
  roomSearch.value = room.value;
};

const guestCounter = (val) => {
  const min_guest = 1;
  const max_guest = 10;
  if(val == 'plus'){
    if(guestSearch.value < max_guest){
      guestSearch.value = parseInt(guestSearch.value) + 1;
    }
  }else{ //minus
    if(guestSearch.value > min_guest){
      guestSearch.value = parseInt(guestSearch.value) - 1;
    }
  }
  roomTitle.value = formatGuestSearch(guestSearch.value);
  roomValue.value = roomTitle.value + ' x ' + roomSearch.value;
};

const roomCounter = (val) => {
  const min_room = 1;
  const max_room = 8;
  if(val == 'plus'){
    if(roomSearch.value < max_room){
      roomSearch.value = parseInt(roomSearch.value) + 1;
    }
  }else{ //minus
    if(roomSearch.value > min_room){
      roomSearch.value = parseInt(roomSearch.value) - 1;
    }
  }
  roomTitle.value = formatGuestSearch(guestSearch.value);
  roomValue.value = roomTitle.value + ' x ' + roomSearch.value;
};

const performSearch = () => {
  const checkinSearch = format(dateRange.value[0], 'yyyy-MM-dd');
  const checkoutSearch = format(dateRange.value[1], 'yyyy-MM-dd');
  router.push({
    name: route.name,
    params: {}, // Pass all current params
    query: { 
      checkin: checkinSearch,
      checkout: checkoutSearch,
      guest_per_room: guestSearch.value,
      number_of_room: roomSearch.value,
    }, // Optionally pass current query parameters
  });

  checkin.value = checkinSearch;
  checkout.value = checkoutSearch;
  guest.value = guestSearch.value;
  room.value = roomSearch.value;
  hotelName.value = selectedLocation.name;
  hotelNameSuffix.value = selectedLocation.name_suffix;

  isPopupRoomOpen.value = false; // Close the popup after performing the search
  isPopupOpen.value = false; // Close the popup after performing the search
};

const customFormat = (date) => {
  if(date[0] && date[1]){
    const dateStart = format(date[0], 'yyyy-MM-dd');
    const dateEnd = format(date[1], 'yyyy-MM-dd');
    const dateFormatted = formatDateSearch(dateStart, dateEnd);
  
    return dateFormatted;
  }
}

const highlightText = (text, search) => {
  if (!search) return text; // If no search term, return text as is

  const regex = new RegExp(`(${search})`, 'gi');
  return text.replace(regex, '<b>$1</b>'); // Wrap the search term with <b> tags
}
</script>
  
<style scoped>
.header {
  display: inline-flex;
  background-color: #ffffff;
  /* box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); */
  height: 4em;
  width: 100%;
  max-width: 980px;
  z-index: 10;
  position: sticky;
  top: 0;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.app-name {
  font-size: 1.5rem;
  font-weight: bold;
}

.header-center {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.search-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: none !important;
}

.header-right {
  display: flex;
  align-items: center;
}

.signin-button {
  background-color: #1A73E8;
  color: white;
  /* padding: 10px 20px; */
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  /* width: 6em; */
  height: 36px;
  min-width: 64px;
  padding: 0 16px;
  font-size: .875rem;
}

.signin-button:hover {
  background-color: #0056b3;
}

.searchnav-width {
    max-width: 590px;
}

.w-full {
    width: 100%!important;
}

button {
    appearance: auto;
    text-rendering: auto;
    color: buttontext;
    letter-spacing: normal;
    word-spacing: normal;
    line-height: normal;
    text-transform: none;
    text-indent: 0px;
    text-shadow: none;
    display: inline-block;
    text-align: center;
    align-items: flex-start;
    cursor: pointer;
    box-sizing: border-box;
    background-color: buttonface;
    margin: 0em;
    padding-block: 1px;
    padding-inline: 6px;
    border-width: 2px;
    border-style: outset;
    border-color: buttonborder;
    border-image: initial;
}

.v-btn {
    align-items: center;
    border-radius: 4px;
    display: inline-flex;
    flex: 0 0 auto;
    font-weight: 500;
    justify-content: center;
    letter-spacing: -.125;
    outline: 0;
    position: relative;
    -webkit-text-decoration: none;
    text-decoration: none;
    text-indent: -.125;
    text-transform: none;
    transition-duration: .28s;
    transition-property: box-shadow,transform,opacity;
    transition-timing-function: cubic-bezier(.4,0,.2,1);
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    vertical-align: middle;
    white-space: nowrap;
    border: none;
}

.appsearchbar-btn .v-btn__content {
    line-height: 1;
    width: 100%;
}

.v-btn__content {
    align-items: center;
    color: inherit;
    display: flex;
    flex: 1 0 auto;
    justify-content: inherit;
    line-height: normal;
    position: relative;
    transition: inherit;
    transition-property: opacity;
}

.v-btn--block {
    display: flex;
    flex: 1 0 auto;
    max-width: none;
    min-width: 100%!important;
}

.theme--light.v-btn.v-btn--has-bg {
    background-color: #f5f5f5;
}

.theme--light.v-btn {
    color: rgba(0,0,0,.87);
}

.v-application .elevation-0 {
    box-shadow: 0 0 0 0 rgba(0,0,0,.2),0 0 0 0 rgba(0,0,0,.14),0 0 0 0 rgba(0,0,0,.12)!important;
}

.v-btn.v-size--default, .v-btn.v-size--large {
    font-size: .875rem;
}

.v-application .text-truncate {
    overflow: hidden!important;
    text-overflow: ellipsis!important;
    white-space: nowrap!important;
    font-weight: 500;
}

/* Popup Overlay */
.popup-overlay-top {
  position: fixed;
  top: 0;
  left: 0;
  width: 9999px;
  min-height: 100vh;
  /* background: blue; */
  /* display: flex; */
  justify-content: center;
  align-items: center;
  z-index: 2;
}

.popup-overlay {
  position: fixed;
  top: 65px;
  left: 0;
  width: 9999px;
  min-height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  /* display: flex; */
  justify-content: center;
  align-items: center;
  z-index: 1;
}

/* Popup Content */
.popup-content {
  position: fixed;
  top: 110px;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  text-align: center;
  height: 100px;
  width: 100%;
  max-width: 980px;
  z-index: 5;
  box-shadow: 2px 1px -1px rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 1px 3px 0 rgba(0,0,0,.12) !important;
}

.location-input {
  max-width: 400px;
  margin-left: -530px !important;
  display: inline;
}

.input-container {
  position: relative;
  display: inline-block;
  height: 90px;
  /* border: solid 1px green;
  background-color: orange; */
}

.input-container .clear-button {
  border-radius: 9999px;
  background: #757575;
  border: none;
  font-size: 14px;
  cursor: pointer;
  color: white;
  position: relative;
  display: block;
  /* margin-top: -35px; */
  top: -40px;
  left: 27.5em;
  z-index: 53;
  padding: 1px 6px 3px 6px;
  /* margin-right: -500px !important; */
  /* left: 0; */
}

.input-container .clear-button.active {
  background: var(--bs-primary);
}

.location-label {
  /* border-radius: 9999px; */
  background: white;
  color: #757575;
  width: auto;
  border: none;
  font-size: 12px;
  font-weight: 500;
  cursor: default;
  position: absolute;
  z-index: 51;
  /* display: block; */
  top: -7px;
  left: 11px;
  padding-left: 2px;
  padding-right: 2px;
}

.location-label.active {
  color: var(--bs-primary);
}

.location-field {
  width: 100%;
  padding: 12px 30px 12px 10px;
  border-radius: 20px;
  border: 1px solid #ccc;
  font-size: 14px;
  color: #333;
}

.selected-location {
  margin-top: 10px;
  color: #333;
  font-size: 16px;
}

.location-type {
  margin-bottom: 2px;
  border-radius: 4px;
  font-size: 10px;
  width: auto;
  display: inline-flex;
  padding: 5px 8px 2px 8px;
  background-color: var(--bs-success-bg-subtle); 
  color: var(--bs-success)
}

.icon-location {
  margin-right: 0.4em;
  margin-top: 0.2em;
  display: inline;
}

:deep(.multiselect__option) {
  /* background: white !important; */
  background: white !important;
  color: #212121 !important;
  padding-left: 30px;
}

:deep(.multiselect__content-wrapper) {
  max-height: var(--multiselect-height, 470px) !important;
  overflow-y: auto;
  margin-left: -20px;
}

/* Change the hover color for the dropdown options */
:deep(.multiselect__option--highlight),
:deep(.multiselect__option--highlight::after) {
  background: #F6F6F6 !important;
  color: #212121 !important;
}

:deep(.multiselect__option--selected),
:deep(.multiselect__option--selected::after) {
  background: #C1E1C1 !important;
  color: #212121 !important;
}

/* selected item dropdown options */
:deep(.multiselect__option--selected.multiselect__option--highlight.multiselect__option),
:deep(.multiselect__option--selected.multiselect__option--highlight::after) {
  background: #FAA0A0 !important;
  color: #212121 !important;
}

:deep(.multiselect__tags) {
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 27em;
  border: none;
}

/* dropdown button */
:deep(.multiselect__select) {
  display: none !important;
}

:deep(.multiselect__single),
:deep(.multiselect__input) {
  padding: 7px 100px 0px 10px;
  width: 23em;
  z-index: 53;
  /* border: none; */
  /* border: solid 1px; */
}

:deep(.dp__input) {
  border: none;
}

.dp-container {
  position: relative;
  display: block;
  top: -90px;
  margin-left: -11px;
  /* border: solid 1px blue; */
}

.dp-label {
  /* border-radius: 9999px; */
  background: white;
  color: #757575;
  width: auto;
  border: none;
  font-size: 12px;
  font-weight: 500;
  cursor: default;
  position: absolute;
  z-index: 51;
  /* display: block; */
  top: -8px;
  left: 445px;
  padding-left: 2px;
  padding-right: 2px;
}

.dp-label.active {
  color: var(--bs-primary);
}

.date-picker-search {
  display: inline;
  width: 10px !important;
}

.room-picker-container {
  position: relative;
  display: inline-block;
  margin-left: -5px;
  top: -130px;
  left: 200px;
  /* border: solid 1px blue; */
}

.room-picker-label {
  /* border-radius: 9999px; */
  background: white;
  color: #757575;
  width: auto;
  white-space: nowrap;
  border: none;
  font-size: 12px;
  font-weight: 500;
  cursor: default;
  position: absolute;
  z-index: 51;
  /* display: block; */
  top: -43px;
  left: -10px;
  padding-left: 2px;
  padding-right: 2px;
  pointer-events: none;
  z-index: 54;
}

.room-picker-label.active {
  color: var(--bs-primary);
}

.room-picker-icon.active {
  color: var(--bs-primary) !important;
}

.room-picker-btn {
  position: absolute;
  width: 180px;
  top: -35px;
  left: -20px;
  padding-top: 19px;
  padding-bottom: 18px;
  padding-left: 17px;
  border-radius: 8px;
  background: white;
  color: #212121;
  border: solid 1px #757575;
  z-index: 53;
}

.room-picker-btn.active {
  border: solid 3px var(--bs-primary) !important;
}

.room-picker-btn:hover:not(:focus) {
  border: solid 1px black !important;
}

.popup-overlay-guest-room {
  position: fixed;
  top: 0;
  left: 0;
  width: 1980px;
  min-height: 100vh;
  background: transparent;
  /* display: flex; */
  justify-content: center;
  align-items: center;
  z-index: 52;
}

.popup-content-guest-room {
  position: absolute;
  top: 90px;
  left: 665px;
  width: 280px !important;
  background: white;
  margin: 0 auto;
  /* padding: 20px; */
  border-radius: 8px;
  /* border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px; */
  text-align: center;
  height: 180px;
  z-index: 52;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.guest-picker {
  display: inline-flex;
  margin-bottom: -20px;
}

.guest-btn-minus{
  border-radius: 9999px;
  margin-top: -6px;
  margin-bottom: 36px;
  margin-left: -20px;
  margin-right: 20px;
  padding: 3px 12px 5px 12px;
  border: none;
  font-size: 25px;
  font-weight: 600;
  color: #757575;
  background-color: transparent;
  cursor: pointer;
  z-index: 53;
}

.guest-btn-minus:hover{
  background-color: #f0f0f0;
}

.guest-btn-plus{
  border-radius: 9999px;
  margin-top: -6px;
  margin-bottom: 36px;
  margin-left: 20px;
  margin-right: -20px;
  padding: 5px 12px 5px 12px;
  border: none;
  font-size: 25px;
  font-weight: 500;
  color: var(--bs-primary);
  background-color: transparent;
  cursor: pointer;
  z-index: 53;
}

.guest-btn-plus:hover{
  background-color: var(--bs-primary-bg-subtle);
}

.room-picker {
  margin-top: 10px;
  padding-top: 22px;
  border-top: solid thin #ddd;
  display: inline-flex;
  margin-bottom: -20px;
  height: 70px;
  border: solid 1px blue;
}

.room-btn-minus{
  border-radius: 9999px;
  margin-top: -6px;
  margin-bottom: 36px;
  margin-left: -20px;
  margin-right: 20px;
  padding: 3px 12px 5px 12px;
  border: none;
  font-size: 25px;
  font-weight: 600;
  color: #757575;
  background-color: transparent;
  cursor: pointer;
  z-index: 53;
}

.room-btn-minus:hover{
  background-color: #f0f0f0;
}

.room-btn-plus{
  border-radius: 9999px;
  margin-top: -6px;
  margin-bottom: 36px;
  margin-left: 20px;
  margin-right: -20px;
  padding: 5px 12px 5px 12px;
  border: none;
  font-size: 25px;
  font-weight: 500;
  color: var(--bs-primary);
  background-color: transparent;
  cursor: pointer;
  z-index: 53;
}

.room-btn-plus:hover{
  background-color: var(--bs-primary-bg-subtle);
}

.info-children-btn {
  background-color: transparent;
  color: #757575;
  font-size: .75rem;
  border: none;
}

.search-btn {
  position: absolute;
  display: inline-block;
  width: 110px;
  top: 22px;
  left: 857px;
  padding-top: 19px;
  padding-bottom: 18px;
  /* padding-left: 17px; */
  border-radius: 8px;
  border: none;
  background: #1A73E8;
  color: white;
  z-index: 53;
}
</style>
  