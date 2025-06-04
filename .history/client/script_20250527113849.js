const routesData = [
  {
    route: "Nairobi - Kisumu",
    time: "8:00 AM",
    availableBuses: 5,
    availableSeats: 20,
    occupiedSeats: 30
  },
  {
    route: "Nairobi - Mombasa",
    time: "9:00 AM",
    availableBuses: 3,
    availableSeats: 10,
    occupiedSeats: 40
  }
];

function displayRoutes() {
  const routesSection = document.getElementById("routes");
  let routesHTML = "<ul>";
  routesData.forEach(route => {
    routesHTML += `<li>${route.route} - ${route.time} - Available Buses: ${route.availableBuses}</li>`;
  });
  routesHTML += "</ul>";
  routesSection.innerHTML = routesHTML;
}

function displayAnalytics() {
  if (isAdmin()) {
    const busAnalyticsSection = document.getElementById("bus-analytics");
    const seatAnalyticsSection = document.getElementById("seat-analytics");

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
    const analyticsSection = document.getElementById("analytics");
    analyticsSection.innerHTML = "<p>Analytics available to admins only.</p>";
  }
}

function isAdmin() {
  // Replace with actual authentication check
  return true;
}

// 🌦️ Fetch and display real-time weather
function fetchWeather() {
  const WEATHER_API_KEY = 'a9232d8b5b75e6c17a3560c1dd3803f4'//API Key.
  const CITY = 'Nairobi';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${WEATHER_API_KEY}&units=metric`;

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error('Weather fetch failed');
      return response.json();
    })
    .then(data => {
      const weatherDesc = data.weather[0].description;
      const temp = data.main.temp;
      const trafficUpdate = document.getElementById('traffic-update');
      trafficUpdate.innerHTML += `
        <p><i class="fas fa-cloud-sun"></i> Weather in ${CITY}: ${weatherDesc}, ${temp}°C</p>
      `;
    })
    .catch(error => console.error('Weather error:', error));
}

// Run functions
displayRoutes();
displayAnalytics();
fetchWeather();

// Function to update booking information dynamically
function updateBookingInfo() {
    const distance = Math.floor(Math.random() * 500) + 100; // Random distance between 100 and 600 km
    const eta = Math.floor(Math.random() * 8) + 3; // Random ETA between 3 and 10 hours
    const fare = 1500; // Base fare
    const totalFare = fare + (distance * 2); // Example calculation

    document.getElementById('distance').textContent = `${distance} km`;
    document.getElementById('eta').textContent = `${eta} hours`;
    document.getElementById('total-fare').textContent = `Ksh ${totalFare}`;
}

// Call updateBookingInfo to display dynamic data
updateBookingInfo();

// Add event listeners to the links in the admin dashboard sections
const adminDashboardSections = document.querySelectorAll('#fleet_management a, #employee_management a, #passenger_services a, #route_schedule_management a, #ticketing_revenue_tracking a, #reports_analytics a, #system_settings_security a');

adminDashboardSections.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        alert('This feature is not yet implemented.');
    });
});
