<template>
  <HotelInfo 
    :hotelId="hotelId"
    :hotelName="hotelName"
    :starRating="starRating"
    :category="category"
    :fullAddress="fullAddress"
    :reviewRating="reviewRating"
    :reviewCount="reviewCount"
    :hotelImage="hotelImage"
    :currentTab="currentTab"
  />
  
  <div class="tabs">
    <div class="tab-buttons">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="{'active': currentTab === tab.id}"
        @click="selectTab(tab.id)"
      >
        <i :class="tab.icon" style="margin-right: 0.3em; font-size: 1.1em;"></i> <span style="font-size: 0.9em;">{{ tab.name }}</span>
      </button>
    </div>

    <div class="tab-content">
      <div class="deals-filter" v-if="currentTab === 'tab1'">
        <div class="deals-filter-container">
          <div class="label-filter">
            <i style="margin-right: 0.4em;" class="fas fa-filter"></i>
            <span style="font-weight: 500; font-size: .9375rem; margin-right: 1em;">Filter rooms by</span>
          </div>

          <span v-if="activeFilters.length > 0" class="chip-button" style="border-color: #2563eb; color: #2563eb; padding-left: 10px; padding-right: 10px; margin-bottom: 1em;"
            @click="clearFilters">
            Clear All
            <span class="filter-count">
              {{ activeFilters.length }}
            </span>
          </span>
          
          <div class="deals-filter" v-for="filter in filters" :key="filter.id" style="display: inline;">
            <button
              class="chip-button"
              :class="{ 'active': filter.active }"
              @click="toggleFilter(filter.id)"
            >
              <i style="margin-right: 0.4em;" :class="filter.icon"></i> {{ filter.label }}
            </button>
          </div>
        </div>

        <div v-for="(room, index_room) in roomsData" :key="index_room" class="deals-content">
          <div class="room-container" style="width: 960px;">
            <div class="image-container" style="display: inline-block;"
              @click="openPopupDetails(index_room, room.room.id);">
              <span v-if="room.room.images && room.room.images.length > 0" v-for="(image, index_img) in room.room.images" :key="index_img">
                <img
                  v-if="index_img == 0"
                  :src="(imageError[index_room]?.[index_img] ? fallbackImage : image.links?.['350px']?.href) || fallbackImage"
                  alt="Deals Content"
                  @error="handleImageError(index_room, index_img)"
                  class="deals-image image-top"
                />
                <div v-if="index_img < 3 && index_img > 0" class="image-bottom-container">
                  <img
                    v-if="index_img < 3 && index_img > 0"
                    :src="(imageError[index_room]?.[index_img] ? fallbackImage : image.links?.['350px']?.href) || fallbackImage"
                    alt="Deals Content"
                    @error="handleImageError(index_room, index_img)"
                    class="deals-image image-bottom"
                  />
                </div>
                <div v-if="index_img == 3" class="image-bottom-container-last">
                  <img
                    v-if="index_img == 3"
                    :src="(imageError[index_room]?.[index_img] ? fallbackImage : image.links?.['350px']?.href) || fallbackImage"
                    alt="Deals Content"
                    @error="handleImageError(index_room, index_img)"
                    class="deals-image image-bottom-last"
                  />
                </div>
              </span>
              <p v-else>No images available for this room.</p>
            </div>

            <div class="label-see-photos"
              @click="openPopupDetails(index_room, room.room.id);">
              <i style="margin-right: 0.4em; font-size: 0.8rem;" class="fas fa-table-cells"></i>
              <span style="font-size: 0.7rem; font-weight: 500;">See Photos</span>
            </div>

            <div class="room-info-container">
              <div class="room-title-container">
                <div style="width: 520px; display: inline-block;">
                  <span style="font-size: 1.125rem; font-weight: 500; line-height: 1.5;">{{ room.room.name }}</span>
                </div>
                <button class="see-details-button"
                  @click="openPopupDetails(index_room, room.room.id);">See details</button>
                <div style="margin-top: -8px;">
                  <i style="margin-right: 0.4em; font-size: .8rem; color: gray;" class="fas fa-bed"></i>
                  <span v-for="(group, key) in room.room.bed_groups" :key="key"
                    style="font-size: .9375rem; font-weight: 400; margin-right: 15px;">{{ group.description }}</span>
                  <i style="margin-right: 0.4em; font-size: .8rem; color: gray;" class="fas fa-up-right-and-down-left-from-center"></i>
                  <span style="font-size: .9375rem; font-weight: 400;">{{ room.room.area.square_meters }} m<sup>2</sup></span>
                </div>
              </div>
              <div style="border-top: solid 1px #ddd;"></div>
            </div>

            <!-- popup details -->
            <div v-if="isPopupDetailsOpen" class="popup-overlay-details" @click="closePopupDetails">
              <div class="popup-details-container" @click.stop>
                <div class="popup-details-photos-container">
                  <div class="popup-details-photos">
                    <img :src="currentDetailsImage" alt="Popup Details" class="popup-image" />
                    <div class="popup-details-prev">
                      <button @click="prevDetailsImage"><i class="fas fa-chevron-left"></i></button>
                    </div>
                    <div class="popup-details-next">
                      <button @click="nextDetailsImage"><i class="fas fa-chevron-right"></i></button>
                    </div>
                  </div>
                  <div class="details-image-index-info">
                    {{ currentDetailsImageIndex + 1 }} / {{ detailsImage.length }}
                  </div>
                </div>
                <div class="popup-details-amenities">
                  <div style="text-align: left; margin-left: 25px; margin-top: 10px; margin-bottom: 10px; font-weight: 500; font-size: 1.125rem;">
                    <span>Room Details</span>
                    <button class="popup-details-close-btn" @click="closePopupDetails">✖</button>
                  </div>

                  <div style="border-top: solid 1px #ddd; overflow-y: scroll; max-height: 480px;">
                    <!-- details info -->
                    <div style="text-align: left; margin-left: 25px; margin-top: 10px;">
                      <div>
                        <span style="font-size: 1rem; font-weight: 600; line-height: 1.5;">{{ room.room.name }}</span>
                      </div>
                      <div style="margin-top: -3px;">
                        <i style="margin-right: 0.4em; font-size: .8rem; color: gray;" class="fas fa-bed"></i>
                        <span v-for="(group, key) in room.room.bed_groups" :key="key"
                          style="font-size: .9rem; font-weight: 400; margin-right: 15px;">{{ group.description }}</span>
                        <i style="margin-right: 0.4em; font-size: .8rem; color: gray;" class="fas fa-up-right-and-down-left-from-center"></i>
                        <span style="font-size: .9rem; font-weight: 400;">{{ room.room.area.square_meters }} m<sup>2</sup></span>
                      </div>
                    </div>

                    <div style="text-align: left; margin-left: 25px; margin-top: 15px; font-size: .9375rem; margin-bottom: 10px; font-weight: 600;">
                      Room Amenities
                    </div>
                    <div>
                      <span>
                        <ul v-if="room.room.amenities" v-for="(item, index_amenities) in room.room.amenities" :key="index_amenities">
                          <li style="text-align: left; margin-left: 15px; line-height: 1; margin-bottom: -8px; color: #757575; font-size: .85rem;">{{ item.name }}</li>
                        </ul>
                      </span>
                    </div>
                  </div>
                  
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="currentTab === 'tab2' || currentTab === 'tab3'">
        <NuxtPage />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';

