const Knife = require("../classes/Knife");
class DatabaseManager {

    constructor(db,guildID,clientID = null) {
      this.db = db
      this.guildID = guildID
      this.clientID = clientID
    }

    async getAllKnife(){
      return await this.db.collection('servers')
                          .doc(this.guildID)
                          .collection('knife')
                          .where('status','!=','done')
                          .get()
    }

    async getKnifeQuery(){
      return await this.db.collection('servers')
                          .doc(this.guildID)
                          .collection('knife')
                          .where('member_id','==', this.clientID)
                          .where('status','in', ['processing', 'attacking'])
                          .get()
    }
    
    async getKnifeBossQuery(boss){
      return  await this.db.collection('servers')
                          .doc(this.guildID)
                          .collection('knife')
                          .where('member_id','==', this.clientID)
                          .where('status','in', ['processing', 'attacking'])
                          .where('boss','==', boss)
                          .get()
    }

    async setKnife(data){
      await this.db.collection('servers')
                    .doc(this.guildID)
                    .collection('knife')
                    .add(data)
    }

    async updateKnife(id){
      await this.db.collection('servers')
                    .doc(this.guildID)
                    .collection('knife')
                    .doc(id)
                    .update({status: 'done'})
    }

    async deleteKnife(id){
      await this.db.collection('servers')
                    .doc(this.guildID)
                    .collection('knife')
                    .doc(id)
                    .delete()
    }

    async getChannel(channel){
      let queryRef =  this.db.collection('servers')
                        .doc(this.guildID)
                        .collection('setting')
                        .doc('channel')
      let query = await queryRef.get()
      if(!query.exists){
        return false
      }
      if(channel == 'knife'){
        return query.data().knife   
      }else if(channel == 'log'){
         return query.data().log
      }else if(channel == 'report'){
         return query.data().report
      }
      return false
    }

    async setKnifeChannel(value){
      let queryRef =  this.db.collection('servers')
                        .doc(this.guildID)
                        .collection('setting')
                        .doc('channel')
      let query = await queryRef.get()
      if(query.exists && query.data().knife){
          await queryRef.update({ knife: value})
      }else{
          await queryRef.set({ knife: value},{ merge: true })
      }
    }

     async setLogChannel(value){
      let queryRef =  this.db.collection('servers')
                        .doc(this.guildID)
                        .collection('setting')
                        .doc('channel')
      let query = await queryRef.get()
      if(query.exists && query.data().log){
          await queryRef.update({ log: value})
      }else{
          await queryRef.set({ log: value},{ merge: true })
      }
    }

    async setReportChannel(value){
      let queryRef =  this.db.collection('servers')
                        .doc(this.guildID)
                        .collection('setting')
                        .doc('channel')
      let query = await queryRef.get()
      if(query.exists && query.data().report){
          await queryRef.update({ report: value})
      }else{
          await queryRef.set({ report: value},{ merge: true })
      }
    }

    async getReportMessage(){
      let queryRef =  this.db.collection('servers')
                        .doc(this.guildID)
                        .collection('setting')
                        .doc('channel')
      let query = await queryRef.get()
      if(query.exists && query.data().board_message){
          return query.data().board_message
      }
      return false
    }

    async setReportMessage(value){
      let queryRef =  this.db.collection('servers')
                        .doc(this.guildID)
                        .collection('setting')
                        .doc('channel')
      let query = await queryRef.get()
      if(query.exists && query.data().report){
          await queryRef.update({ board_message: value})
      }else{
          await queryRef.set({ board_message: value},{ merge: true })
      }
    }
    async setKnifeCount(value){
      let queryRef =  this.db.collection('servers')
                          .doc(this.guildID)
                          .collection('setting')
                          .doc('boss')
      let query = await queryRef.get()
      if(query.exists && query.data().knife_count){
          await queryRef.update({ knife_count: value})
      }else{
          await queryRef.set({ knife_count: value})
      }
    }

