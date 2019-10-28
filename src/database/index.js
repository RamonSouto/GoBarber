import Sequelize from 'sequelize';

import User from '../app/models/User';
import File from '../app/models/File';
import Appointmet from '../app/models/Appointment';

import databaseconfig from '../config/database';

const models = [User, File, Appointmet];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseconfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
