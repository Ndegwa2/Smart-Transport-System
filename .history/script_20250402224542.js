document.addEventListener('DOMContentLoaded', function() {
    // Function to fetch and display data
    function fetchData(url, elementId) {
        fetch(url, {
            headers: {
                'Authorization': 'Bearer YOUR_JWT_TOKEN' // Replace with actual token
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const section = document.getElementById(elementId);
                const dataList = document.createElement('ul');

                if (Array.isArray(data.data)) {
                    data.data.forEach(item => {
                        const listItem = document.createElement('li');
                        listItem.textContent = JSON.stringify(item); // Display item as JSON string
                        dataList.appendChild(listItem);
                    });
                } else {
                    const listItem = document.createElement('li');
                    listItem.textContent = JSON.stringify(data.data); // Display item as JSON string
                    dataList.appendChild(listItem);
                }

                section.appendChild(dataList);
            } else {
                console.error('Error fetching data:', data.message);
                const section = document.getElementById(elementId);
                 section.textContent = 'Error fetching data: ' + data.message;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            const section = document.getElementById(elementId);
            section.textContent = 'An error occurred while fetching data.';
        });
    }

    // Fetch data for each section
    fetchData('/admin/employees', 'employees');
    fetchData('/admin/accounts', 'accounts');
    fetchData('/admin/bookings', 'bookings');
    fetchData('/admin/fleet', 'fleet');
});

document.getElementById("route").addEventListener("change", function () {
    let fareElement = document.getElementById("fare");
    let selectedRoute = this.value;

    let farePrices = {
        "Nairobi-Kisumu": "Ksh 1500",
        "Nairobi-Mombasa": "Ksh 2000",
        "Kisumu-Mombasa": "Ksh 2500"
    };

    let distance = {
        "Nairobi-Kisumu": "450 km",
        "Nairobi-Mombasa": "480 km",
        "Kisumu-Mombasa": "720 km"
    };

    let eta = {
        "Nairobi-Kisumu": "6 hours",
        "Nairobi-Mombasa": "8 hours",
        "Kisumu-Mombasa": "10 hours"
    };

    fareElement.textContent = farePrices[selectedRoute];
    document.getElementById("distance").textContent = distance[selectedRoute];
    document.getElementById("eta").textContent = eta[selectedRoute];
    document.getElementById("total-fare").textContent = farePrices[selectedRoute];
});

document.getElementById("booking-form").addEventListener("submit", function (event) {
    event.preventDefault();

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;
    let seats = document.getElementById("seats").value;
    let route = document.getElementById("route").value;
    let fare = document.getElementById("fare").textContent;

    let bookingData = {
        name: name,
        email: email,
        phone: phone,
        seats: seats,
        route: route,
        fare: fare
    };

    fetch("/book", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(bookingData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Booking successful!");
        } else {
            alert("Booking failed: " + data.message);
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("An error occurred while booking.");
    });
});