    async getBossDetail() {
      let queryRef = this.db.collection('servers')
                            .doc(this.guildID)
                            .collection('setting')
                            .doc('boss')
      let query = await queryRef.get()
      const total_boss_died = query.data().total_boss_died
      const current_boss_hp = query.data().current_boss_hp
      const knife_count = query.data().knife_count

      const current_week = parseInt(total_boss_died / 5) + 1 
      const current_boss = total_boss_died % 5 + 1 
      let current_phase = 1
      if(current_week > 44){
        current_phase = 5
      }else if(current_week > 34){
        current_phase = 4
      }else if(current_week > 10){
        current_phase = 3
      }else if(current_week > 3){
        current_phase = 2
      }
      return {
        total_boss_died: total_boss_died,
        current_boss_hp: current_boss_hp,
        current_week: current_week,
        current_boss: current_boss,
        current_phase: current_phase,
        knife_count: knife_count
      }
   };

   async nextBoss(){
       let serverBossRef = this.db.collection('servers')
                            .doc(this.guildID)
                            .collection('setting')
                            .doc('boss_max_hp')
      let serverBoss = await serverBossRef.get()
      const boss_max_hp = serverBoss.data()

      let reportBossRef = await this.db.collection('servers')
                            .doc(this.guildID)
                            .collection('setting')
                            .doc('boss')
      let reportBoss = await reportBossRef.get()
      const total_boss_died = reportBoss.data().total_boss_died
      const current_week = parseInt(total_boss_died / 5) + 1 
      const current_boss = total_boss_died % 5 + 1 
      let current_phase = 1
      if(current_week > 44){
        current_phase = 5
      }else if(current_week > 34){
        current_phase = 4
      }else if(current_week > 10){
        current_phase = 3
      }else if(current_week > 3){
        current_phase = 2
      }
      await reportBossRef.update({
        current_boss_hp: boss_max_hp[current_phase][current_boss == 5 ? 0 : current_boss],
        total_boss_died: total_boss_died + 1
      })

   }

   async updateBossHp(boss_hp){
      let query = await this.db.collection('servers')
                          .doc(this.guildID)
                          .collection('setting')
                          .doc('boss')
      await query.update({
        current_boss_hp: boss_hp
      })
   }

   async cancelMemberKnife(member,boss){
      let query = await this.db.collection('servers')
                          .doc(this.guildID)
                          .collection('knife')
                          .where('member_id','==', member)
                          .where('status','in', ['processing', 'attacking'])
                          .where('boss','==', boss)
                          .get()
      await query.forEach(doc => {
        this.deleteKnife(doc.id)
      })
  }

  async init(){
     const queryRef = this.db.collection('servers')
                      .doc(this.guildID)
                      .collection('setting')
                      .doc('boss_max_hp')
      let query = queryRef.get() 
      if(!query.exist){
          await queryRef.set({
              1:[600,800,1000,1200,1500],
              2:[600,800,1000,1200,1500],
              3:[700,900,1200,1500,2000],
              4:[1700,1800,2000,2100,2200],
              5:[8500,9000,9500,10000,10500]
          })
      }
      const query1Ref = this.db.collection('servers')
                          .doc(this.guildID)
                          .collection('setting')
                          .doc('boss')
      let query1 = query1Ref.get() 
      if(!query1.exist){
          await query1Ref.set({
              total_boss_died: 0,
              current_boss_hp: 600,
              knife_count: 3
          })
      }
  }

  async resetBoss(current_week,current_boss){
      const queryRef = this.db.collection('servers')
                          .doc(this.guildID)
                          .collection('setting')
                          .doc('boss')
      let query = queryRef.get() 
      let current_phase = 1
      if(current_week > 44){
        current_phase = 5
      }else if(current_week > 34){
        current_phase = 4
      }else if(current_week > 10){
        current_phase = 3
      }else if(current_week > 3){
        current_phase = 2
      }
      if(!query.exist){
          await query1Ref.update({
              total_boss_died: (current_week - 1) * 5 + current_boss - 1,
              current_boss_hp: boss_max_hp[current_phase][current_boss == 5 ? 0 : current_boss]
          })
      }                   
  }

  async displayAll(){
      return await this.db.collection('servers')
                              .doc(this.guildID)
                              .collection('setting')
                              .get()
  }
  
  async getAllGuild(){
      return await this.db.collection('servers')
                              .get()
  }

  async deleteGuildKnife(guildID){
      await this.db.collection('servers')
                    .doc(guildID)
                    .collection('knife')
                    .doc()
                    .delete()

  }
}

module.exports = DatabaseManager