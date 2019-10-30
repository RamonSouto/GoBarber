import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';
import User from '../models/User';

/* */
class ScheduleController {
  async index(req, res) {
    /* Verificação se usuario e um prestador de serviço */
    const checkUserProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    /* Se usuario não for prestador de serviço retorna erro */
    if (!checkUserProvider) {
      res.status(401).json({ error: 'User is not a provider' });
    }

    /* Verificar se a data esta sendo passado por query */
    const { date } = req.query;
    const parsedDate = parseISO(date);

    /* Trazer agendamento para prestadores de serviço */
    const schedule = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      order: ['date'],
    });

    res.status(200).json({ schedule });
  }
}

export default new ScheduleController();
