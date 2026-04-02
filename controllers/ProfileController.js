const { Profile, User } = require("../models");

class ProfileController {
  static async getProfile(req, res) {
    try {
      var userId = req.session.userId;

      // eager loading: User + Profile
      var user = await User.findByPk(userId, {
        include: [{ model: Profile }],
      });

      res.render("profile/index", { user: user });
    } catch (error) {
      res.send(error.message);
    }
  }

  static async postUpdateProfile(req, res) {
    try {
      var userId = req.session.userId;
      var address = req.body.address;
      var phoneNumber = req.body.phoneNumber;
      var avatarUrl = req.body.avatarUrl;

      var profile = await Profile.findOne({ where: { userId: userId } });

      if (profile) {
        await profile.update({
          address: address,
          phoneNumber: phoneNumber,
          avatarUrl: avatarUrl,
        });
      } else {
        await Profile.create({
          address: address,
          phoneNumber: phoneNumber,
          avatarUrl: avatarUrl,
          userId: userId,
        });
      }

      res.redirect("/profile");
    } catch (error) {
      res.send(error.message);
    }
  }
}

module.exports = ProfileController;
