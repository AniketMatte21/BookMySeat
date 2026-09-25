import { apiClient } from "./Client";

export const BookingAPi = {
  // Directly sends raw array: [100, 101]
  bookTicket: (showId, seats) =>
    apiClient(`api/booking/book-seats?showId=${showId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: seats, // Serializes to "[100, 101]"
    }),

    handleCheckout: (bookingDetails) =>
    apiClient(`api/payment/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: bookingDetails, // Serializes to JSON
    }),

    getBookedTickets: (bookingId) => apiClient(`api/booking/ticket/${bookingId}`),

    getAllTicketsByUserId: () => apiClient(`api/booking/get-tickets-by-userId`),


};