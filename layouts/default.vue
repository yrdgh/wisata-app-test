<template>
  <div>
    <Header
      :hotelName="hotelName"
      :hotelNameSuffix="hotelNameSuffix"
      :checkin="checkin"
      :checkout="checkout"
      :hotelDetails="hotelDetails"
      :guest="guest"
      :room="room"
    />
    <main>
      <NuxtPage />
    </main>
    <footer>© Wisata App . Terms</footer>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
// import Header from '~/components/Header.vue';
import { onMounted, watch } from 'vue';

// Access the global capitalizeWords function provided by the plugin
const nuxtApp = useNuxtApp();  // Access Nuxt app context
const formatDateSearch = nuxtApp.$formatDateSearch; // Access the globally provided function
const axiosRequest = nuxtApp.$axiosRequest; // Access the globally provided function

const route = useRoute();
const router = useRouter();

// Get the query parameters (e.g., checkin, checkout, etc.)
const checkin = ref(route.query.checkin);
const checkout = ref(route.query.checkout);

const guest = ref(parseInt(route.query.guest_per_room));
const room = ref(parseInt(route.query.number_of_room));

// Get the hotel name from the dynamic route parameter `hotelId`
// This is the part of the URL like /stay/fairmont-jakarta-9000248394
let res_property = null;

const hotelId = useState('hotelId', () => route.params.hotelId);
const hotelName = useState('hotelName', () => null);
const hotelNameSuffix = useState('hotelNameSuffix', () => null);
const starRating = useState('starRating', () => null);
const category = useState('category', () => null);
const fullAddress = useState('fullAddress', () => null);
const reviewRating = useState('reviewRating', () => null);
const reviewCount = useState('reviewCount', () => null);
const hotelImage = useState('hotelImage', () => null);
const hotelDetails = useState('hotelDetails', () => null);
const photosData = useState('photosData', () => []);
const roomsData = useState('roomsData', () => []);

let tab = 'tab1';
if(route.name == 'stay-hotelId-photos'){
  tab = 'tab2';
}else if(route.name == 'stay-hotelId-info'){
  tab = 'tab3';
}
const currentTab = useState('currentTab', () => tab);

onMounted(() => {
  // Access sessionStorage only in the client
  if (typeof window !== 'undefined') {
    const hotelIdStored = sessionStorage.getItem('hotelId');
    if (hotelIdStored) {
      hotelId.value = hotelIdStored;
    }

    const hotelNameStored = sessionStorage.getItem('hotelName');
    if (hotelNameStored) {
      hotelName.value = hotelNameStored;
    }

    const hotelNameSuffixStored = sessionStorage.getItem('hotelNameSuffix');
    if (hotelNameSuffixStored) {
      hotelNameSuffix.value = hotelNameSuffixStored;
    }

    const starRatingStored = sessionStorage.getItem('starRating');
    if (starRatingStored) {
      starRating.value = starRatingStored;
    }

    const categoryStored = sessionStorage.getItem('category');
    if (categoryStored) {
      category.value = categoryStored;
    }

    const fullAddressStored = sessionStorage.getItem('fullAddress');
    if (fullAddressStored) {
      fullAddress.value = fullAddressStored;
    }

    const reviewRatingStored = sessionStorage.getItem('reviewRating');
    if (reviewRatingStored) {
      reviewRating.value = reviewRatingStored;
    }

    const reviewCountStored = sessionStorage.getItem('reviewCount');
    if (reviewCountStored) {
      reviewCount.value = reviewCountStored;
    }

    const hotelImageStored = sessionStorage.getItem('hotelImage');
    if (hotelImageStored) {
      hotelImage.value = hotelImageStored;
    }

    const hotelDetailsStored = sessionStorage.getItem('hotelDetails');
    if (hotelDetailsStored) {
      hotelDetails.value = hotelDetailsStored;
    }

    const currentTabStored = sessionStorage.getItem('currentTab');
    if (currentTabStored) {
      currentTab.value = currentTabStored;
    }

    const photosDataStored = sessionStorage.getItem('photosData');
    if (photosDataStored) {
      photosData.value = photosDataStored;
    }

    const roomsDataStored = sessionStorage.getItem('roomsData');
    if (roomsDataStored) {
      roomsData.value = roomsDataStored;
    }

    fetchDataHotel();
  }
});

