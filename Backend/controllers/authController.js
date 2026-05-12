const jwt = require("jsonwebtoken");
const { admin, db } = require("../firebase/firebaseAdmin");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Create Firebase User
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    let userRole = "citizen";
    let status = "approved";

    // If admin registration requested
    if (role === "admin") {
      userRole = "pending_admin";
      status = "pending";

      await db.collection("adminRequests").doc(userRecord.uid).set({
        uid: userRecord.uid,
        name,
        email,
        status: "pending",
        requestedAt: new Date(),
      });
    }

    // Save user in Firestore
    await db.collection("users").doc(userRecord.uid).set({
      uid: userRecord.uid,
      name,
      email,
      role: userRole,
      status,
      createdAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message:
        role === "admin"
          ? "Admin request submitted for approval"
          : "Citizen registered successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user in Firestore
    const snapshot = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userData = snapshot.docs[0].data();

    // JWT Token
    const token = jwt.sign(
      {
        uid: userData.uid,
        role: userData.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      token,
      user: userData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};