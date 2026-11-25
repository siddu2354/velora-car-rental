import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                register: resolve(__dirname, "register.html"),
                cars: resolve(__dirname, "cars.html"),
                carDetails: resolve(__dirname, "car-details.html"),
                personalDetails: resolve(__dirname, "personal-details.html"),
                requestSubmitted: resolve(__dirname, "request-submitted.html"),
                payment: resolve(__dirname, "payment.html"),
                bookingConfirmation: resolve(__dirname, "booking-confirmation.html"),
                bookingHistory: resolve(__dirname, "booking-history.html"),
                owner: resolve(__dirname, "owner.html")
            }
        }
    }
});