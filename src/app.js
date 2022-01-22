let express = require("express");
let app = express();
var jwt = require("jsonwebtoken");
let server = require("http").Server(app);
let io = require("socket.io")(server);
let stream = require("./ws/stream");
let path = require("path");
let favicon = require("serve-favicon");
const morgan = require("morgan");
const handlebars = require("express-handlebars");
var hbs = handlebars.create({});
const db = require("./config/db");
var cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  cookieSession({
    name: "session",
    keys: ["tokenId"],
  })
);
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

var methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.json());
db.connect();
///model/controller
const User = require("./models/auth");
const Room = require("./models/room");
const { mutipleMongooseToObject } = require("./util/mongoose");
const { mongooseToObject } = require("./util/mongoose");
//HTTP
app.use(morgan("combined"));
//Templates Engine

app.set("views", path.join(__dirname, "resources/views"));

app.use(favicon(path.join(__dirname, "favicon.ico")));
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname, "public")));

const authMiddleware = require("./middlewares/auth");
const room = require("./models/room");
app.get("/", authMiddleware.auth, (req, res, next) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/homepage", authMiddleware.auth, (req, res) => {
  res.render("home");
});
app.get("/homepage-admin", authMiddleware.auth, (req, res) => {
  res.render("adminhome");
});
app.post("/ok", (req, res) => {
  Room.findOne({ name_room: "ok" })
    .then((data) => {
      if (data) {
        res.status(300).json("Email đã tồn tại");
      } else {
        const user = new Room("ok");
        return user
          .save()
          .then(() => res.send("Ok"))
          .catch((error) => {});
      }
    })
    .catch(() => res.status(500).json("Server Bận"));
});
//SIGNUP
app.get("/auth/sign-up/", (req, res) => {
  res.render("./auth/signup");
});
app.post("/auth/sign-up/post/", (req, res) => {
  User.findOne({ email: req.body.email })
    .then((data) => {
      if (data) {
        res.status(300).json("Email đã tồn tại");
      } else {
        const user = new User(req.body);
        return user
          .save()
          .then(() => res.redirect("/auth/sign-in/"))
          .catch((error) => {});
      }
    })
    .catch(() => res.status(500).json("Server Bận"));
});
//LOGIN
app.get("/auth/sign-in/", (req, res) => {
  res.render("./auth/login");
});
app.post("/auth/sign-in/post/", (req, res) => {
  var email = req.body.email;
  var password = req.body.password;
  User.findOne({ email: email, password: password })
    .then((data) => {
      if (data) {
        var token = jwt.sign({ _id: data._id }, "1712");
        res.cookie("tokenId", token);

        res.locals.fullname = data.fullname;

        if (data.role == "user") {
          res.redirect("/homepage/");
        } else {
          res.redirect("/homepage-admin/");
        }
      } else {
        res.status(300).json("Thất Bại");
      }
    })
    .catch(() => res.status(500).json("Server Bận"));
});
//Me
app.get("/users/store/", (req, res) => {
  let productQuery = User.find({});
  //Kiểm tra xem có ycau sort trên URL
  if (req.query.hasOwnProperty("_sort")) {
    productQuery = productQuery.sort({
      [req.query.column]: req.query.type,
    });
  }

  Promise.all([productQuery, User.countDocumentsDeleted()])
    .then(([product, countdeleted]) => {
      res.render("./admin/usermn", {
        countdeleted,
        product: mutipleMongooseToObject(product),
      });
    })
    .catch();
});
app.get("/rooms/store/", (req, res) => {
  let productQuery = Room.find({});
  //Kiểm tra xem có ycau sort trên URL
  if (req.query.hasOwnProperty("_sort")) {
    productQuery = productQuery.sort({
      [req.query.column]: req.query.type,
    });
  }

  Promise.all([productQuery, Room.countDocumentsDeleted()])
    .then(([product, countdeleted]) => {
      res.render("./admin/roommn", {
        countdeleted,
        product: mutipleMongooseToObject(product),
      });
    })
    .catch();
});
app.delete("/:id/products/", (req, res, next) => {
  User.deleteOne({ _id: req.params.id })
    .then(() => res.redirect("back"))
    .catch(next);
});
app.delete("/:id/product/", (req, res, next) => {
  Room.deleteOne({ _id: req.params.id })
    .then(() => res.redirect("back"))
    .catch(next);
});

app.delete("/products/:id/", (req, res, next) => {
  User.delete({ _id: req.params.id })
    .then(() => {
      res.redirect("back");
    })
    .catch(next);
});
app.delete("/product/:id/", (req, res, next) => {
  Room.delete({ _id: req.params.id })
    .then(() => {
      res.redirect("back");
    })
    .catch(next);
});

app.get("/logout/", (req, res) => {
  res.clearCookie("tokenId");
  res.redirect("/");
});
app.post("/oks", (req, res, next) => {
  const roomname = req.body.name_room;
  const room = new Room(req.body);

  return room.save();
});
io.of("/stream").on("connection", stream);

// server.listen( 3000 );
// route(app);
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`Connection at http://localhost:${port}`);
});
