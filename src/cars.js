// ==========================================
// VELORA — CARS PAGE
// ==========================================

const customerName = document.getElementById("customer-name");
const logoutButton = document.getElementById("logout-btn");
const selectButtons = document.querySelectorAll(".select-car");


// ==========================================
// LOAD CUSTOMER
// ==========================================

const storedUser = localStorage.getItem("veloraUser");

if (storedUser) {
    try {
        const user = JSON.parse(storedUser);

        if (user.name) {
            customerName.textContent = `Hello, ${user.name}`;
        }
    } catch (error) {
        console.error("VELORA USER ERROR:", error);
    }
}


// ==========================================
// CAR SELECTION
// ==========================================

selectButtons.forEach((button) => {

    button.addEventListener("click", function (event) {

        event.preventDefault();

        const carName = this.dataset.name;
        const price = Number(this.dataset.price);

        // Find the correct image from the button/car
        const carCard = this.closest(".car-card");
        const image = carCard.querySelector("img");

        const imagePath = image ? image.getAttribute("src") : "";

        // Save complete selected car
        const selectedCar = {
            name: carName,
            price: price,
            image: imagePath
        };

        localStorage.setItem(
            "veloraSelectedCar",
            JSON.stringify(selectedCar)
        );

        // Small visual feedback
        this.textContent = "SELECTED ✓";
        this.disabled = true;

        // Go directly to details page
        setTimeout(() => {
            window.location.assign("/car-details.html");
        }, 250);
    });

});


// ==========================================
// LOGOUT
// ==========================================

logoutButton.addEventListener("click", function () {

    localStorage.removeItem("veloraUser");
    localStorage.removeItem("veloraSelectedCar");
    localStorage.removeItem("veloraBooking");

    window.location.assign("/");
});