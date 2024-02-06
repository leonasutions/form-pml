export const CORS_OPTIONS = {
    origin: true, // or '*' or whatever is required
    allowedHeaders: [
      "Access-Control-Allow-Origin",
      "Origin",
      "X-Requested-With",
      "Accept",
      "Content-Type",
      "Authorization",
    ],
    exposedHeaders: "Authorization",
    credentials: true,
    methods: ["GET", "PUT", "PATCH", "OPTIONS", "POST", "DELETE"],
  };
  