import HotelInfo from '~/components/HotelInfo.vue';

const route = useRoute();
const router = useRouter();

const hotelId = useState('hotelId');
const hotelName = useState('hotelName');
const starRating = useState('starRating');
const category = useState('category');
const fullAddress = useState('fullAddress');
const reviewRating = useState('reviewRating');
const reviewCount = useState('reviewCount');
const hotelImage = useState('hotelImage');
const currentTab = useState('currentTab');
const roomsData = useState('roomsData');

const imageError = ref([]);

const isPopupDetailsOpen = ref(false);
const detailsImage = ref([]);
const currentDetailsImageIndex = ref(0);
// const selectedRoom = ref(null);

const currentDetailsImage = computed(() =>
  detailsImage.value[currentDetailsImageIndex.value]
);

// Open popup
function openPopupDetails(index, roomId) {
  // currentImageIndex.value = index;
  // document.body.style.overflow = 'hidden';
  isPopupDetailsOpen.value = true;

  currentDetailsImageIndex.value = 0;

  detailsImage.value = [];
  roomsData.value.forEach(item => {
    if (item.key === roomId) {
      item.room.images.forEach(image =>{
        detailsImage.value.push(image.links?.['1000px'].href);
      })
    }
  });
  // console.log(detailsImage.value);
}

