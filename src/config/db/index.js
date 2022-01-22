const mongoose = require("mongoose");
async function connect() {
  try {
    await mongoose.connect(
      "mongodb+srv://admin:admin@cluster0.nxcyn.mongodb.net/VideoCall?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Connect successfully!!");
  } catch (error) {
    console.log("Connect Fuiler");
  }
}
module.exports = { connect };
