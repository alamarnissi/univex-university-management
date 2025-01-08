export default () => ({
  port: parseInt(process.env.PORT) || 5050,
  jwt_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
});
