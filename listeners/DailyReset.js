const { Listener } = require('discord-akairo');
const DatabaseManager = require("../classes/DatabaseManager");

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
      const res = await dm.getAllGuild()

      let resetServerId = []
      res.forEach(doc =>{
        console.log(doc.id)
        resetServerId.push(doc.id)
      })
      console.log(resetServerId)
      console.log(`Currently targetting ${resetServerId.length} guild...\n`)

      for (let serverId of resetServerId) {
         const guild = this.client.util.resolveGuild(serverId, this.client.guilds.cache)
         if (guild) {
            await dm.deleteGuildKnife(guild.id)

            this.client.emit("reportUpdate", guild);
            console.log(`> End of guild reset for ${guild.id} (${guild.name})\n`)

         } else {

            console.log(`> Skipping guild: ${serverId} (N/A)`)
         }

      }
      console.log("[E][Daily Reset]: -------------- END --------------")
   }
}

module.exports = DailyResetListener;