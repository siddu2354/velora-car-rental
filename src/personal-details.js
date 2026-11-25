
document.addEventListener("DOMContentLoaded", function () {

    // ELEMENTS
    const customerNameElement = document.getElementById("customer-name");

    const carNameElement = document.getElementById("car-name");
    const carPriceElement = document.getElementById("car-price");
    const carImage = document.getElementById("car-image");

    const pickupDateElement = document.getElementById("pickup-date");
    const dropDateElement = document.getElementById("drop-date");
    const totalDaysElement = document.getElementById("total-days");
    const totalAmountElement = document.getElementById("total-amount");

    const form = document.getElementById("personal-details-form");
    const fullNameInput = document.getElementById("full-name");
    const phoneInput = document.getElementById("phone");
    const licenseInput = document.getElementById("license");
    const panInput = document.getElementById("pan");
    const pickupInput = document.getElementById("pickup");
    const dropInput = document.getElementById("drop");

    const message = document.getElementById("form-message");
    const submitButton = form.querySelector('button[type="submit"]');

    // STORAGE HELPER
    function readStorage(key) {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch (error) {
            console.error("Storage error:", error);
            return null;
        }
    }

    function money(value) {
        return "₹" + Number(value || 0).toLocaleString("en-IN");
    }

    function formatDate(value) {
        if (!value) return "--";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) return value;

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }

    // CUSTOMER DETAILS
    const user = readStorage("veloraUser");

    if (!user) {
        window.location.href = "/register.html";
        return;
    }

    const customerName = user.name || user.fullName || "Customer";

    customerNameElement.textContent = "Hello, " + customerName;
    fullNameInput.value = customerName;

    if (user.phone) {
        phoneInput.value = user.phone;
    }

    // SELECTED CAR
    const selectedCar = readStorage("veloraSelectedCar");

    if (!selectedCar) {
        alert("Please select a car first.");
        window.location.href = "/cars.html";
        return;
    }

    const carName = selectedCar.name || selectedCar.carName || "Selected Car";

    const rawPrice =
        selectedCar.price || selectedCar.pricePerDay || 0;

    const pricePerDay =
        Number(String(rawPrice).replace(/[₹,\s]/g, "")) || 0;

    carNameElement.textContent = carName;
    carPriceElement.textContent = money(pricePerDay);

    // CAR IMAGE
    const imageSource =
        selectedCar.image ||
        selectedCar.imageUrl ||
        selectedCar.photo ||
        selectedCar.img ||
        "";

    if (imageSource) {
        carImage.src = imageSource;
    } else {
        carImage.hidden = true;
    }

    // BOOKING DETAILS
    const booking = readStorage("veloraBooking") || {};

    const fromDate = booking.fromDate || "";
    const toDate = booking.toDate || "";

    if (!fromDate || !toDate) {
        alert("Please select your rental dates first.");
        window.location.href = "/car-details.html";
        return;
    }

    const start = new Date(fromDate);
    const end = new Date(toDate);

    const calculatedDays = Math.max(
        1,
        Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    );

    const days = Number(booking.days) || calculatedDays;

    const finalPricePerDay =
        Number(booking.pricePerDay || booking.price) || pricePerDay;

    const total =
        Number(booking.total) || finalPricePerDay * days;

    pickupDateElement.textContent = formatDate(fromDate);
    dropDateElement.textContent = formatDate(toDate);
    totalDaysElement.textContent =
        days + (days === 1 ? " Day" : " Days");

    totalAmountElement.textContent = money(total);

    // PAN INPUT FORMATTING
    panInput.addEventListener("input", function () {
        this.value = this.value
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, "")
            .slice(0, 10);
    });

    // LICENCE INPUT FORMATTING
    licenseInput.addEventListener("input", function () {
        this.value = this.value
            .toUpperCase()
            .slice(0, 25);
    });

    // DATE OVERLAP CHECK
    function datesOverlap(aStart, aEnd, bStart, bEnd) {
        return (
            new Date(aStart) <= new Date(bEnd) &&
            new Date(bStart) <= new Date(aEnd)
        );
    }

    // SUBMIT BOOKING
    form.addEventListener("submit", function (event) {

        event.preventDefault();

        message.textContent = "";

        const name = fullNameInput.value.trim();
        const phone = phoneInput.value.trim();
        const licence = licenseInput.value.trim().toUpperCase();
        const pan = panInput.value.trim().toUpperCase();
        const pickup = pickupInput.value.trim();
        const drop = dropInput.value.trim();

        // VALIDATION
        if (!name || !phone || !licence || !pan || !pickup || !drop) {
            message.textContent = "Please complete all fields.";
            return;
        }

        if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) {
            message.textContent = "Please enter a valid PAN format.";
            panInput.focus();
            return;
        }

        if (licence.length < 5) {
            message.textContent = "Please enter a valid driving licence number.";
            licenseInput.focus();
            return;
        }

        if (!/^[0-9+\-\s]{10,15}$/.test(phone)) {
            message.textContent = "Please enter a valid phone number.";
            phoneInput.focus();
            return;
        }

        if (pickup.toLowerCase() === drop.toLowerCase()) {
            message.textContent =
                "Pickup and drop locations must be different.";
            dropInput.focus();
            return;
        }

        // READ EXISTING REQUESTS
        let requests = readStorage("veloraBookingRequests");

        if (!Array.isArray(requests)) {
            requests = [];
        }

        // CHECK CAR AVAILABILITY
        const conflict = requests.find(function (request) {

            if (!request) return false;

            const sameCar =
                String(request.carName || "").toLowerCase().trim() ===
                carName.toLowerCase().trim();

            if (!sameCar) return false;

            if (
                String(request.status || "").toUpperCase() === "REJECTED"
            ) {
                return false;
            }

            if (!request.fromDate || !request.toDate) return false;

            return datesOverlap(
                fromDate,
                toDate,
                request.fromDate,
                request.toDate
            );
        });

        if (conflict) {
            message.textContent =
                "This car already has a booking request for these dates.";
            return;
        }

        // CREATE BOOKING REQUEST
        const newBooking = {

            bookingId: "VL" + Date.now().toString().slice(-8),

            customerName: name,
            phone: phone,

            carName: carName,
            pricePerDay: finalPricePerDay,

            fromDate: fromDate,
            toDate: toDate,
            days: days,
            total: total,

            // Do not store actual identity numbers in this prototype.
            licenceNumber: "Provided",
            panNumber: "Provided",

            pickup: pickup,
            drop: drop,

            status: "PENDING",
            requestedAt: new Date().toISOString()
        };

        // SAVE BOOKING
        try {

            localStorage.setItem(
                "veloraBooking",
                JSON.stringify(newBooking)
            );

            requests.push(newBooking);

            localStorage.setItem(
                "veloraBookingRequests",
                JSON.stringify(requests)
            );

        } catch (error) {

            console.error("Booking save error:", error);

            message.textContent =
                "Unable to save booking. Please try again.";

            return;
        }

        // SUCCESS
        submitButton.disabled = true;
        submitButton.textContent = "SUBMITTING...";

        window.location.href = "/request-submitted.html";

    });

});
