// const filter = require("../lib/filter.json")
const randomList = require("../lib/random-list.json")
const rwc = require("random-weighted-choice")
const strings = require("../lib/string.json")

class UtilLib {

   static async sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
   };

   /**
    * Get a random loading message string from strings.loading
    */
    static randomLoading() {
      return rwc(randomList.random);
   };

   static lunaRandomLoading() {
      return rwc(randomList.lunarandom);
   };

   /**
    * Get current formatted date with UTC +8 YYYY/MM/DD HH/MM/SS hour24
    */
    static getFormattedDate() {
      let date = new Date()
      return date.toLocaleString("ja-JP", { timeZone: "Asia/Hong_Kong", hour12: false });
   };
   /**
    * Format the date given with UTC +8 YYYY/MM/DD HH/MM/SS hour24
    * @param {number} date Date to be formatted 
    */
    static formatDate(date) {
      return date.toLocaleString("ja-JP", { timeZone: "Asia/Hong_Kong", hour12: false });
   };

   /**
    * Converts a username into in-game name using the following set of rules:
    * 1. Extract content within the first square brackets set.
    * 2. Directly output the username if does not contain square brackets.
    * @param {string} username Username to be [rpcessed]
 // {boolean} filterOn Uses util-lib.filter 
 */
 static extractInGameName(username) {
   let output;
   var rx = /((\[|［).*(\]|］))/g;
   var arr = rx.exec(username);
   if (!arr) {
      output = username;
   } else {
      output = arr[1].slice(1, -1);
   };

      // output = UtilLib.filter(output, "all")

      return output;
   };

   static convertKillToPhaseWeekBoss(kill){
      const week = parseInt(kill / 5) + 1 
      const boss = kill % 5 + 1 
      let phase = 1
      if(week > 44){
        phase = 5
     }else if(week > 34){
        phase = 4
     }else if(week > 10){
        phase = 3
     }else if(week > 3){
        phase = 2
     }
     return {
        week: week,
        boss: boss,
        phase: phase,
     }
  }

  static convertWeekToStage(week) {

      //return "11122222223333333333333333333333334".slice(Math.min(week - 1, 34), Math.min(week, 35));

      if (week <= 3) {
         return 1;
      } else if (week >= 4 && week <= 10) {
         return 2;
      } else if (week > 10 && week <= 34) {
         return 3;
      } else if (week >= 35) {
         return 4;
      }
      else return 0;
   };

   /**
    * To add response to a message, and then return the selection number ; returns `false` if timed out
    * @param {message} userID The ID of who will be reacting
    * @param {message} reactedMessage The message to add reaction to
    * @param {integer} reactionCount The number of reactions to be added
    * @param {string} reactionEmoteString The continous string of emotes to be used as reaction
    * @param {number} reactionTimeout The timeout time for the selection; reactions will be deleted after timeout
    */
    static async emojiResponseSelection(userID, reactedMessage, reactionCount = -1, reactionEmoteArr = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"], reactionTimeout = 45000, timeoutEdit = true) {

      // normalize reaction count if out of bound or something
      if (reactionCount < 0 || reactionEmoteArr.length < reactionCount) {
         reactionCount = reactionEmoteArr.length;
      };

      let reactionArr = [];   // array of reacted emotes

      // react
      for (let i = 0; i < reactionCount; i++) {
         let emote = reactionEmoteArr[i];
         reactedMessage.react(emote);
         reactionArr.push(emote);
      };

      const filter = (reaction, user) => {
         return reactionArr.includes(reaction.emoji.name) && user.id == userID;
      };

      let selectionNumber;
      await reactedMessage.awaitReactions(filter, {
         max: 1, time: reactionTimeout, errors: ['time']
      })
      .then(collected => {
         const reaction = collected.first().emoji.name;

         for (let i = 0; i < reactionArr.length; i++) {
               // check if matched
               if (reaction == reactionArr[i]) {
                  selectionNumber = i + 1;
                  break;
               };
            };

            reactedMessage.reactions.removeAll();

         })
         // eslint-disable-next-line no-unused-vars
         .catch(collected => {
            if (timeoutEdit == true) {
               reactedMessage.edit(strings.reaction.reaction_timeout)
            };
            reactedMessage.reactions.removeAll();
         });


         if (selectionNumber > 0) {
            return selectionNumber;
         }
         else return false;

      };

   }

   module.exports = UtilLib