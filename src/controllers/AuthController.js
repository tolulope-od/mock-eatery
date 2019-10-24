import User from '../models/User';
import UserService from '../services/UserService';
import ServerResponseModule from '../modules/ServerResponse';

const { error, success } = ServerResponseModule;

class AuthController {
  static async registerUser(req, res, next) {
    try {
      const { firstName, lastName, email, password } = req.body;

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return error(res, 409, {
          email: 'A user with that email already exists'
        });
      }

      const userService = new UserService(email, password);
      const avatar = userService.generateAvatar();
      const newUser = new User({
        firstName,
        lastName,
        avatar,
        email,
        password
      });
      const { token, verificationToken, encryptedPassword } = userService
        .encryptPassword()
        .generateToken(newUser)
        .getValues();

      newUser.password = encryptedPassword;
      newUser.verificationToken = verificationToken;
      const user = await newUser.save();

      return success(res, 201, 'auth', {
        token,
        message: 'User registered successfully'
      });
    } catch (err) {
      return next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        return error(res, 404, {
          auth: 'No user with the supplied credentials was found'
        });
      }

      const userService = new UserService(email, password);
      const userPasswordMatch = userService.decryptPassword(
        existingUser.password
      );
      if (!userPasswordMatch) {
        return error(res, 404, {
          auth: 'No user with the supplied credentials was found'
        });
      }

      const { token } = userService.generateToken(existingUser).getValues();

      return success(res, 200, 'auth', {
        token,
        message: 'User logged in successfully'
      });
    } catch (err) {
      return next(err);
    }
  }
}

export default AuthController;
