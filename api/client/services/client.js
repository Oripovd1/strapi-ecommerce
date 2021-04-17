const { isDraft } = require("strapi-utils").contentTypes;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports = {
  /**
   * Promise to add record
   *
   * @return {Promise}
   */

  async create(data) {
    const isDraftData = isDraft(data, strapi.models.client);
    const validData = await strapi.entityValidator.validateEntityCreation(
      strapi.models.client,
      data,
      { isDraftData }
    );

    const hashedPassword = bcrypt.hashSync(validData.password, 8);

    const token = jwt.sign({ id: data._id }, "Secret", {});
    validData.token = token;
    validData.password = hashedPassword;

    const entry = await strapi.query("client").create(validData);

    return entry;
  },

  async login(data) {
    const { phone, password } = data;

    const entity = await strapi.query("client").findOne({ phone });
    const passwordIsValid = bcrypt.compareSync(password, entity.password);

    if (passwordIsValid) {
      return entity;
    }

    return;
  },

  async update(params, data) {
    const existingEntry = await strapi.query("client").findOne(params);

    const isDraftData = isDraft(existingEntry, strapi.models.client);
    const validData = await strapi.entityValidator.validateEntityUpdate(
      strapi.models.client,
      data,
      { isDraftData }
    );

    const hashedPassword = bcrypt.hashSync(validData.password, 8);
    validData.password = hashedPassword;

    const entry = await strapi.query("client").update(params, validData);

    return entry;
  },
};