// Watch for changes and save to sessionStorage
if (typeof window !== 'undefined') {
  watch(hotelId, (newValue) => {
    sessionStorage.setItem('hotelId', newValue);
  });

  watch(hotelName, (newValue) => {
    sessionStorage.setItem('hotelName', newValue);
  });

  watch(hotelNameSuffix, (newValue) => {
    sessionStorage.setItem('hotelNameSuffix', newValue);
  });

  watch(starRating, (newValue) => {
    sessionStorage.setItem('starRating', newValue);
  });

  watch(category, (newValue) => {
    sessionStorage.setItem('category', newValue);
  });

  watch(fullAddress, (newValue) => {
    sessionStorage.setItem('fullAddress', newValue);
  });

  watch(reviewRating, (newValue) => {
    sessionStorage.setItem('reviewRating', newValue);
  });

  watch(reviewCount, (newValue) => {
    sessionStorage.setItem('reviewCount', newValue);
  });

  watch(hotelImage, (newValue) => {
    sessionStorage.setItem('hotelImage', newValue);
  });

  watch(hotelDetails, (newValue) => {
    sessionStorage.setItem('hotelDetails', newValue);
  });
  
  watch(currentTab, (newValue) => {
    sessionStorage.setItem('currentTab', newValue);
  });

  watch(photosData, (newValue) => {
    sessionStorage.setItem('photosData', newValue);
  });

  watch(roomsData, (newValue) => {
    sessionStorage.setItem('roomsData', newValue);
  });

  watch(() => [route.query.checkin, route.query.checkout, route.query.guest_per_room, route.query.number_of_room],
    ([newCheckin, newCheckout, newGuest, newRoom]) => {
      checkin.value = newCheckin;
      checkout.value = newCheckout;
      guest.value = newGuest;
      room.value = parseInt(newRoom);
      fetchDataHotel(); // Call fetchDataHotel once for all changes
    }
  );
}

const fetchDataHotel = async () => {
  if(hotelId){
    const hotelIdArr = hotelId.value.split('-');
    const id = hotelIdArr.pop();
    const params = new URLSearchParams();
    params.append('id', id);
    params.append('include', 'image');
    params.append('include', 'room');

    res_property = await axiosRequest('GET', 'property/content', null, {}, params);

    hotelName.value = res_property[id].name;
    hotelNameSuffix.value = res_property[id].name_suffix;
    starRating.value = res_property[id].catalog.star_rating;
    category.value = res_property[id].catalog.category;
    fullAddress.value = res_property[id].address_line + ', ' + res_property[id].name_suffix + ' ' + res_property[id].catalog.postal_code;
    reviewRating.value = res_property[id].catalog.review_rating;
    reviewCount.value = res_property[id].catalog.review_count;
    
    hotelImage.value = res_property[id].catalog.hero_image_url.sm;
    
    res_property[id].image.forEach(item => {
      photosData.value.push(item.url.lg);
    });

    Object.keys(res_property[id].room).forEach((key) => {
        const room = res_property[id].room[key];
        roomsData.value.push({ key, room });
    });
    
    if(checkin.value && checkout.value){
      const dateSearch = formatDateSearch(checkin.value, checkout.value);
      hotelDetails.value = `${hotelName.value} · ${dateSearch}`;
    }
    console.log(router.options.routes);
  }
};
</script>

<style>
h1 {
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-weight: 500;
  font-family: Google Sans,BlinkMacSystemFont,sans-serif!important;
  letter-spacing: 0;
  /* margin-bottom: 1rem; */
  color: #212121 !important;
  /* transition: none !important; */
}

/* header {
  position: sticky;
  top: 0;
  padding: 1rem;
  background-color: #333;
  text-align: center;
} */

/* header.scrolled {
  border-bottom: 2px solid #333;
} */

footer {
  padding: 1rem;
  background-color: #f0f0f0;
  text-align: center;
}

main {
  margin: 2rem auto;
  max-width: 1200px;
}

html, body {
  font-family: 'Roboto', sans-serif;
  color: #212121;
  height: 100%;
  margin: 0 auto;
  padding: 0;
  width: 80%;
  display: flex;
  justify-content: center;
}

</style>
