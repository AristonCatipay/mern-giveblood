const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const registerUser = async (req, res) => {
  const { firstName, middleName, lastName, age, email, username, password } =
    req.body;

  // Add validation for required fields
  if (
    !firstName ||
    !middleName ||
    !lastName ||
    !age ||
    !email ||
    !username ||
    !password
  ) {
    return res
      .status(400)
      .json({ error: "All required fields must be provided" });
  }

  try {
    // Check for existing username or email
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(409).json({ error: "Username already in use." });
      }
      if (existingUser.email === email) {
        return res.status(409).json({ error: "Email already in use." });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      firstName,
      middleName,
      lastName,
      email,
      age,
      username,
      password: hashedPassword,
    });

    // Return user data without password
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({ user: userResponse });
  } catch (error) {
    console.error("Registration error:", error); // Log the full error for debugging

    let statusCode = 500;
    let errorMessage = "Registration failed";

    if (error.name === "ValidationError") {
      statusCode = 400;
      errorMessage = Object.values(error.errors)
        .map((val) => val.message)
        .join(", ");
    } else if (error.code === 11000) {
      statusCode = 409;
      errorMessage = "Username or email already exists";
    } else if (error.message) {
      errorMessage = error.message;
    }

    res.status(statusCode).json({ error: errorMessage });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    // Make sure the payload uses "userId" consistently
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      username: user.username,
      userId: user._id,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserMe,
};
