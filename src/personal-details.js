/* ==========================================
   VELORA — PERSONAL / BOOKING DETAILS
   ========================================== */

const customerNameElement = document.getElementById("customer-name");
const customerTitleElement = document.getElementById("customer-title");

const carNameElement = document.getElementById("car-name");
const carPriceElement = document.getElementById("car-price");

const licenseInput = document.getElementById("license");
const panInput = document.getElementById("pan");
const pickupInput = document.getElementById("pickup");
const dropInput = document.getElementById("drop");

const form = document.getElementById("personal-details-form");
const backButton = document.getElementById("back-btn");
const logoutButton = document.getElementById("logout-btn");


/* ==========================================
   LOAD CUSTOMER
   ========================================== */

const storedUser = localStorage.getItem("veloraUser");

if (!storedUser) {

    window.location.href = "/register.html";

} else {

    try {

        const user = JSON.parse(storedUser);

        const name = user.name || "Customer";

        customerNameElement.textContent = `Hello, ${name}`;
        customerTitleElement.textContent = name;

    } catch (error) {

        console.error("VELORA USER ERROR:", error);

        window.location.href = "/register.html";
    }
}


/* ==========================================
   LOAD SELECTED CAR
   ========================================== */

const storedCar = localStorage.getItem("veloraSelectedCar");

if (!storedCar) {

    window.location.href = "/cars.html";

} else {

    try {

        const selectedCar = JSON.parse(storedCar);

        const carName = selectedCar.name || "Selected Car";
        const price = Number(selectedCar.price || 0);

        carNameElement.textContent = carName;

        carPriceElement.textContent =
            `?${price.toLocaleString("en-IN")} / day`;

    } catch (error) {

        console.error("VELORA CAR ERROR:", error);

        window.location.href = "/cars.html";
    }
}


/* ==========================================
   PAN FORMATTING
   ========================================== */

panInput.addEventListener("input", function () {

    this.value = this.value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 10);

});


/* ==========================================
   LICENCE FORMATTING
   ========================================== */

licenseInput.addEventListener("input", function () {

    this.value = this.value
        .toUpperCase()
        .replace(/[^A-Z0-9 -]/g, "");

});


/* ==========================================
   DATE OVERLAP CHECK
   ========================================== */

function datesOverlap(start1, end1, start2, end2) {

    const firstStart = new Date(start1);
    const firstEnd = new Date(end1);

    const secondStart = new Date(start2);
    const secondEnd = new Date(end2);

    return (
        firstStart <= secondEnd &&
        secondStart <= firstEnd
    );
}


/* ==========================================
   SUBMIT BOOKING REQUEST
   ========================================== */

