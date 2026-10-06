// ==========================================
// VELORA — CAR DETAILS / BOOKING
// ==========================================


// ==========================================
// ELEMENTS
// ==========================================

const customerNameElement =
    document.getElementById("customer-name");

const carNameElement =
    document.getElementById("car-name");

const carCategoryElement =
    document.getElementById("car-category");

const carImageElement =
    document.getElementById("car-image");

const carPriceElement =
    document.getElementById("car-price");


const fromDateElement =
    document.getElementById("from-date");

const toDateElement =
    document.getElementById("to-date");


const numberOfDaysElement =
    document.getElementById("number-of-days");

const summaryPriceElement =
    document.getElementById("summary-price");

const summaryDaysElement =
    document.getElementById("summary-days");

const totalPriceElement =
    document.getElementById("total-price");


const confirmButton =
    document.getElementById("confirm-booking");

const backButton =
    document.getElementById("back-button");

const logoutButton =
    document.getElementById("logout-btn");



// ==========================================
// LOAD CUSTOMER
// ==========================================

const storedUser =
    localStorage.getItem("veloraUser");


if (storedUser) {

    try {

        const user =
            JSON.parse(storedUser);

        if (user.name) {

            customerNameElement.textContent =
                `Hello, ${user.name}`;

        }

    } catch (error) {

        console.error(
            "VELORA USER ERROR:",
            error
        );

    }

}



// ==========================================
// LOAD SELECTED CAR
// ==========================================

const storedCar =
    localStorage.getItem("veloraSelectedCar");


// If no car is selected
if (!storedCar) {

    window.location.href =
        "/cars.html";

}


// Otherwise load car
else {

    try {

        const selectedCar =
            JSON.parse(storedCar);


        const carName =
            selectedCar.name;

        const carPrice =
            Number(selectedCar.price);

        const carImage =
            selectedCar.image;


        // ==================================
        // CAR NAME
        // ==================================

        carNameElement.textContent =
            carName;


        // ==================================
        // CAR IMAGE
        // ==================================

        if (carImage) {

            carImageElement.src =
                carImage;

        }


        // ==================================
        // PRICE
        // ==================================

        carPriceElement.textContent =
            `₹${carPrice.toLocaleString("en-IN")}`;


        summaryPriceElement.textContent =
            `₹${carPrice.toLocaleString("en-IN")}`;


        // ==================================
        // CATEGORY
        // ==================================

        if (
            carName.includes("Fortuner") ||
            carName.includes("Seltos") ||
            carName.includes("Thar")
        ) {

            carCategoryElement.textContent =
                "PREMIUM SUV";

        }

        else if (
            carName.includes("i20")
        ) {

            carCategoryElement.textContent =
                "PREMIUM HATCHBACK";

        }

        else if (
            carName.includes("Dzire")
        ) {

            carCategoryElement.textContent =
                "PREMIUM SEDAN";

        }

        else if (
            carName.includes("Innova")
        ) {

            carCategoryElement.textContent =
                "PREMIUM MPV";

        }

        else {

            carCategoryElement.textContent =
                "PREMIUM VEHICLE";

        }


        // Store price for calculations

        window.selectedCarPrice =
            carPrice;


    } catch (error) {

        console.error(
            "VELORA CAR ERROR:",
            error
        );

        window.location.href =
            "/cars.html";

    }

}



// ==========================================
// TODAY'S DATE
// ==========================================

function getToday() {

    const today =
        new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            today.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;

}


const today =
    getToday();


fromDateElement.min =
    today;

toDateElement.min =
    today;



// ==========================================
// CALCULATE BOOKING
// ==========================================

function calculateBooking() {

    const fromDate =
        fromDateElement.value;

    const toDate =
        toDateElement.value;

    const price =
        Number(
            window.selectedCarPrice || 0
        );


    // No dates selected

    if (!fromDate || !toDate) {

        numberOfDaysElement.textContent =
            "0";

        summaryDaysElement.textContent =
            "0";

        totalPriceElement.textContent =
            "₹0";

        confirmButton.disabled =
            true;

        return;

    }


    // ======================================
    // CONVERT DATES
    // ======================================

    const fromParts =
        fromDate
            .split("-")
            .map(Number);

    const toParts =
        toDate
            .split("-")
            .map(Number);


    const start =
        Date.UTC(
            fromParts[0],
            fromParts[1] - 1,
            fromParts[2]
        );


    const end =
        Date.UTC(
            toParts[0],
            toParts[1] - 1,
            toParts[2]
        );


    const difference =
        end - start;


    const days =
        Math.round(
            difference /
            (1000 * 60 * 60 * 24)
        );


    // Invalid dates

    if (days <= 0) {

        numberOfDaysElement.textContent =
            "0";

        summaryDaysElement.textContent =
            "0";

        totalPriceElement.textContent =
            "₹0";

        confirmButton.disabled =
            true;

        return;

    }


    // ======================================
    // DISPLAY DAYS
    // ======================================

    numberOfDaysElement.textContent =
        days;

    summaryDaysElement.textContent =
        days;


    // ======================================
    // TOTAL
    // ======================================

    const total =
        price * days;


    totalPriceElement.textContent =
        `₹${total.toLocaleString("en-IN")}`;


    // Enable confirm

    confirmButton.disabled =
        false;

}



// ==========================================
// FROM DATE CHANGE
// ==========================================

fromDateElement.addEventListener(
    "change",
    function () {

        const selectedDate =
            fromDateElement.value;


        if (selectedDate) {

            toDateElement.min =
                selectedDate;


            if (
                toDateElement.value &&
                toDateElement.value < selectedDate
            ) {

                toDateElement.value =
                    "";

            }

        }


        calculateBooking();

    }
);



// ==========================================
// TO DATE CHANGE
// ==========================================

toDateElement.addEventListener(
    "change",
    function () {

        calculateBooking();

    }
);



// ==========================================
// CONFIRM BOOKING
// ==========================================

confirmButton.addEventListener(
    "click",
    function () {

        const days =
            Number(
                numberOfDaysElement.textContent
            );


        const price =
            Number(
                window.selectedCarPrice || 0
            );


        if (
            !fromDateElement.value ||
            !toDateElement.value ||
            days <= 0
        ) {

            return;

        }


        // ==================================
        // CREATE BOOKING
        // ==================================

        const booking = {

            carName:
                carNameElement.textContent,

            pricePerDay:
                price,

            fromDate:
                fromDateElement.value,

            toDate:
                toDateElement.value,

            days:
                days,

            total:
                price * days

        };


        // Save booking

        localStorage.setItem(
            "veloraBooking",
            JSON.stringify(booking)
        );


        // Next page

        window.location.href =
            "/personal-details.html";

    }
);



// ==========================================
// BACK TO CARS
// ==========================================

backButton.addEventListener(
    "click",
    function () {

        window.location.href =
            "/cars.html";

    }
);



// ==========================================
// LOGOUT
// ==========================================

logoutButton.addEventListener(
    "click",
    function () {

        localStorage.removeItem(
            "veloraUser"
        );

        localStorage.removeItem(
            "veloraSelectedCar"
        );

        localStorage.removeItem(
            "veloraBooking"
        );


        window.location.href =
            "/";

    }
);