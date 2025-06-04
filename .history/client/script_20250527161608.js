document.addEventListener('DOMContentLoaded', function() {
  // Cache DOM elements once
  const routesSection = document.getElementById("routes");
  const busAnalyticsSection = document.getElementById("bus-analytics");
  const seatAnalyticsSection = document.getElementById("seat-analytics");
  const analyticsSection = document.getElementById("analytics");
  const trafficUpdate = document.getElementById('traffic-update');
  const distanceEl = document.getElementById('distance');
  const etaEl = document.getElementById('eta');
  const fareEl = document.getElementById('total-fare');

const routesData = [
  { route: "Nairobi to Kisumu", time: "6:00 AM", availableBuses: 5, availableSeats: 40, occupiedSeats: 25 },
  { route: "Mombasa to Nairobi", time: "7:00 AM", availableBuses: 3, availableSeats: 30, occupiedSeats: 15 },
  { route: "Nakuru to Eldoret", time: "8:00 AM", availableBuses: 2, availableSeats: 20, occupiedSeats: 10 }
];

function displayRoutes() {
  let routesHTML = "<ul>";
  routesData.forEach(route => {
    routesHTML += `<li>${route.route} - ${route.time} - Available Buses: ${route.availableBuses}</li>`;
  });
  routesHTML += "</ul>";
  routesSection.innerHTML = routesHTML;
}

function displayAnalytics() {
  if (isAdmin()) {
    busAnalyticsSection.textContent = 'Loading analytics...';
    seatAnalyticsSection.textContent = '';

    let totalAvailableBuses = 0;
    let totalAvailableSeats = 0;
    let totalOccupiedSeats = 0;

    routesData.forEach(route => {
      totalAvailableBuses += route.availableBuses;
      totalAvailableSeats += route.availableSeats;
      totalOccupiedSeats += route.occupiedSeats;
    });

    busAnalyticsSection.innerHTML = `<p>Total Available Buses: ${totalAvailableBuses}</p>`;
    seatAnalyticsSection.innerHTML = `
      <p>Total Available Seats: ${totalAvailableSeats}</p>
      <p>Total Occupied Seats: ${totalOccupiedSeats}</p>`;
  } else {
    analyticsSection.textContent = "Analytics available to admins only.";
  }
}

function isAdmin() {
  // Ideally replace with real auth check
  return true;
}

function fetchWeather() {
  const WEATHER_API_KEY = 'a9232d8b5b75e6c17a3560c1dd3803f4';
  const CITY = 'Nairobi';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${WEATHER_API_KEY}&units=metric`;

  trafficUpdate.textContent = 'Loading weather...';

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error('Weather fetch failed');
      return response.json();
    })
    .then(data => {
      const weatherDesc = data.weather[0].description;
      const temp = data.main.temp;
      trafficUpdate.innerHTML = `
        <p><i class="fas fa-cloud-sun"></i> Weather in ${CITY}: ${weatherDesc}, ${temp}°C</p>
      `;
    })
    .catch(error => {
      console.error('Weather error:', error);
      trafficUpdate.textContent = "Failed to load weather data.";
    });
}

function calculateFare(distance, baseFare = 1500) {
  return baseFare + (distance * 2);
}

function updateBookingInfo() {
  const distance = Math.floor(Math.random() * 500) + 100;
  const eta = Math.floor(Math.random() * 8) + 3;
  const totalFare = calculateFare(distance);

  distanceEl.textContent = `${distance} km`;
  etaEl.textContent = `${eta} hours`;
  fareEl.textContent = `Ksh ${totalFare}`;
}

// Event listeners with modal idea instead of alert (later implementation)
const adminDashboardSections = document.querySelectorAll('#fleet_management a, #employee_management a, #passenger_services a, #route_schedule_management a, #ticketing_revenue_tracking a, #reports_analytics a, #system_settings_security a');

adminDashboardSections.forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    // TODO: replace with modal or toast
    alert('This feature is not yet implemented.');
  });
});

if (document.querySelector('.hamburger')) {
  const hamburger = document.querySelector('.hamburger');
  const sidebar = document.querySelector('.sidebar');

  hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('active');
  });
}

// Initialize
displayRoutes();
displayAnalytics();
fetchWeather();
updateBookingInfo();
});
