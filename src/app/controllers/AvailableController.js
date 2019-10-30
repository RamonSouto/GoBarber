import {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter,
} from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';

/* */
class AvailableController {
  async index(req, res) {
    /* pegando data passado por query */
    const { date } = req.query;

    /* verificando se veio alguma data no formato unix datetime */
    if (!date) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    /* transformado o numero de datetime em numero inteiro */
    const searchDate = Number(date);

    /* pegando agendamento pelo ID do Provider que não foram cancelados na data de hoje */
    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.params.providerId, // ProviderID passado por parametro na URL
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
    });

    /* agendamento de horar em hora das 08:00 ás 19:00 */
    const schedule = [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
      '20:00',
      '21:00',
      '22:00',
    ];

    const available = schedule.map(time => {
      /* Desestruturando time para horas e minutos atraves do split */
      const [hour, minute] = time.split(':');
      const value = setSeconds(
        setMinutes(setHours(searchDate, hour), minute),
        0
      );

      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        available:
          isAfter(value, new Date()) &&
          !appointments.find(a => format(a.date, 'HH:mm') === time),
      };
    });

    return res.json(available);
  }
}

export default new AvailableController();
