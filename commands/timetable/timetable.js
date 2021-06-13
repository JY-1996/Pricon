const { Command } = require("discord-akairo");
const strings = require("../../lib/string.json");
const command = require("../../lib/command-info.json");
const UtilLib = require("../../api/util-lib");
const TimeTables = require("../../classes/TimeTables");
const prompter = require('discordjs-prompter');

class Timetable extends Command {
  constructor() {
    super('timetable', {
      aliases: ['t','timetable'],
      cooldown: 3000,
      channel: 'guild',
      args: [{
        id: "create",
        match: "flag",
        flag: ['-c','create']
        },{
        id: "delete",
        match: "flag",
        flag: ['-d','delete']
        },{
        id: "list",
        match: "flag",
        flag: ['-l','list']
        },{
        id: "number1",
        type: "number",
        default:undefined
        },{
        id: "number2",
        type: "number",
        default:0
        },{
        id: "name",
        type: "string",
        default:""
        }
      ]
    });
  };

  async exec(message, args) {
    const db = this.client.db
    let timetables = new TimeTables(db)
    await timetables.getTimeTables(message.guild.id)
    if (args.list){ //查看
      this.list(message,args,db,timetables)
    }else if(args.create) { //新增
      this.create(message,args,db)
    }else if (args.delete) { //刪除
      message.reply("刪除")
    }else{
      this.list(message,args,db,timetables)
    }
    return;
  };

  async list(message,args,db,timetables){
    let timetable = await timetables.listTimeTables(message.guild.id)
    let table = ""
    if (args.number1 == undefined){
      await prompter.message(message.channel, {
        question: timetable,
        userId: message.author.id,
        max: 1,
        timeout: 10000,
      }).then(responses => {
        if (!responses.size) {
          message.channel.send(`已超出時間。`);
          return
        }
        const response = responses.first();
      table = timetables.getTable(parseInt(response)-1)
      })
      // table = timetables.getShiftedTable(parseInt(response)-1,60)
    }else{
      table = timetables.getTable(parseInt(args.number1)-1)
    }
    message.channel.send(table)
    return;
  }

  async create(message,args,db){
    const guildID = message.guild.id
    var inp = "";
    await prompter.message(message.channel, {
        question: "請輸入刀表",
        userId: message.author.id,
        max: 1,
        timeout: 100000,
      }).then(responses => {
        if (!responses.size) {
          message.channel.send(`已超出時間。`);
          return
        }
        try{
          inp = responses.first()['content'];
        }catch(err){
          console.log(err)
        }
      })
    try{
      let line = inp.split("\n")
      let timelines = {}
      for (let i = 0; i < line.length; i++){
        let space_idx = line[i].indexOf(' ')
        if (space_idx > 0) {
          let time = line[i].substring(0, space_idx)
          let comment = line[i].substring(space_idx + 1)
          let timeline = {'time':time,'comment':comment}
          timelines[i] = timeline
        }
      }
      let out = JSON.stringify(timelines)
      let tableRef = db.collection('servers').doc(guildID).collection('timetable')
      await tableRef.add({
          name: args.name,
          phase: args.number1,
          boss: args.number2,
          data: out,
          time: Date.now(),
      })
      message.channel.send("已記錄"+args.name)
    }catch(err){
      console.log(err)
      message.reply("Invalid input")
    }
    return;
  }
}
module.exports = Timetable;

