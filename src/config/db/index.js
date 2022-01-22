const mongoose = require("mongoose");
MONGODB_URI =
  "mongodb+srv://admin:admin@cluster0.nxcyn.mongodb.net/VideoCall?retryWrites=true&w=majority";
function connect() {
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
  const conn = mongoose.connection;
  mongoose.connection.once("open", () => {
    console.log("MongoDB Connected");
  });
  mongoose.connection.on("error", (err) => {
    console.log("MongoDB connection error: ", err);
  });
  // try {
  //   await mongoose.connect(process.env.MONGODB_URI, {
  //     useNewUrlParser: true,
  //     useUnifiedTopology: true,
  //     // useFindAndModify: false,
  //     // useCreateIndex: true,
  //   });
  //   console.log("Connect successfully!!");
  // } catch (error) {
  //   console.log("Connect failure!!");
  // }
}
module.exports = { connect };
