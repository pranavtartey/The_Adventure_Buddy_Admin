require("dotenv").config();
const express = require("express");
const app = express();
const adminRoutes = require("./Routes/Admin");

const PORT = process.env.PORT || 8080;

app.use("/the_adventure_buddy/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
