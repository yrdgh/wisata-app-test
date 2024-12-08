<template>
  <div style="display: flex; align-items: center; margin-bottom: 2em;">
    <img 
      :src="hotelImage" 
      alt="Hotel Image"
      style="width: 10.5em; height: 10.5em; object-fit: cover; border-radius: 50%; margin-right: 6em; margin-left: 6em;"
    />
    <div>
      <div style="margin-top: -3em;">
        <h1 style="display: inline; margin-right: 0.2em;">
          {{ hotelName }}
        </h1>
        <h5 style="display: inline;">
          <span v-for="star in starRating" :key="'full-' + star" class="fas fa-star" style="color: #FF9800;"></span>
        </h5>
      </div>
      <h4 style="color: rgba(0,0,0,.6); margin-bottom: 0.4em;">{{ category }}</h4>
      <h4>{{ fullAddress }}</h4>
      <div role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="92" class="v-progress-circular v-progress-circular--visible" style="height: 34px; width: 34px; color: rgb(161, 28, 180); caret-color: rgb(161, 28, 180);">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="22.295081967213115 22.295081967213115 44.59016393442623 44.59016393442623" style="transform: rotate(270deg);">
          <circle fill="transparent" cx="44.59016393442623" cy="44.59016393442623" r="20" stroke-width="4.590163934426229" stroke-dasharray="125.664" stroke-dashoffset="0" class="v-progress-circular__underlay"></circle>
          <circle fill="transparent" cx="44.59016393442623" cy="44.59016393442623" r="20" stroke-width="4.590163934426229" stroke-dasharray="125.664" stroke-dashoffset="10.053096491487338px" class="v-progress-circular__overlay"></circle>
        </svg>
        <div class="v-progress-circular__info"><span style="font-weight: 500 !important;">{{ reviewRating }}</span></div>
      </div>
      <div style="display: inline;">
        <h4 style="display: inline;"> Excellent · {{ reviewCount }} reviews</h4>
      </div>
    </div>
  </div>
</template>
  
<script setup>
defineProps({
  hotelId: String,
  hotelName: String,
  starRating: Number,
  category: String,
  fullAddress: String,
  reviewRating: Number,
  reviewCount: Number,
  hotelImage: String,
});
</script>
  
<style>
h4 {
  font-size: 0.9375rem;
  font-weight: normal;
  margin-top: 0.3em;
  margin-bottom: 0.4em;
}

.v-progress-circular {
    align-items: center;
    display: inline-flex;
    justify-content: center;
    position: relative;
    vertical-align: middle;
}

.v-progress-circular>svg {
    bottom: 0;
    height: 100%;
    left: 0;
    margin: auto;
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    z-index: 0;
}

.v-progress-circular__underlay {
  stroke: hsla(0,0%,62%,.4);
  z-index: 1;
}

.v-progress-circular__overlay {
    stroke: currentColor;
    transition: all .6s ease-in-out;
    z-index: 2;
}
</style>
  