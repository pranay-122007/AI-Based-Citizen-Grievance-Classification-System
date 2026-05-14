const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, city } = req.body;

    res.status(200).json({
      success: true,
      message: "Registration Successful",
      user: {
        name,
        email,
        role,
        city,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Registration Failed",
    });
  }
};

module.exports = {
  registerUser,
};