const { sanitizeEntity } = require("strapi-utils");

module.exports = {
  /**
   * Create a record.
   *
   * @return {Object}
   */

  async create(ctx) {
    let entity;
    const { phone } = ctx.request.body;

    const isRegistered = await strapi.query("client").findOne({ phone });

    if (isRegistered) {
      ctx.response.status = 400;
      ctx.response.message = "User is already exists";
    } else {
      entity = await strapi.services.client.create(ctx.request.body);
    }
    return sanitizeEntity(entity, { model: strapi.models.client });
  },

  async login(ctx) {
    let entity;

    entity = await strapi.services.client.login(ctx.request.body);

    if (entity) {
      return sanitizeEntity(entity, { model: strapi.models.client });
    } else {
      ctx.response.status = 400;
      ctx.response.message = "Phone number or password is incorrect";
    }
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const { token } = ctx.request.header;

    const entity = await strapi.services.client.findOne({ id });

    if (entity.token === token) {
      return sanitizeEntity(entity, { model: strapi.models.client });
    } else {
      ctx.response.status = 401;
      ctx.response.message = "token is invalid";
    }
  },

  async update(ctx) {
    const { id } = ctx.params;

    let entity;

    entity = await strapi.services.client.update({ id }, ctx.request.body);

    return sanitizeEntity(entity, { model: strapi.models.client });
  },
};