// Close popup
function closePopupDetails() {
  // document.body.style.overflow = '';
  isPopupDetailsOpen.value = false;
  // currentImageIndex.value = null;
}

// Navigate to previous image
function prevDetailsImage() {
  if(currentDetailsImageIndex.value == 0){
    currentDetailsImageIndex.value = detailsImage.value.length - 1;
  }else{
    currentDetailsImageIndex.value -= 1;
  }
}

// Navigate to next image
function nextDetailsImage() {
  if(currentDetailsImageIndex.value == detailsImage.value.length - 1){
    currentDetailsImageIndex.value = 0;
  }else{
    currentDetailsImageIndex.value += 1;
  }
}

watch(
  roomsData,
  (newRoomsData) => {
    // console.log(newRoomsData);
    imageError.value = newRoomsData.map((room) => 
      room.room.images ? Array(room.room.images.length).fill(false) : []
    );
  },
  { immediate: true }
);

function handleImageError(roomIndex, imageIndex) {
  if (imageError.value[roomIndex]) {
    imageError.value[roomIndex][imageIndex] = true;
  }
}

const fallbackImage = '/fallback-image.png';

const tabs = [
  { id: 'tab1', name: 'DEALS', content: 'Content for Tab 1', icon: 'fas fa-tag' },
  { id: 'tab2', name: 'PHOTOS', content: 'Content for Tab 2', icon: 'fas fa-table-cells' },
  { id: 'tab3', name: 'INFO', content: 'Content for Tab 3', icon: 'fas fa-circle-info' },
];

const selectTab = (tabId) => {
  currentTab.value = tabId;

  // const hotelId = route.params.hotelId;
  // console.log(tabId);
  if(tabId == 'tab2'){
    // router.push(`/stay/${hotelId}/photos`);
    router.push({
      name: "stay-hotelId-photos",
      params: { ...route.params, ...route.query }, // Pass all current params
      query: { ...route.query }, // Optionally pass current query parameters
    });
  }else if(tabId == 'tab3'){
    // router.push(`/stay/${hotelId}/info`);
    router.push({
      name: "stay-hotelId-info",
      params: { ...route.params, ...route.query }, // Pass all current params
      query: { ...route.query }, // Optionally pass current query parameters
    });
  }else{
    // router.push(`/stay/${hotelId}`);
    router.push({
      name: "stay-hotelId",
      params: { ...route.params, ...route.query }, // Pass all current params
      query: { ...route.query }, // Optionally pass current query parameters
    });
  }
};

const filters = ref([
  { id: 'filter1', label: "Free Breakfast", icon: "fas fa-utensils", active: false },
  { id: 'filter2', label: "Free Cancellation", icon: "fa-regular fa-credit-card", active: false },
]);

