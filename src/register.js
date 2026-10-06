const form = document.getElementById("register-form");

form.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if (!name || !phone) {
        alert("Please enter your name and phone number.");
        return;
    }

    if (!/^\d{10}$/.test(phone)) {
        alert("Please enter a valid 10-digit phone number.");
        return;
    }

    const user = {
        name: name,
        phone: phone
    };

    localStorage.setItem(
        "veloraUser",
        JSON.stringify(user)
    );

    localStorage.removeItem("veloraSelectedCar");
    localStorage.removeItem("veloraBooking");
    localStorage.removeItem("veloraPersonalDetails");

    window.location.href = "/cars.html";
});