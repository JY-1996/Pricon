const { AkairoClient, CommandHandler, ListenerHandler } = require("discord-akairo");
const SettingsManager = require('./classes/SettingsManager')
const NeDB = require("nedb-promises");
const schedule = require('node-schedule');

class BotClient extends AkairoClient {
    constructor() {
       super({
         ownerID: ["212825259697635328", "215752403872382978"],
      });
      this.db = require('./classes/Database')
      this.cachedb = NeDB.create();
      console.log("\n------------------------------------------------\n");

      console.log("Starting bot")

      this.settings = new SettingsManager(this.db)
      this.commandHandler = new CommandHandler(this, {
         directory: "./commands/",
         defaultCooldown: 1000,
         ignoreCooldown: ["674265066824138753", "212825259697635328"],
         ignorePermissions: ["674265066824138753","212825259697635328"],
         allowMention: true,
         prefix: async (message) => {
            if (message.guild) {
               let doc = await this.cachedb.findOne({ _id: message.guild.id });
               if (!doc) {
                  let dbSettings = await this.settings.getAll(message.guild.id)
                  if (!dbSettings || !dbSettings.prefix) {
                     this.cachedb.insert({ _id: message.guild.id, prefix: "!" });
                     return "!";
                  } else {
                     const { prefix } = dbSettings
                     this.cachedb.insert({
                        _id: message.guild.id,
                        prefix
                     });

                     return dbSettings.prefix;
                  }
               } else {
                  return doc.prefix;
               }
            }
         },
      });
      this.commandHandler.loadAll();

      // the listener handler
      this.listenerHandler = new ListenerHandler(this, {
         directory: './listeners/'
      });
      this.listenerHandler.setEmitters({
         commandHandler: this.commandHandler,
         listenerHandler: this.listenerHandler
      });
      this.commandHandler.useListenerHandler(this.listenerHandler);
      this.listenerHandler.loadAll();
    }
}

const client = new BotClient();
client.login(process.env['TOKEN']).then(() => {
  console.log("Re:Dive Assistant logged in as " + client.user.username);
});

// daily reset
let rule = new schedule.RecurrenceRule();

rule.tz = 'Asia/Hong_Kong';
rule.second = 0;
rule.minute = 0;
rule.hour = 5;

let resetJob = schedule.scheduleJob(rule, function () {
   client.emit("DailyReset")
});

client.resetTimer = resetJob