let activeFilters = ref([]);
const toggleFilter = (id) => {
  const filter = filters.value.find((f) => f.id === id);
  if(filter.active){
    filter.active = false;
    activeFilters.value = activeFilters.value.filter((filterId) => filterId !== id);
  }else{
    filter.active = true;
    activeFilters.value.push(id);
  }
};

const clearFilters = () =>{
  activeFilters.value = [];
  filters.value.forEach((filter) => (filter.active = false));
}

function handleKeydown(event) {
  if (event.key === "Escape") {
    closePopupDetails();
  }
}

onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
});
</script>

<style>
.dates, .details {
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.tabs {
  width: 100%;
  max-width: 980px;
  margin: 0 auto;
  border-top: 1px solid #ddd;
}

.tab-buttons {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1em;
  margin-left: 20em;
  margin-right: 20em;
}

.tab-buttons button {
  padding: 10px;
  background-color: transparent;
  border: 0;
  cursor: pointer;
  min-width: 8em;
  color: #7D7D7D;
  font-weight: 500;
  font-size: 13px;
}

.tab-buttons button.active {
  /* background-color: #007bff; */
  color: #007bff;
  border-top: 3px solid #007bff;
}

.tab-content {
  display: flex;
  justify-content: space-around;
}

.deals-filter-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5em;
  margin-top: 1em;
}

.deals-filter {
  padding: 10px;
  /* border: 1px solid #ddd; */
  background-color: transparent;
  margin-right: -0.6em;
  margin-top: -0.5em;
}

.chip-button.active {
  background-color: #DFEBFB;
  color: #007bff;
}

.chip-button {
  border: solid thin #ddd; 
  border-radius: 16px; 
  font-size: 14px; 
  padding: 8px 15px 8px 15px; 
  cursor: pointer;
  /* margin-right: 0.5em; */
  background-color: transparent;
}

.label-filter {
  border: none; 
  border-radius: 16px; 
  font-size: 14px; 
  padding: 8px 15px 8px 15px; 
  cursor: pointer;
  margin-right: -1.5em;
}

.filter-count {
  background-color: #2563eb; /* Same as bg-blue-600 */
  color: white; /* Same as text-white */
  border-radius: 9999px; /* Same as rounded-full */
  padding: 0.1rem 0.3rem 0.1rem 0.3rem;
  border: none;
  font-size: 0.8rem;
  font-weight: 500;
  margin-left: 0.5em;
}

.deals-image {
  height: 19.2em;
  width: 19.2em;
  object-fit: cover;
  margin-bottom: 1.2em;
  cursor: pointer;
}

.deals-content {
  display: flex;
  flex-wrap: wrap; /* Allow wrapping */
  justify-content: space-between; /* Space items out evenly */
  /* gap: 10px; Space between items */
  /* border: solid black; */
}

.image-top {
  height: 10.5em;
  /* border-radius: 8px; */
  object-fit: cover;
  object-position: 50% 50%;
  margin-bottom: -18px;
}

.image-bottom {
  height: 100%;
  width: 100%;
  /* object-fit: cover; */
  object-position: 50% 50%;
}

.image-bottom-last {
  height: 100%;
  width: 102%;
  /* object-fit: cover; */
  object-position: 50% 50%;
  /* border: solid 1px red; */
}

.image-bottom-container {
  display: inline-block;
  height: 5.5em;
  width: 6em;
  /* border: solid 1px; */
  overflow: hidden;
  margin-top: 20px;
  margin-right: 2px;
}

.image-bottom-container-last {
  display: inline-flex;
  height: 5.5em;
  width: 6em;
  /* border: solid 1px; */
  /* overflow: hidden; */
  margin-top: 19px;
  /* margin-right: 2px; */
}

.image-container {
  border-radius: 8px;
  /* border: solid 1px; */
  overflow: hidden;
  width: 300px;
  height: 16em;
  margin-bottom: 20px;
  /* margin-left: -250px; */
  margin-right: 1em;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  /* display: flex; */
  /* justify-content: space-between; */
}

