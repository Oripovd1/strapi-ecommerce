const { isDraft } = require("strapi-utils").contentTypes;

module.exports = {
  /**
   * Promise to add record
   *
   * @return {Promise}
   */

  async create(data) {
    const isDraftData = isDraft(data, strapi.models.order);
    const validData = await strapi.entityValidator.validateEntityCreation(
      strapi.models.order,
      data,
      { isDraftData }
    );

    const entry = await strapi.query("order").create(validData);

    return entry;
  },
};
