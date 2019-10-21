import gravatar from 'gravatar';
import { hashSync, compareSync } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class UserService {
  constructor(email, password) {
    this.email = email;
    this.password = password;
    this.avatar = '';
    this.token = '';
    this.verificationToken = '';
  }

  generateAvatar() {
    const avatar = gravatar.url(this.email, {
      s: '200',
      r: 'pg',
      d: 'mm'
    });

    this.avatar = avatar;
    return this.avatar;
  }

  encryptPassword() {
    this.password = hashSync(this.password, 10);
    this.verificationToken = hashSync(this.email, 10);
    return this;
  }

  generateToken({ _id, firstName, lastName, userType, isVerified }) {
    const payload = { _id, firstName, lastName, userType, isVerified };
    const token = jwt.sign(payload, process.env.SECRET_OR_KEY, {
      expiresIn: '24h'
    });

    this.token = `Bearer ${token}`;

    return this;
  }

  getValues() {
    return {
      email: this.email,
      encryptedPassword: this.password,
      token: this.token,
      verificationToken: this.verificationToken
    };
  }

  decryptPassword(encryptedPassword) {
    return compareSync(this.password, encryptedPassword);
  }
}

export default UserService;