.label-see-photos {
  font-size: .75rem; 
  font-weight: 500; 
  position: absolute;
  background-color: white;
  border-radius: 4px;
  padding: 5px 10px 5px 8px;
  margin-top: 130px;
  margin-left: 15px;
  cursor: pointer;
}

.room-container {
  display: flex;
  margin-bottom: 40px;
  background: white;
}

.room-info-container {
  width: 650px;
  border-radius: 8px;
  border: solid 1px #ddd;
}

.room-title-container {
  width: 650px;
  height: 65px;
  margin-top: 10px;
  margin-left: 15px;
}

.room-price-container {
  width: 650px;
  height: 80px;
  border: solid 1px;
}

.see-details-button {
  background-color: transparent; 
  font-weight: 600; 
  color: #1a73e8; 
  border-radius: 40px;
  cursor: pointer;
  padding: 5px 12px 5px 12px;
  /* margin-left: 300px; */
  border: none;
}

.see-details-button:hover {
  background-color: #EDF4FE;
}

.popup-overlay-details {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1) !important;
  backdrop-filter: brightness(1.1);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
}

.popup-details-container {
  background: white;
  border-radius: 8px;
  text-align: center;
  max-width: 100%;
  max-height: 100%;
  width: 900px; 
  height: 550px;
  max-height: 550px;
  /* border: solid 1px blue; */
  display: inline-flex;
  /* box-shadow: 2px 1px -1px rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 1px 3px 0 rgba(0,0,0,.12) !important; */
  /* overflow-y: scroll; */
}

.popup-details-photos-container {
  width: 55%;
  height: auto;
  background-color: black;
  margin: 0 auto;
  display: flex;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  /* box-shadow: 2px 1px -1px rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 1px 3px 0 rgba(0,0,0,.12) !important; */
  /* overflow: hidden; */
}

.popup-details-photos {
  width: 100%;
  height: 70%;
  background-color: black;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  /* border: solid 1px red; */
}

.popup-details-photos img {
  width: 100%;
  height: 100%;
  /* max-height: 80vh; */
  margin: 0 auto;
  display: block;
  object-fit: cover;
  object-position: 50% 50%;
}

.popup-details-amenities {
  width: 45%;
  display: block;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  box-shadow: 2px 1px -1px rgba(0,0,0,0),1px 1px 1px 1px rgba(0,0,0,0),5px 1px 3px 1px rgba(0,0,0,0) !important;
  /* border: solid 1px green; */
}

.popup-details-prev {
  position: fixed;
  top: 47%;
  left: 310px
}

.popup-details-prev button {
  padding: 5px 13px 5px 13px;
  font-size: 18px;
  /* background: #6B6B6B; */
  background-color: rgba(10, 10, 10, 0.3);
  color: white;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
}

.popup-details-next {
  position: fixed;
  top: 47%;
  left: 730px;
}

.popup-details-next button {
  padding: 5px 13px 5px 13px;
  font-size: 18px;
  /* background: #6B6B6B; */
  background-color: rgba(10, 10, 10, 0.3);
  color: white;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
}

.popup-details-close-btn{
  border-radius: 9999px;
  /* margin-top: -6px;
  margin-bottom: 36px;
  margin-left: 20px;
  margin-right: -20px; */
  padding: 2px 9px 2px 9px;
  border: none;
  font-size: 20px;
  font-weight: 500;
  color: var(--bs-primary);
  background-color: transparent;
  cursor: pointer;
  margin-left: 220px;
  z-index: 53;
}

.popup-details-close-btn:hover{
  background-color: var(--bs-primary-bg-subtle);
}

.details-image-index-info {
  position: fixed;
  display: inline-block;
  width: 45px;
  background-color: #1e1e1e;
  color: white;
  border-radius: 8px;
  left: 740px;
  top: 595px;
  font-size: 15px;
  padding-top: 3px;
  padding-bottom: 3px;
}
</style>
  