const customerNameElement =
    document.getElementById("customer-name");

const carNameElement =
    document.getElementById("car-name");

const carCategoryElement =
    document.getElementById("car-category");

const carImageElement =
    document.getElementById("car-image");

const fromDateElement =
    document.getElementById("from-date");

const toDateElement =
    document.getElementById("to-date");

const numberOfDaysElement =
    document.getElementById("number-of-days");

const pricePerDayElement =
    document.getElementById("price-per-day");

const rentalDaysElement =
    document.getElementById("rental-days");

const totalPriceElement =
    document.getElementById("total-price");

const bookingIdElement =
    document.getElementById("booking-id");

const homeButton =
    document.getElementById("home-button");

const homeButtonBottom =
    document.getElementById("home-button-bottom");


// =========================
// GET CUSTOMER
// =========================

const storedUser =
    localStorage.getItem("veloraUser");

if (storedUser) {

    try {

        const user = JSON.parse(storedUser);

        if (user.name) {
            customerNameElement.textContent =
                user.name;
        }

    } catch (error) {

        console.error(
            "VELORA USER ERROR:",
            error
        );
    }
}


// =========================
// GET BOOKING
// =========================

const storedBooking =
    localStorage.getItem("veloraBooking");


if (!storedBooking) {

    window.location.href =
        "/cars.html";

} else {

    try {

        const booking =
            JSON.parse(storedBooking);


        // =========================
        // CAR DETAILS
        // =========================

        const carName =
            booking.carName;

        const price =
            Number(booking.pricePerDay);

        const days =
            Number(booking.days);

        const total =
            Number(booking.total);


        carNameElement.textContent =
            carName;


        pricePerDayElement.textContent =
            `₹${price.toLocaleString("en-IN")}`;


        rentalDaysElement.textContent =
            days;


        numberOfDaysElement.textContent =
            days;


        totalPriceElement.textContent =
            `₹${total.toLocaleString("en-IN")}`;


        // =========================
        // DATES
        // =========================

        fromDateElement.textContent =
            formatDate(booking.fromDate);

        toDateElement.textContent =
            formatDate(booking.toDate);


        // =========================
        // CAR CATEGORY
        // =========================

        if (
            carName.includes("Fortuner") ||
            carName.includes("Seltos") ||
            carName.includes("Thar")
        ) {

            carCategoryElement.textContent =
                "PREMIUM SUV";

        } else if (
            carName.includes("i20")
        ) {

            carCategoryElement.textContent =
                "PREMIUM HATCHBACK";

        } else if (
            carName.includes("Dzire")
        ) {

            carCategoryElement.textContent =
                "PREMIUM SEDAN";

        } else {

            carCategoryElement.textContent =
                "PREMIUM MPV";
        }


        // =========================
        // CAR IMAGE
        // =========================

        const imageMap = {

            "Toyota Fortuner":
                "/cars/fortuner.jpg",

            "Hyundai i20 N Line":
                "/cars/i20.jpg",

            "Maruti Suzuki Dzire":
                "/cars/dzire.jpg",

            "Toyota Innova Crysta":
                "/cars/innova.jpg",

            "Kia Seltos":
                "/cars/seltos.jpg",

            "Mahindra Thar Roxx":
                "/cars/thar-roxx.jpg"
        };


        carImageElement.src =
            imageMap[carName] || "";


        // =========================
        // BOOKING ID
        // =========================

        const bookingId =
            "VL" +
            Date.now()
                .toString()
                .slice(-8);

        bookingIdElement.textContent =
            bookingId;


    } catch (error) {

        console.error(
            "VELORA BOOKING ERROR:",
            error
        );

        window.location.href =
            "/cars.html";
    }
}


// =========================
// DATE FORMAT
// =========================

function formatDate(dateString) {

    if (!dateString) {
        return "—";
    }

    const date =
        new Date(dateString + "T00:00:00");

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


// =========================
// HOME BUTTONS
// =========================

homeButton.addEventListener(
    "click",
    () => {

        window.location.href = "/";
    }
);


homeButtonBottom.addEventListener(
    "click",
    () => {

        window.location.href = "/";
    }
);