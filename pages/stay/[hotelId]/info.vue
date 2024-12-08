<template>
  <div v-if="currentTab === 'tab3'">
    <!-- info tab content -->
    <span>
      <h2>About the property</h2>
      <p style="margin-bottom: 30px;">
        Fairmont Jakarta is centrally located in Jakarta, a 3-minute walk from Plaza Senayan and 13 minutes by foot from Gelora Bung Karno Stadium. This luxury hotel is 1.6 mi (2.6 km) from Blok M Square and 3.8 mi (6.2 km) from Grand Indonesia.
        Enjoy international cuisine at Spectrum, one of the hotel's 10 restaurants, or stay in and take advantage of the 24-hour room service. Snacks are also available at the coffee shop/cafe. Relax with a refreshing drink from the poolside bar or one of the 4 bars/lounges. Buffet breakfasts are available daily for a fee.
        Relax at the full-service spa, where you can enjoy massages, body treatments, and facials. You can take advantage of recreational amenities such as a health club, an outdoor pool, and a spa tub. Additional features at this hotel include complimentary wireless internet access, concierge services, and gift shops/newsstands.
      </p>

      <h3>Languages</h3>
      <p>English, Indonesian, Japanese, Chinese (Mandarin).</p><br>

      <h2>Policies</h2>
      <div class="policies">
        <div class="policy">
          <span class="policy-label">Check-in</span>
          <span class="policy-time">2:00 PM</span>
        </div>
        <div class="policy">
          <span class="policy-label">Check-out</span>
          <span class="policy-time">12:00 PM</span>
        </div>
      </div>

      <h3>Additional check-in information</h3>
      <ul style="margin-bottom: 20px;">
        <li>Extra-person charges may apply and vary depending on property policy</li>
        <li>Government-issued photo identification and a credit card, debit card, or cash deposit may be required at check-in for incidental charges</li>
        <li>Special requests are subject to availability upon check-in and may incur additional charges; special requests cannot be guaranteed</li>
        <li>This property accepts credit cards, debit cards, and cash</li>
        <li>This property uses a grey water recycling system</li>
        <li>Safety features at this property include a fire extinguisher, a security system, a first aid kit, and window guards</li>
        <li>This property affirms that it follows the cleaning and disinfection practices of ALLSAFE (Accor Hotels)</li>
      </ul>
      
      <h3>Others</h3>
      <ul style="margin-bottom: 50px;">
        <li>Reservations are required for massage services and spa treatments. Reservations can be made by contacting the hotel prior to arrival, using the contact information on the booking confirmation.</li>
        <li>No pets and no service animals are allowed at this property.</li>
      </ul>
      
      <h2>Important information</h2>
      <h3>optional charges</h3>
      <ul>
        <li>Fee for buffet breakfast: approximately USD 21 for adults and USD 10.5 for children</li>
        <li>Airport shuttle fee: USD 30 per vehicle (roundtrip)</li>
        <li>Valet parking fee: USD 20 per day</li>
      </ul>
      
      The above list may not be comprehensive. Fees and deposits may not include tax and are subject to change.
    </span>
  </div>
</template>

<script setup>
const currentTab = useState('currentTab');
</script>

<style>
h2 {
  font-size: 1.25rem; 
  font-weight: 600;
}

h3 {
  font-size: 1rem; 
  font-weight: 600;
}

p {
  font-size: .9375rem;
  font-weight: normal;
  line-height: 1.5;
}

li {
  font-size: .9375rem;
  font-weight: normal;
  line-height: 1.5;
  margin-left: -1em;
}

.policies {
  display: flex;
  justify-content: space-between;
  gap: 20px; /* Adjust gap between Check-in and Check-out */
  max-width: 11em;
  margin-bottom: 0px;
}

.policy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.policy-label {
  font-weight: 500;
  font-size: 16px; /* Adjust font size as needed */
  margin-bottom: 10px;
}

.policy-time {
  font-size: 14px;
  margin-bottom: 1.5em;
}
</style>
  