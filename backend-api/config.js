const isProd = process.env.NODE_ENV === "production";

module.exports = {
  isProd,
  sessionCookie: {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  },
  allowedOrigins: [
    "http://localhost:3000",
    "https://howardsfarm.org",
    "https://www.howardsfarm.org",
    "https://howards-farm-app-c0cmbderahfva9er.westus2-01.azurewebsites.net",
  ],
};
