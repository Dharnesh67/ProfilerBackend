const jwt = require("jsonwebtoken");
const firebase = require("firebase-admin");
const serviceAccount = require("../../profiler-backend-ab927-firebase-adminsdk-fbsvc-9bb8fecede.json");

const User = require("../models/user");
const UserRepository = require("../repositories/userRepository");
const { generateToken } = require("../utils/common/jwt");

const userRepository = new UserRepository(User);

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
});

class AuthService {
  async signup(userData) {
    const existingUser = await userRepository.findUser(userData.email);
    if (existingUser) {
      console.log("User already exists");
      // If the user already exists, check if the authMethod is "Google"
      const token = generateToken({ id: existingUser._id });
      return {
        user: {
          id: existingUser._id,
          name: existingUser.name,
          email: existingUser.email,
          country: existingUser.country,
          pfpURL: existingUser.pfpURL,
          credits: existingUser.credits,
          authMethod: existingUser.authMethod,
        },
        token,
      };
    }
    try {
      const user = await userRepository.createUser(userData);
      const token = generateToken({ id: user._id });
      return {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token,
      };
    } catch (error) {
      console.error("AuthService Signup Error:", error);
      throw error;
    }
  }

  async signin(email, password) {
    try {
      const user = await userRepository.findUser(email);
      const passCheck = await user.comparePasswords(password, user.password);

      if (!user || !passCheck) {
        return new Error("Invalid email or password");
      }

      const token = generateToken({ id: user._id });

      return {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          country: user.country,
        },
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  async googleSignIn(email) {
    try {
      let user = await userRepository.findUser(email);

      if (!user) {
        return new Error("User not found");
      }

      const token = generateToken({ id: user._id });

      return {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          country: user.country,
        },
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      const result = await userRepository.delete(userId);
      return {
        success: true,
        message: "User and associated Freemium account deleted successfully.",
        result,
      };
    } catch (error) {
      console.error("AuthService Delete Error:", error);
      throw new Error("Failed to delete user account.");
    }
  }

  async deleteUser(userId) {
    try {
      const result = await userRepository.findById(userId);
      return {
        success: true,
        message: "User found successfully.",
        result,
      };
    } catch (error) {
      throw new Error("Failed to find user account.");
    }
  }
}

module.exports = AuthService;
