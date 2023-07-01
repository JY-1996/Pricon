const UtilLib = require("../api/util-lib");

class Knife {

   constructor(object) {
      this.member_id = object.member_id || 0
      this.member_name = object.member_name || ''
      this.boss = object.boss || 1
      this.comment = object.comment || ''
      this.status = object.status || 'processing'
      this.is_compensate = object.isCompensate || false;
      this.created_at = object.created_at || Date.now();
   }

   setUser(member) {
      this.member_id = member.id;
      this.member_name = UtilLib.extractInGameName(member.displayName, false);
   };

   setBoss(boss) {
      this.boss = boss;
   };

   setComment(comment) {
      this.comment = comment;
   };

   setCompensate(compensate) {
      this.compensate = compensate;
   };

   setAll(member, boss, comment) {
      this.setUser(member);
      this.setBoss(boss);
      this.setComment(comment)
   };

   flatten() {
      let flattenedObj = {}
      for (const [key, value] of Object.entries(this)) {
         flattenedObj[key] = value
      }
      return flattenedObj
   }
}

module.exports = Knife;