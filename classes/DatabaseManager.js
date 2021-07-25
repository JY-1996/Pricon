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
                          .orderBy('time')
                          .get()
    }

    async getKnifeQuery(){
      return await this.db.collection('servers')
                          .doc(this.guildID)
                          .collection('knife')
                          .where('member_id','==', this.clientID)
                          .where('compensate','==', false)
                          .get()
    }

    async getAllKnifeQuery(){
      return await this.db.collection('servers')
                          .doc(this.guildID)
                          .collection('knife')
                          .where('member_id','==', this.clientID)
                          .get()
    }
    
    async getKnifeBossQuery(boss){
      return  await this.db.collection('servers')
                          .doc(this.guildID)
                          .collection('knife')
                          .where('member_id','==', this.clientID)
                          .where('boss','==', boss)
                          .where('status','in', ['processing','attacking'])
                          .get()
    }

    async getAllKnifeBossQuery(boss){
      return  await this.db.collection('servers')
                          .doc(this.guildID)
                          .collection('knife')
                          .where('boss','==', boss)
                          .where('status', 'in', ['processing','attacking'])
                          .get()
    }

    async setKnife(doc,data){
      await this.db.collection('servers')
                    .doc(this.guildID)
                    .collection('knife')
                    .doc(String(doc))
                    .set(data)
    }

    async updateKnifeToDone(id, current_boss){
      await this.db.collection('servers')
                    .doc(this.guildID)
                    .collection('knife')
                    .doc(id)
                    .update({
                      status: 'done',
                      compensate: false,
                      kill: current_boss
                    })
    }

    async updateKnifeToDoneWithCom(id,current_boss){
      await this.db.collection('servers')
                    .doc(this.guildID)
                    .collection('knife')
                    .doc(id)
                    .update({
                      status: 'done',
                      compensate: true,
                      kill: current_boss
                    })
    }

    async deleteKnife(id){
      await this.db.collection('servers')
                    .doc(this.guildID)
                    .collection('knife')
                    .doc(id)
                    .delete()
    }

    async setKnifeToAtk(doc){
      await this.db.collection('servers')
                    .doc(this.guildID)
                    .collection('knife')
                    .doc(String(doc))
                    .update({status: "attacking"})
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
      else if(channel == 'member_update'){
         return query.data().member_update
      }
      return false
    }

    // async setKnifeChannel(value){
    //   let queryRef =  this.db.collection('servers')
    //                     .doc(this.guildID)
    //                     .collection('setting')
    //                     .doc('channel')
    //   let query = await queryRef.get()
    //   if(query.exists && query.data().knife){
    //       await queryRef.update({ knife: value})
    //   }else{
    //       await queryRef.set({ knife: value},{ merge: true })
    //   }
    // }

    //  async setLogChannel(value){
    //   let queryRef =  this.db.collection('servers')
    //                     .doc(this.guildID)
    //                     .collection('setting')
    //                     .doc('channel')
    //   let query = await queryRef.get()
    //   if(query.exists && query.data().log){
    //       await queryRef.update({ log: value})
    //   }else{
    //       await queryRef.set({ log: value},{ merge: true })
    //   }
    // }

    // async setReportChannel(value){
    //   let queryRef =  this.db.collection('servers')
    //                     .doc(this.guildID)
    //                     .collection('setting')
    //                     .doc('channel')
    //   let query = await queryRef.get()
    //   if(query.exists && query.data().report){
    //       await queryRef.update({ report: value})
    //   }else{
    //       await queryRef.set({ report: value},{ merge: true })
    //   }
    // }

    // async getReportMessage(){
    //   let queryRef =  this.db.collection('servers')
    //                     .doc(this.guildID)
    //                     .collection('setting')
    //                     .doc('channel')
    //   let query = await queryRef.get()
    //   if(query.exists && query.data().board_message){
    //       return query.data().board_message
    //   }
    //   return false
    // }

    // async setReportMessage(value){
    //   let queryRef =  this.db.collection('servers')
    //                     .doc(this.guildID)
    //                     .collection('setting')
    //                     .doc('channel')
    //   let query = await queryRef.get()
    //   if(query.exists && query.data().report){
    //       await queryRef.update({ board_message: value})
    //   }else{
    //       await queryRef.set({ board_message: value},{ merge: true })
    //   }
    // }
    
    // async setKnifeCount(value){
    //   let queryRef =  this.db.collection('servers')
    //                       .doc(this.guildID)
    //                       .collection('setting')
    //                       .doc('boss')
    //   let query = await queryRef.get()
    //   if(query.exists && query.data().knife_count){
    //       await queryRef.update({ knife_count: value})
    //   }else{
    //       await queryRef.set({ knife_count: value})
    //   }
    // }

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
        current_boss_hp: boss_max_hp[current_phase][current_boss - 1],
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

  //  async cancelMemberKnife(member,boss){
  //     let query = await this.db.collection('servers')
  //                         .doc(this.guildID)
  //                         .collection('knife')
  //                         .where('member_id','==', member)
  //                         .where('boss','==', boss)
  //                         .get()
  //     await query.forEach(doc => {
  //       this.deleteKnife(doc.id)
  //     })
  // }

  // async setupGuildSetting(){
  //   await this.db.collection('servers')
  //               .doc(this.guildID)
  //               .set({setup: true})
  //   const queryRef = await this.db.collection('servers')
  //                     .doc(this.guildID)
  //                     .collection('setting')
  //                     .doc('boss_max_hp')
  //   let query = queryRef.get() 
  //   if(!query.exist){
  //       await queryRef.set({
  //             1:[600,800,1000,1200,1500],
  //             2:[600,800,1000,1200,1500],
  //             3:[700,900,1200,1500,2000],
  //             4:[1700,1800,2000,2100,2200],
  //             5:[8500,9000,9500,10000,11100]
  //       })
  //   }
  //   const query1Ref = this.db.collection('servers')
  //                         .doc(this.guildID)
  //                         .collection('setting')
  //                         .doc('boss')
  //   let query1 = query1Ref.get() 
  //   if(!query1.exist){
  //         await query1Ref.set({
  //             total_boss_died: 0,
  //             current_boss_hp: 600,
  //             knife_count: 3
  //         })
  //   }
  // }

  // async resetBoss(current_week,current_boss){
  //     const queryRef = this.db.collection('servers')
  //                         .doc(this.guildID)
  //                         .collection('setting')
  //                         .doc('boss')
  //     const boss_max_hp = await this.db.collection('servers')
  //                                       .doc(this.guildID)
  //                                       .collection('setting')
  //                                       .doc('boss_max_hp')  
  //                                       .get()                
  //     let query = await queryRef.get() 
  //     let current_phase = 1
  //     if(current_week > 44){
  //       current_phase = 5
  //     }else if(current_week > 34){
  //       current_phase = 4
  //     }else if(current_week > 10){
  //       current_phase = 3
  //     }else if(current_week > 3){
  //       current_phase = 2
  //     }
  
  //     await queryRef.update({
  //         total_boss_died: (current_week - 1) * 5 + current_boss - 1,
  //         current_boss_hp: boss_max_hp.data()[current_phase][current_boss == 5 ? 0 : current_boss]
  //     })                
  // }

  // async displayAllSetting(){
  //     return await this.db.collection('servers')
  //                             .doc(this.guildID)
  //                             .collection('setting')
  //                             .get()
  // }
  
  async getAllGuild(){
      return await this.db.collection('servers')
                          .get()
  }

  // async deleteGuildKnife(guildID, batchSize = 10) {

  //     const collectionRef = this.db
  //        .collection("servers")
  //        .doc(guildID)
  //        .collection("knife");
  //     const query = collectionRef.limit(batchSize);

  //     // Delete all existing knife reports
  //     return new Promise((resolve, reject) => {
  //        this._deleteQueryBatch(this.db, query, resolve).catch(reject);
  //     });
  // };

  // async _deleteQueryBatch(db, query, resolve) {
  //     const snapshot = await query.get();

  //     const batchSize = snapshot.size;
  //     if (batchSize == 0) {
  //        // When there are no documents left, we are done
  //        resolve();
  //        return;
  //     }

  //     // Delete documents in a batch
  //     const batch = db.batch();
  //     snapshot.docs.forEach((doc) => {
  //        batch.delete(doc.ref);
  //     });
  //     await batch.commit();

  //     // Recursion on the next process tick, to avoid exploding the stack.
  //     process.nextTick(() => {
  //        this._deleteQueryBatch(db, query, resolve);
  //     });
  //  }

   async getMemberData(){
      return await this.db.collection('servers')
                          .doc(this.guildID)
                          .collection('knife')
                          .get()
   }


}

module.exports = DatabaseManager