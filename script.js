document.getElementById("route").addEventListener("change", function () {
    let fareElement = document.getElementById("fare");
    let selectedRoute = this.value;

    let farePrices = {
        "Nairobi-Kisumu": "Ksh 1500",
        "Nairobi-Mombasa": "Ksh 2000",
        "Kisumu-Mombasa": "Ksh 2500"
    };

    fareElement.textContent = farePrices[selectedRoute];
});