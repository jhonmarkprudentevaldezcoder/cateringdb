const express = require("express");
const mongoose = require("mongoose");
const Users = require("./models/userModel");
const Themes = require("./models/themeModel");
const Foods = require("./models/foodModel");
const Drinks = require("./models/drinkModel");
const ReservedDates = require("./models/reservedDateModel");
const FoodOrders = require("./models/foodOrdersModel");
const Reservation = require("./models/reservedModel");
const FoodCart = require("./models/cartModel");
const CartTotal = require("./models/cartTotal");

const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//default route
app.get("/", (req, res) => {
  res.send("API CATERING APP WORKING SUCCESS");
});

//get user history
app.get("/history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const reservation = await Reservation.find({ userId: userId });

    if (reservation.length === 0) {
      return res.status(404).json({ message: "No history records found" });
    }

    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/carttotal/:userId/:total", async (req, res) => {
  try {
    const { userId, total } = req.params;

    // Assuming your CartTotal model has a 'total' field
    const carttotal = await CartTotal.findOneAndUpdate(
      { userId: userId },
      { total: total, ...req.body },
      { new: true }
    );

    if (!carttotal) {
      return res
        .status(404)
        .json({ message: `Cannot find any CartTotal with ID ${userId}` });
    }

    res.status(200).json(carttotal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//get user history
app.get("/carttotal/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const carttotal = await CartTotal.find({ userId: userId });

    if (carttotal.length === 0) {
      return res.status(404).json({ message: "No history records found" });
    }

    res.status(200).json(carttotal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//add to reserved
app.post("/carttotal", async (req, res) => {
  try {
    const carttotal = await CartTotal.create(req.body);
    res.status(200).json(carttotal);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

//check date
app.get("/reserve/:themeId/:date", async (req, res) => {
  try {
    const { themeId, date } = req.params;

    const reservedDate = await ReservedDates.findOne({
      themeId: themeId,
      date: date,
    });

    if (reservedDate) {
      return res.status(200).json({ message: "reserved" });
    } else {
      return res.status(200).json({ message: "available" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove a food item from the user's cart
app.delete("/cart/:userId/:foodItemId", async (req, res) => {
  try {
    const { userId, foodItemId } = req.params;

    // Assuming you have a FoodCart model with a unique identifier (e.g., _id)
    const removedItem = await FoodCart.findOneAndDelete({
      _id: foodItemId,
      reservationId: userId,
    });

    if (!removedItem) {
      return res
        .status(404)
        .json({ message: "Food item not found in the user's cart" });
    }

    res
      .status(200)
      .json({ message: "Food item removed successfully", removedItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//get user cart
app.get("/cart/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await FoodCart.find({ reservationId: userId });

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders id matching records found" });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//reserved a date
app.post("/check-date", async (req, res) => {
  try {
    const { date } = req.body;

    const existingReservation = await Reservation.findOne({
      date: date,
    });

    if (existingReservation) {
      return res.status(400).json({ message: "reserved." });
    }

    res.status(201).json({ message: "access" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//add to reserved
app.post("/reserved", async (req, res) => {
  try {
    const reserved = await Reservation.create(req.body);
    res.status(200).json(reserved);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

//add to cart
app.post("/cart", async (req, res) => {
  try {
    const cart = await FoodCart.create(req.body);
    res.status(200).json(cart);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

//add theme
app.post("/theme", async (req, res) => {
  try {
    const theme = await Themes.create(req.body);
    res.status(200).json(theme);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

//add foood order
app.post("/order", async (req, res) => {
  try {
    const order = await FoodOrders.create(req.body);
    res.status(200).json(order);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

//get user order
app.get("/order/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await FoodOrders.find({ userId: userId });

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders id matching records found" });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//get all thenes
app.get("/theme", async (req, res) => {
  try {
    const themes = await Themes.find({});
    res.status(200).json(themes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//search theme by category
app.get("/theme/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const theme = await Themes.find({ category: category });

    if (theme.length === 0) {
      return res
        .status(404)
        .json({ message: "No resreved id matching records found" });
    }

    res.status(200).json(theme);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//update theme
app.put("/theme/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const theme = await Themes.findByIdAndUpdate(id, req.body);

    if (!theme) {
      return res
        .status(404)
        .json({ message: `cannot find any Bus with ID ${id}` });
    }
    const updatedtheme = await Themes.findById(id);
    res.status(200).json(updatedtheme);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//register
app.post("/register", async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await Users.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already taken." });
    }

    const user = await Users.create(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await Users.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Authentication failed. User not found." });
    }

    // Compare the provided password with the stored password
    if (user.password !== password) {
      return res
        .status(401)
        .json({ message: "Authentication failed. Incorrect password." });
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user._id }, "your-secret-key", {
      expiresIn: "1h",
    });

    // Set the token as a cookie (optional)
    res.cookie("jwt", token, { httpOnly: true, maxAge: 3600000 }); // 1 hour

    // Respond with the token as a Bearer token
    res.status(200).json({
      message: "Authentication successful",
      token: `${token}`,
      userId: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      contact: user.contact,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// close theme

// food

//add food
app.post("/food", async (req, res) => {
  try {
    const food = await Foods.create(req.body);
    res.status(200).json(food);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

//get all foods
app.get("/food", async (req, res) => {
  try {
    const foods = await Foods.find({});
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//search foods by category
app.get("/food/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const food = await Foods.find({ category: category });

    if (food.length === 0) {
      return res
        .status(404)
        .json({ message: "No resreved id matching records found" });
    }

    res.status(200).json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//update food
app.put("/food/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const food = await Foods.findByIdAndUpdate(id, req.body);

    if (!food) {
      return res
        .status(404)
        .json({ message: `cannot find any Bus with ID ${id}` });
    }
    const updatedFood = await Foods.findById(id);
    res.status(200).json(updatedFood);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// close food

// drinks

//add drinks
app.post("/drink", async (req, res) => {
  try {
    const drink = await Drinks.create(req.body);
    res.status(200).json(drink);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

//get all foods
app.get("/drink", async (req, res) => {
  try {
    const drinks = await Drinks.find({});
    res.status(200).json(drinks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//search foods by category
app.get("/drink/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const drink = await Drinks.find({ category: category });

    if (drink.length === 0) {
      return res
        .status(404)
        .json({ message: "No resreved id matching records found" });
    }

    res.status(200).json(drink);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//update food
app.put("/drink/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const drink = await Drinks.findByIdAndUpdate(id, req.body);

    if (!drink) {
      return res
        .status(404)
        .json({ message: `cannot find any Bus with ID ${id}` });
    }
    const updateddrink = await Drinks.findById(id);
    res.status(200).json(updateddrink);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

mongoose.set("strictQuery", false);
mongoose
  .connect(
    "mongodb+srv://catering4D:catering%40123@cateringcluster.t92orr6.mongodb.net/reservation_management"
  )
  .then(() => {
    console.log("connected to MongoDB");
    app.listen(3000, () => {
      console.log(`Node API app is running on port 3000`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
