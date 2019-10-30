import Notification from '../schemas/Notification';
import User from '../models/User';

/* */
class NotificationController {
  async index(req, res) {
    /* Faz verificação se provider_id e um provider */
    const checkIsProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    /* */
    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: 'Only provider can load notification' });
    }

    const notification = await Notification.find({
      user: req.userId,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);

    console.log(req.userId);

    return res.json(notification);
  }

  async update(req, res) {
    // const notification = await Notification.findById(req.params.id)

    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    return res.json(notification);
  }
}

export default new NotificationController();
