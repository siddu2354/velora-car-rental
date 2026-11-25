
document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("register-form");
    const basicFields = document.getElementById("basic-fields");
    const accountFields = document.getElementById("account-fields");
    const continueButton = document.getElementById("continue-button");
    const backButton = document.getElementById("back-button");
    const message = document.getElementById("register-message");
    const roleCards = document.querySelectorAll(".account-card");

    // CHECK ELEMENTS
    console.log("VELORA register.js loaded");

    if (!continueButton) {
        console.error("Continue button not found! Check its HTML ID.");
        return;
    }

    if (!basicFields || !accountFields) {
        console.error("Registration sections not found! Check HTML IDs.");
        return;
    }

    // CONTINUE BUTTON
    continueButton.addEventListener("click", function (event) {

        event.preventDefault();

        console.log("Continue button clicked");

        const name = document.getElementById("name")?.value.trim();
        const phone = document.getElementById("phone")?.value.trim();

        if (!name || !phone) {
            message.textContent = "Please enter your name and phone number.";
            return;
        }

        if (!/^\d{10}$/.test(phone)) {
            message.textContent = "Enter a valid 10-digit phone number.";
            return;
        }

        message.textContent = "";

        basicFields.hidden = true;
        accountFields.hidden = false;

        console.log("Step 2 opened");

    });

    // BACK BUTTON
    if (backButton) {
        backButton.addEventListener("click", function (event) {

            event.preventDefault();

            accountFields.hidden = true;
            basicFields.hidden = false;

            if (message) {
                message.textContent = "";
            }

        });
    }

    // CUSTOMER / OWNER CARDS
    roleCards.forEach(function (card) {

        card.addEventListener("click", function (event) {

            event.preventDefault();

            const name = document.getElementById("name")?.value.trim();
            const phone = document.getElementById("phone")?.value.trim();
            const email = document.getElementById("email")?.value.trim() || "";

            if (!name || !phone || !/^\d{10}$/.test(phone)) {
                if (message) {
                    message.textContent = "Please enter your name and valid phone number.";
                }

                basicFields.hidden = false;
                accountFields.hidden = true;
                return;
            }

            const role = card.dataset.role;

            console.log("Selected role:", role);

            roleCards.forEach(function (item) {
                item.classList.remove("selected");
            });

            card.classList.add("selected");

            const user = {
                name: name,
                phone: phone,
                email: email,
                role: role
            };

            localStorage.setItem("veloraUser", JSON.stringify(user));

            localStorage.removeItem("veloraSelectedCar");
            localStorage.removeItem("veloraBooking");
            localStorage.removeItem("veloraPersonalDetails");

            if (role === "customer") {
                window.location.href = "/cars.html";
            }

            if (role === "owner") {
                window.location.href = "/owner.html";
            }

        });

    });

    // PREVENT FORM SUBMISSION / PAGE RELOAD
    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
        });
    }

});
