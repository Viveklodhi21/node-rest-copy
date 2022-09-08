const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const { BadRequestError, UnauthenticatedError } = require("../errors/index");

const register = async (req, res) => {
  // we can send this kind of things too
  // res.send("register user");
  // res.json(req.body );
  // const { name, email, password } = req.body;

  // we did it in the schema using schema.pre({})

  // const salt = await bcrypt.genSalt(10);
  // const hashedPassword = await bcrypt.hashPassword(password, salt);
  // const tempUser = { name, email, password: hashedPassword };

  // const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new BadRequestError("please provide name and email and password");
  }
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  //done in schema
  // const token = jwt.sign({ userId: user._id, name: user.name }, "jwtSecret", {
  //   expiresIn: "30d",
  // });
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  // compare password
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = { register, login };
