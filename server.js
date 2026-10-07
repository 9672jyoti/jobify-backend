require("dotenv").config();

const mongoose = require("mongoose");

const { MONGODB_URI, PORT, HOST } = require("./utils/config");
const app = require("./app")

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to DB");

     app.listen(PORT, HOST, () => {
  console.log(`server running on http://${HOST}:${PORT}`);
})
   .on('error',(error)=>{
          console.log('error the starting server', error.message);
   })
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error.message);
  });