form.addEventListener("submit", function (event) {

    event.preventDefault();


    /* ==========================================
       GET FORM VALUES
       ========================================== */

    const licence =
        licenseInput.value.trim().toUpperCase();

    const pan =
        panInput.value.trim().toUpperCase();

    const pickup =
        pickupInput.value.trim();

    const drop =
        dropInput.value.trim();


    /* ==========================================
       REQUIRED FIELD CHECK
       ========================================== */

    if (!licence || !pan || !pickup || !drop) {

        alert("Please fill in all the required details.");

        return;
    }


    /* ==========================================
       PAN VALIDATION
       ========================================== */

    const panPattern =
        /^[A-Z]{5}[0-9]{4}[A-Z]$/;

    if (!panPattern.test(pan)) {

        alert("Please enter a valid PAN card number.");

        panInput.focus();

        return;
    }


    /* ==========================================
       PICKUP / DROP CHECK
       ========================================== */

    if (
        pickup.toLowerCase() ===
        drop.toLowerCase()
    ) {

        alert("Pickup and drop points cannot be the same.");

        dropInput.focus();

        return;
    }


    /* ==========================================
       LOAD USER
       ========================================== */

    let user;

    try {

        user =
            JSON.parse(
                localStorage.getItem("veloraUser")
            );

    } catch (error) {

        alert("Customer information could not be loaded.");

        window.location.href = "/register.html";

        return;
    }


    if (!user || !user.name) {

        alert("Please register again.");

        window.location.href = "/register.html";

        return;
    }


    /* ==========================================
       LOAD SELECTED CAR
       ========================================== */

    let selectedCar = {};

    try {

        selectedCar =
            JSON.parse(
                localStorage.getItem("veloraSelectedCar")
            ) || {};

    } catch (error) {

        selectedCar = {};
    }


    const selectedCarName =
        selectedCar.name ||
        carNameElement.textContent.trim();


    const selectedCarPrice =
        Number(selectedCar.price || 0);


    /* ==========================================
       LOAD EXISTING BOOKING
       ========================================== */

    let booking = {};

    try {

        booking =
            JSON.parse(
                localStorage.getItem("veloraBooking")
            ) || {};

    } catch (error) {

        booking = {};
    }


    const fromDate =
        booking.fromDate || "";

    const toDate =
        booking.toDate || "";


    if (!fromDate || !toDate) {

        alert(
            "Please select your rental dates before continuing."
        );

        window.location.href = "/car-details.html";

        return;
    }


    /* ==========================================
       LOAD EXISTING REQUESTS
       ========================================== */

    let requests = [];

    try {

        requests =
            JSON.parse(
                localStorage.getItem(
                    "veloraBookingRequests"
                )
            ) || [];

    } catch (error) {

        requests = [];
    }


    /* ==========================================
       CAR AVAILABILITY CHECK
       
       IMPORTANT:
       Phone, PAN and licence are NOT checked.

       Only the SAME CAR with OVERLAPPING
       rental dates is considered unavailable.
       ========================================== */

    const conflictingRequest =
        requests.find(function (request) {

            if (!request) {
                return false;
            }


            /* Same car? */

            const sameCar =
                String(request.carName || "")
                    .trim()
                    .toLowerCase() ===
                String(selectedCarName)
                    .trim()
                    .toLowerCase();


            if (!sameCar) {
                return false;
            }


            /* Rejected bookings do NOT block the car. */

            const status =
                String(request.status || "")
                    .trim()
                    .toUpperCase();


            if (status === "REJECTED") {
                return false;
            }


            /* Need valid dates. */

            if (
                !request.fromDate ||
                !request.toDate
            ) {
                return false;
            }


            /* Check date overlap. */

            return datesOverlap(
                fromDate,
                toDate,
                request.fromDate,
                request.toDate
            );

        });


    /* ==========================================
       CAR NOT AVAILABLE
       ========================================== */

    if (conflictingRequest) {

        alert(
            `Sorry, ${selectedCarName} is already unavailable for the selected dates.\n\n` +
            `Please choose another car or select different dates.`
        );

        return;
    }


    /* ==========================================
       CREATE BOOKING ID
       ========================================== */

    const bookingId =
        "VL" +
        Date.now()
            .toString()
            .slice(-8);


    /* ==========================================
       CALCULATE PRICE
       ========================================== */

    const pricePerDay =
        Number(
            booking.pricePerDay ||
            booking.price ||
            selectedCarPrice ||
            0
        );


    const days =
        Number(booking.days || 1);


    const total =
        Number(
            booking.total ||
            pricePerDay * days
        );


    /* ==========================================
       CREATE COMPLETE BOOKING
       ========================================== */

    const newBooking = {

        bookingId: bookingId,

        customerName: user.name,

        phone: user.phone || "",

        carName: selectedCarName,

        pricePerDay: pricePerDay,

        fromDate: fromDate,

        toDate: toDate,

        days: days,

        total: total,

        licenceNumber: licence,

        panNumber: pan,

        pickup: pickup,

        drop: drop,

        status: "PENDING",

        requestedAt:
            new Date().toISOString()

    };


    /* ==========================================
       SAVE CUSTOMER BOOKING
       ========================================== */

    localStorage.setItem(
        "veloraBooking",
        JSON.stringify(newBooking)
    );


    /* ==========================================
       SAVE OWNER REQUEST
       ========================================== */

    requests.push(newBooking);

    localStorage.setItem(
        "veloraBookingRequests",
        JSON.stringify(requests)
    );


    /* ==========================================
       GO TO REQUEST PAGE
       ========================================== */

    window.location.href =
        "/request-submitted.html";

});


/* ==========================================
   BACK BUTTON
   ========================================== */

backButton.addEventListener("click", function () {

    window.location.href =
        "/car-details.html";

});


/* ==========================================
   LOGOUT
   ========================================== */

logoutButton.addEventListener("click", function () {

    localStorage.removeItem("veloraUser");

    localStorage.removeItem(
        "veloraSelectedCar"
    );

    localStorage.removeItem(
        "veloraBooking"
    );

    localStorage.removeItem(
        "veloraBookingRequests"
    );

    window.location.href = "/";

});
