import { apiClient } from './Client';

export const EventApi = {
 getAllEvents: () => apiClient('api/event'),
 getSearchEvent: (query) => apiClient(`api/search-event/_search?q=${query}`),
 getEventById: (eventId)=> apiClient(`api/event/${eventId}`),
 getShows: (eventId,city,showDate) => apiClient(`api/event/shows/${eventId}?city=${city}&showDate=${showDate}`),
 getSeatLayout: (screenId,showId) => apiClient(`api/event/seats/${screenId}/${showId}`),
};