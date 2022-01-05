const { Command } = require("discord-akairo");
const { Permissions } = require('discord.js');
const strings = require("../../lib/string.json");
const admin = require("../../lib/admin.json");
const { MessageEmbed } = require('discord.js');
const AdminManager  = require("../../classes/AdminManager");

class AdminBossCommand extends Command {
   constructor() {
      super('adminBoss', {
         aliases: ['setboss'],
         cooldown: 3000,
         channel: 'guild',
         userPermissions: Permissions.FLAGS.ADMINISTRATOR,
         args: [
            {
               id: 'compensate',
               match: 'flag',
               flag: ['c','-c','com','-com']
            },
            {
               id: "week",
               type: "integer",
               prompt: {
                  start: strings.prompt.week,
                  retry: strings.prompt.not_a_number,
               },
            },
            {
               id: "boss",
               type: "integer",
               prompt: {
                  start: strings.prompt.boss,
                  retry: strings.prompt.not_a_number,
               },
            },
         ],
      });
   };

   async exec(message, args) {
      	const guildID = message.guild.id
      	const clientID = message.author.id
      	const db = this.client.db
      	const dm = new AdminManager(db, guildID)
      
      	let loadingMsg = await message.channel.send(strings.common.waiting);

      	const week = args.week
      	const boss = args.boss

	  	if (boss < 1 || boss > 5) {
      		loadingMsg.edit(strings.common.boss_out_of_range);
      		return
    	};

      	const detail = await dm.resetBoss(boss, week)
      
      	const embed = new MessageEmbed();
      	embed.setColor("#90ffff");
      	embed.setTitle(admin.reset.field.replace('[week]', week).replace('[boss]', boss));
      	loadingMsg.delete()
      	await message.channel.send(embed);
      	this.client.emit("reportUpdate", message.guild);

      	return
    	}
}
module.exports = AdminBossCommand;

