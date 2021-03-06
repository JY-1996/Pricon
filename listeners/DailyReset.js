const { Listener } = require('discord-akairo');
const DatabaseManager = require("../classes/DatabaseManager");
const AdminManager = require("../classes/AdminManager");

class DailyResetListener extends Listener {
   constructor() {
      super('dailyReset', {
         emitter: 'client',
         event: 'dailyReset'
      });
   }

   async exec() {
      console.log("[E][Daily Reset]: ------------- START -------------")
      const db = this.client.db
      const dm = new DatabaseManager(db)
      const am = new AdminManager(db)

      const res = await dm.getAllGuild()
      let resetServerId = res.docs.map(d => d.id) 
      console.log(resetServerId)
      console.log(`Currently targetting ${resetServerId.length} guild...\n`)

      for (let serverId of resetServerId) {
         const guild = this.client.util.resolveGuild(serverId, this.client.guilds.cache)
         if (guild) {
            await am.deleteGuildKnife(guild.id,"knife")
            await am.deleteGuildKnife(guild.id,"member")
            this.client.emit("reportUpdate", guild);
            this.client.emit("memberUpdate",guild);
            console.log(`> End of guild reset for ${guild.id} (${guild.name})\n`)

         } else {

            console.log(`> Skipping guild: ${serverId} (N/A)`)
         }

      }
      console.log("[E][Daily Reset]: -------------- END --------------")
   }
}

module.exports = DailyResetListener;