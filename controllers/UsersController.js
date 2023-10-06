const sha1 = require('sha1');
const dbClient = require('../utils/db');

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;
    if (!email) {
      res.status(400).json({ error: 'Missing email' });
      return;
    }
    if (!password) {
      res.status(400).json({ error: 'Missing password' });
      return;
    }
    const user = await (await dbClient.usersCollection()).findOne({ email });
    if (user) {
      res.status(400).json({ error: 'Already exist' });
      return;
    }
    const newUser = await (await dbClient.usersCollection()).insertOne({
      email,
      password: sha1(password),
    });
    const id = newUser.insertedId.toString();
    res.status(201).json({ email, id });
  }

  static async getMe(req, res) {
    const { user } = req;
    res.status.json({ email: user.email, id: user._id.toString() });
  }
}
module.exports = UsersController;
