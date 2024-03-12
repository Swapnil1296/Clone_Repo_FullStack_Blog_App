function getCookie(name) {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name))
    ?.split("=")[1];
  return cookieValue ? decodeURIComponent(cookieValue) : null;
}
const accessToken = getCookie("access_token");

function isTokenExpired() {
  const accessToken = getCookie("access_token");

  if (!accessToken) {
    // Token is not present
    return true;
  }

  try {
    const tokenPayload = JSON.parse(
      atob(accessToken.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
    );
    // Decode JWT payload
    const expirationTime = tokenPayload.exp * 1000; // Convert expiration time to milliseconds

    return expirationTime < Date.now();
  } catch (error) {
    console.error("Error parsing token payload:", error);
    return true; // Assume expired in case of parsing error
  }
}

export default isTokenExpired;
