class CurrentBossDetail {

   constructor(db) {
      this.db = db
   }
    
    async getSettingBossQuery(guildID){
        return this.db.collection('servers').doc(guildID).collection('setting').doc('boss')
    }

    async getSettingBossHpQuery(guildID){
        return this.db.collection('servers').doc(guildID).collection('setting').doc('boss_max_hp')
    }

    async getDetail(guildID) {
      let reportBossRef = await this.getSettingBossQuery(guildID)
      let reportBoss = await reportBossRef.get()
      const total_boss_died = reportBoss.data().total_boss_died
      const current_boss_hp = reportBoss.data().current_boss_hp

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
        current_phase: current_phase
      }
   };

   async nextBoss(guildID){
      let serverBossRef = await this.getSettingBossHpQuery(guildID)
      let serverBoss = await serverBossRef.get()
      const boss_max_hp = serverBoss.data()

      let reportBossRef = await this.getSettingBossQuery(guildID)
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

   async updateBossHp(guildID,boss_hp){
      let reportBossRef = await this.getSettingBossQuery(guildID)
      await reportBossRef.update({
        current_boss_hp: boss_hp
      })
   }

   async resetBoss(guildID,total_boss_died){
      let settingBossHpRef = await this.getSettingBossHpQuery(guildID)
      let settingBossHp = await settingBossHpRef.get()
      const boss_max_hp = settingBossHp.data()

      let settingBossRef = await this.getSettingBossQuery(guildID)
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
      const current_boss_hp = boss_max_hp[current_phase][current_boss == 5 ? 0 : current_boss]
      await settingBossRef.update({
        current_boss_hp: current_boss_hp,
        total_boss_died: total_boss_died
      })
      return {
        phase: current_phase,
        week: current_week,
        boss: current_boss
      }
   }
}

module.exports = CurrentBossDetail;