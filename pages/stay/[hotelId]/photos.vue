<template>
  <div v-if="currentTab === 'tab2'">
    <!-- photos tab content -->
    <div class="photos-content">
      <span v-for="(data, index) in photosData" :key="index">
        <img
          :src="imageError[index] ? fallbackImage : data"
          alt="Photos Content"
          @error="handleImageError(index)"
          class="photos-image"
          @click="openPopup(index)"
          />
      </span>
    </div>
  </div>

  <!-- Popup for Viewing Image -->
  <div v-if="isPopupOpen" class="popup-overlay-photos" @click="closePopup">
    <div class="popup-content-photos" @click.stop>
      <!-- <button class="close-btn" @click="closePopup">✖</button> -->
      <img :src="imageError[currentImageIndex] ? fallbackImage : currentImage" alt="Popup Image" class="popup-image" />
      <div class="popup-navigation-prev">
        <button @click="prevImage" :disabled="!hasPrev"><i class="fas fa-chevron-left"></i></button>
      </div>
      <div class="popup-navigation-next">
        <button @click="nextImage" :disabled="!hasNext"><i class="fas fa-chevron-right"></i></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const currentTab = useState('currentTab');
const photosData = useState('photosData');

const imageError = ref({});

const fallbackImage = '/fallback-image.png';

// Handle error event for individual images
const handleImageError = (index) => {
  imageError.value[index] = true;
};

// States for popup
const isPopupOpen = ref(false);
const currentImageIndex = ref(null);

// Computed property for the current image
const currentImage = computed(() =>
  currentImageIndex.value !== null ? photosData.value[currentImageIndex.value] : null
);

// Navigation helpers
const hasPrev = computed(() => currentImageIndex.value > 0);
const hasNext = computed(() => currentImageIndex.value < photosData.value.length - 1);

// Open popup
function openPopup(index) {
  currentImageIndex.value = index;
  isPopupOpen.value = true;
}

// Close popup
function closePopup() {
  isPopupOpen.value = false;
  currentImageIndex.value = null;
}

// Navigate to previous image
function prevImage() {
  if (hasPrev.value) {
    currentImageIndex.value -= 1;
  }
}

// Navigate to next image
function nextImage() {
  if (hasNext.value) {
    currentImageIndex.value += 1;
  }
}

function handleKeydown(event) {
  if (event.key === "Escape") {
    closePopup();
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
.photos-image {
  height: 19em;
  width: 19em;
  object-fit: cover;
  margin-bottom: 1.2em;
  cursor: pointer;
}

.photos-content {
  display: flex;
  flex-wrap: wrap; /* Allow wrapping */
  justify-content: space-between; /* Space items out evenly */
  /* gap: 10px; Space between items */
  /* border: solid black; */
}

.popup-overlay-photos {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
}

.popup-content-photos {
  background: rgba(0, 0, 0, 0);
  border-radius: 10px;
  text-align: center;
  max-width: 90%;
  max-height: 90%;
}

.popup-image {
  max-width: 80%;
  max-height: 80vh;
  margin: auto;
  display: block;
  /* margin: 0 auto; */
}

.popup-navigation-prev {
  position: fixed;
  top: 47%;
  left: 210px
}

.popup-navigation-prev button {
  padding: 5px 13px 5px 13px;
  font-size: 18px;
  background: #6B6B6B;
  color: white;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
}

.popup-navigation-prev button:disabled {
  background: #aaa;
  cursor: not-allowed;
}

.popup-navigation-next {
  position: fixed;
  top: 47%;
  left: 1232px;
}

.popup-navigation-next button {
  padding: 5px 13px 5px 13px;
  font-size: 18px;
  background: #6B6B6B;
  color: white;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
}

.popup-navigation-next button:disabled {
  background: #aaa;
  cursor: not-allowed;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  color: white;
  font-size: 20px;
  border: none;
  cursor: pointer;
}
</style>
  