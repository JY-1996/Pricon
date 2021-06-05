

class CurrentBossDetail {

   constructor(db) {
      this.db = db
   }
    
    async getDetail() {
      let reportBossRef = this.db.collection('report').doc('boss')
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

   async nextBoss(){
      let serverBoss = await this.db.collection('server').doc('setting').get()
      const boss_max_hp = serverBoss.data().boss_max_hp

      let reportBossRef = this.db.collection('report').doc('boss')
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
      let reportBossRef = this.db.collection('report').doc('boss')
      await reportBossRef.update({
        current_boss_hp: boss_hp
      })
   }
}

module.exports = CurrentBossDetail;