

import BASE_URL from './base_url.js';

// fetch events
export const fetchEvents = async (params = {}) => {
  try {
    const { upcoming = false, limit = 12, page = 1, startDate, endDate } = params;
    const queryParams = new URLSearchParams({
      upcoming: upcoming.toString(),
      limit: limit.toString(),
      page: page.toString(),
    });
    
    if (startDate) {
      queryParams.append('startDate', startDate);
    }
    if (endDate) {
      queryParams.append('endDate', endDate);
    }

    const response = await fetch(`${BASE_URL}/api/events?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

// fetch single event by ID
export const fetchEventById = async (eventId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/events/${eventId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

// create subscription
export const createSubscription = async (subscriptionData) => {
  try {
    const { email, eventId, optIn = true } = subscriptionData;

    if (!email || !eventId) {
      throw new Error('Email and eventId are required');
    }

    const response = await fetch(`${BASE_URL}/api/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        eventId,
        optIn,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

// verify OTP
// OTP Flow Commented Out
// export const verifyOTP = async (data) => {
//   try {
//     const { email, eventId, otp } = data;

//     if (!email || !eventId || !otp) {
//       throw new Error('Email, event ID, and OTP are required');
//     }

//     const response = await fetch(`${BASE_URL}/api/subscriptions/verify`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ email, eventId, otp }),
//     });

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}));
//       throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
//     }

//     const result = await response.json();
//     return result;
//   } catch (error) {
//     console.error('Error verifying OTP:', error);
//     throw error;
//   }
// };

    // get subscriptions
export const fetchSubscriptions = async (params = {}) => {
  try {
    const { limit = 1000 } = params;
    const queryParams = new URLSearchParams({
      limit: limit.toString(),
    });

    const response = await fetch(`${BASE_URL}/api/subscriptions?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    throw error;
  }
};

