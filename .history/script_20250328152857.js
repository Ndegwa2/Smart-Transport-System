const routesData = [
  {
  route: "Nairobi - Kisumu",
  time: "8:00 AM",
  availableBuses: 5
  },
  {
  route: "Nairobi - Mombasa",
  time: "9:00 AM",
  availableBuses: 3
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

 displayRoutes();