
const API_BASE_URL = 'http://localhost:8080/api';

export function saveToken(token) {
  sessionStorage.setItem('vibely_token', token);
}

export function getToken() {
  return sessionStorage.getItem('vibely_token');
}

export function clearToken() {
  sessionStorage.removeItem('vibely_token');
}

async function request(
  endpoint,
  data = null,
  method = 'POST',
  authenticated = false
) {
  const headers = {
    'Content-Type': 'application/json',
  };

  const token = getToken();

  if (authenticated && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (data !== null) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      result.message ||
      result.detail ||
      `Request failed (${response.status})`
    );
  }

  return result;
}

// Authentication
export function registerUser(userData) {
  return request('/auth/register', userData);
}

export async function loginUser(credentials) {
  const result = await request('/auth/login', credentials);

  if (result.token) {
    saveToken(result.token);
  } else {
    throw new Error('Login succeeded, but the response did not contain a token.');
  }

  return result;
}

export function getCurrentUser() {
  return request('/auth/me', null, 'GET', true);
}

// User profiles
export function getDiscoverUsers() {
  return request('/users', null, 'GET', true);
}

// Friend requests
export function sendFriendRequest(receiverId) {
  return request(
    `/friend-requests/${receiverId}`,
    null,
    'POST',
    true
  );
}

export function getIncomingRequests() {
  return request(
    '/friend-requests/incoming',
    null,
    'GET',
    true
  );
}

export function getOutgoingRequests() {
  return request(
    '/friend-requests/outgoing',
    null,
    'GET',
    true
  );
}

export function getFriends() {
  return request(
    '/friend-requests/friends',
    null,
    'GET',
    true
  );
}

export function acceptFriendRequest(requestId) {
  return request(
    `/friend-requests/${requestId}/accept`,
    null,
    'PUT',
    true
  );
}

export function rejectFriendRequest(requestId) {
  return request(
    `/friend-requests/${requestId}/reject`,
    null,
    'PUT',
    true
  );
}


 // Messaging
export function getConversation(otherUserId) {
  return request(
    `/messages/${otherUserId}`,
    null,
    'GET',
    true
  );
}

export function sendMessage(receiverId, content) {
  return request(
    `/messages/${receiverId}`,
    { content },
    'POST',
    true
  );
}
