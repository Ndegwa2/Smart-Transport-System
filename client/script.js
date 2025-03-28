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
  seatAnalyticsSection.innerHTML = `<p>Total Available Seats: ${totalAvailableSeats}</p><p>Total Occupied Seats: ${totalOccupiedSeats}</p>`;
  } else {
  const analyticsSection = document.getElementById("analytics");
  analyticsSection.innerHTML = "<p>Analytics available to admins only.</p>";
  }
 }

 function isAdmin() {
  // Replace with actual authentication check
  return true;
 }

 displayRoutes();
 displayAnalytics();