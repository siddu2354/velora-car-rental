/* ==========================================
   VELORA — OWNER DASHBOARD
   ========================================== */

const requestsContainer =
    document.getElementById("requests-container");

const noRequests =
    document.getElementById("no-requests");

const pendingCount =
    document.getElementById("pending-count");

const approvedCount =
    document.getElementById("approved-count");

const logoutButton =
    document.getElementById("logout-btn");


/* ==========================================
   LOAD BOOKING REQUESTS
   ========================================== */

function loadRequests() {

    const requests =
        JSON.parse(
            localStorage.getItem("veloraBookingRequests") || "[]"
        );

    requestsContainer.innerHTML = "";


    if (requests.length === 0) {

        noRequests.style.display = "block";

        pendingCount.textContent = "0";
        approvedCount.textContent = "0";

        return;
    }


    noRequests.style.display = "none";


    let pending = 0;
    let approved = 0;


    requests.forEach((request, index) => {

        if (request.status === "PENDING") {
            pending++;
        }

        if (request.status === "APPROVED") {
            approved++;
        }


        const card =
            document.createElement("div");

        card.className = "request-card";


        card.innerHTML = `

            <div class="request-top">

                <div>

                    <h3>
                        ${request.customerName || "Customer"}
                    </h3>

                    <p class="request-id">
                        ${request.bookingId || "VL00000000"}
                    </p>

                </div>

                <span class="${
                    request.status === "PENDING"
                        ? "pending-badge"
                        : ""
                }">

                    ${request.status || "PENDING"}

                </span>

            </div>


            <div class="request-details">

                <div>

                    <p class="detail-label">
                        VEHICLE
                    </p>

                    <p class="detail-value">
                        ${request.carName || "-"}
                    </p>

                </div>


                <div>

                    <p class="detail-label">
                        PICKUP
                    </p>

                    <p class="detail-value">
                        ${request.pickup || "-"}
                    </p>

                </div>


                <div>

                    <p class="detail-label">
                        DROP
                    </p>

                    <p class="detail-value">
                        ${request.drop || "-"}
                    </p>

                </div>


                <div>

                    <p class="detail-label">
                        TOTAL
                    </p>

                    <p class="request-total">
                        ₹${Number(request.total || 0).toLocaleString("en-IN")}
                    </p>

                </div>


                <div>

                    <p class="detail-label">
                        FROM
                    </p>

                    <p class="detail-value">
                        ${formatDate(request.fromDate)}
                    </p>

                </div>


                <div>

                    <p class="detail-label">
                        TO
                    </p>

                    <p class="detail-value">
                        ${formatDate(request.toDate)}
                    </p>

                </div>


                <div>

                    <p class="detail-label">
                        DAYS
                    </p>

                    <p class="detail-value">
                        ${request.days || "-"}
                    </p>

                </div>


                <div>

                    <p class="detail-label">
                        PHONE
                    </p>

                    <p class="detail-value">
                        ${request.phone || "-"}
                    </p>

                </div>

            </div>


            ${
                request.status === "PENDING"
                ? `

                <div class="request-actions">

                    <button
                        class="approve-btn"
                        data-index="${index}">
                        APPROVE
                    </button>

                    <button
                        class="reject-btn"
                        data-index="${index}">
                        REJECT
                    </button>

                </div>

                `
                : ""
            }

        `;


        requestsContainer.appendChild(card);

    });


    pendingCount.textContent = pending;

    approvedCount.textContent = approved;


    addActionListeners();

}


/* ==========================================
   DATE FORMAT
   ========================================== */

function formatDate(date) {

    if (!date) {
        return "-";
    }

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
        return date;
    }

    return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

}


/* ==========================================
   APPROVE / REJECT
   ========================================== */

function addActionListeners() {

    document
        .querySelectorAll(".approve-btn")
        .forEach((button) => {

            button.addEventListener("click", () => {

                const index =
                    Number(button.dataset.index);

                updateRequestStatus(
                    index,
                    "APPROVED"
                );

            });

        });


    document
        .querySelectorAll(".reject-btn")
        .forEach((button) => {

            button.addEventListener("click", () => {

                const index =
                    Number(button.dataset.index);

                updateRequestStatus(
                    index,
                    "REJECTED"
                );

            });

        });

}


/* ==========================================
   UPDATE REQUEST
   ========================================== */

function updateRequestStatus(index, status) {

    const requests =
        JSON.parse(
            localStorage.getItem("veloraBookingRequests") || "[]"
        );


    if (!requests[index]) {
        return;
    }


    requests[index].status = status;


    localStorage.setItem(
        "veloraBookingRequests",
        JSON.stringify(requests)
    );


    loadRequests();

}


/* ==========================================
   LOGOUT
   ========================================== */

logoutButton.addEventListener("click", () => {

    window.location.href = "/";

});


/* ==========================================
   INITIAL LOAD
   ========================================== */

loadRequests();


/* ==========================================
   AUTO REFRESH
   ========================================== */

setInterval(() => {

    loadRequests();

}, 2000);