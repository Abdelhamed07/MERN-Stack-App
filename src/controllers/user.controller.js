const jwt = require('jsonwebtoken');
const User = require("../models/user.model");
const userController = {};
/**
 * Sing Up Logic
 */
userController.register = async (req, res, next) => {
  const { name, email, password, joind } = req.body;
  const newUser = new User({
    name,
    email,
    password,
    joind
  });
  try {
    const user = await newUser.save();
    return res.send({ user });
  } catch (e) {
    if (e.code === 11000 && e.name === "MongoError") {
      var error = new Error(`Email address ${newUser.email} is already taken`);
      next(error);
    } else {
      next(e);
    }
  }
};

/**
 * Sing In Logic
 */

userController.login = async (req, res, next) => {
  //Username, Password in requset
  const { email, password } = req.body;

  //Check userbane and Password are Ok
  try {
    const user = await User.findOne({ email });
    if (!user) {
      const err = new error(`The Email ${email} was not found on our system`);
      err.status = 401;
      next(err);
    }

    user.isPasswordMatch(password, user.password, (err, matched) => {
      if (matched) {
        
        //Secret
        const secret = process.env.JWT_SECRET;
        
        //Expiration

        const expire = process.env.JWT_EXPIRATION;
        
        const tocken = jwt.sign({ _id: user._id }, secret, { expiresIn: expire });
        return res.send({ tocken });
        //if Check ok, then create JWT and return it

//        return res.send({ message: 'you can login' });
      }
      res.status(401).send({
        error: 'Invalid username/password combination'
      });
    });
  } catch (e) {
    next(e);
  }
};

module.exports = userController;
