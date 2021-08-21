 const InfoManager = require('./InfoManager');
const { Permissions } = require("discord.js");

class SettingsManager extends InfoManager {
   constructor(db) {
      super(db)
   }

   /**
    * Get the server setting from db
    */
   async get(guildId, key) {
      const res = await super.get(guildId, "settings." + key)
      return res
   }

   /**
    * Get ALL the server setting from db
    */
   async getAll(guildId) {
      const res = await super.get(guildId)
      if (!res || !res.settings) {
         return
      } else return res.settings

   }

   /**
    * Update setting to the db
    */
   async update(guildId, key, newValue) {
      await super.update(guildId, "settings." + key, newValue)
   }

   async set(guildId, key, newValue) {
      await this.update(guildId, key, newValue)
   }

   async checkAdmin(message) {

      const serverData = await super.get(message.guild.id, "settings");
      const adminRoleID = serverData.admin_role;

      if (message.member.roles.cache.has(adminRoleID)
         || message.member.hasPermission('ADMINISTRATOR')) {
         return null;
      } else return Permissions.FLAGS.ADMINISTRATOR;

   }

   async checkMember(message) {
      const serverData = await super.get(message.guild.id, "settings");
      const adminRoleID = serverData.admin_role;
      const memberRoleID = serverData.member_role;

      // if (memberRoleID == "") {     // check if dont have member role (deprecated)
      //    return null;
      // } else {
      if (message.member.roles.cache.has(adminRoleID)
         || message.member.roles.cache.has(memberRoleID)
         || message.member.hasPermission('ADMINISTRATOR')) {
         return null;
      }
      else return Permissions.FLAGS.ADMINISTRATOR;
      // }

   }

}

module.exports = SettingsManager