import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification';
import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    /* trazer pelo id do usuario e o que não foi cancelado,
       ordenado por data,
       trazer somenteo id e data,
       limite de 20 registro por vez
       trazer somente o id e o nome do provider e o avatar */
    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'], // ordenado por data,
      attributes: ['id', 'date'], // trazer somenteo id e data,
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'], // trazer somente o id e o nome do provider
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'], // trazer avatar do provider
            },
          ],
        },
      ],
    });

    res.status(200).json({ appointments });
  }

  // incluir registro
  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    /* Verifica se foi passado alguma coisa
    validada pelo schema pelo requisição */
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    /* Faz a descontrução do que foi passado no corpo da requisição */
    const { provider_id, date } = req.body;

    /* Faz verificação se provider_id e um provider */
    const checkIsProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    /* Ser provider_id for falso retorna msg de erro */
    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointment with providers' });
    }

    /* Verificar se data e data passada */
    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(401).json({ error: 'Past dates are not permitted' });
    }

    /* Verificar se o provider já não tem a hora marcada */
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      return res
        .status(401)
        .json({ error: 'Appointment date is not available' });
    }

    /* Verificar se pestador e igual a cliente */
    if (req.userId === provider_id) {
      res.status(400).json({ error: 'Provider equals as Client' });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date,
    });

    /* Pegando nome do usuario */
    const user = await User.findByPk(req.userId);

    /* Formatar data */
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM ', as' HH:mm'h'",
      { locale: pt }
    );
    /* Notificar prestador de serviço */
    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formattedDate}`,
      user: provider_id,
    });

    return res.json(appointment);
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name'],
        },
      ],
    });

    if (appointment.user_id !== req.userId) {
      return res.status(401).json({
        error: "You don't have permission to cancel this appointment ",
      });
    }

    /* Pega a hora do agendamento e subtrai duas horas */
    const dateWithSub = subHours(appointment.date, 2);

    if (isBefore(dateWithSub, new Date())) {
      return res
        .status(401)
        .json({ error: 'You can only appointment 2 hours in advanced' });
    }

    appointment.canceled_at = new Date();

    await appointment.save();

    await Queue.add(CancellationMail.key, { appointment });

    return res.json(appointment);
  }
}

export default new AppointmentController();
