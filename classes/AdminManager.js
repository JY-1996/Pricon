class AdminManager {

    constructor(db, guildID) {
        this.db = db
        this.guildID = guildID
    }

	async getAllGuild(){
  		return await this.db.collection('servers')
  				.get()
	}

    async setupGuildSetting(name) {
        await this.db.collection('servers')
            .doc(this.guildID)
            .set({
                setup: true,
                name: name
            })
    
        await this.db.collection('servers')
            .doc(this.guildID)
            .collection('boss')
            .doc('1')
            .set({
                total_boss_died: 0,
                current_boss_hp: 600,
                boss_max_hp: [600, 600, 1200, 1900, 8500]
            })
        await this.db.collection('servers')
            .doc(this.guildID)
            .collection('boss')
            .doc('2')
            .set({
                total_boss_died: 0,
                current_boss_hp: 800,
                boss_max_hp: [800, 800, 1400, 2000, 9000]
            })
        await this.db.collection('servers')
            .doc(this.guildID)
            .collection('boss')
            .doc('3')
            .set({
                total_boss_died: 0,
                current_boss_hp: 600,
                boss_max_hp: [1000, 1000, 1700, 2300, 9500]
            })
        await this.db.collection('servers')
            .doc(this.guildID)
            .collection('boss')
            .doc('4')
            .set({
                total_boss_died: 0,
                current_boss_hp: 1200,
                boss_max_hp: [1200, 1200, 1900, 2500, 10000]
            })
        await this.db.collection('servers')
            .doc(this.guildID)
            .collection('boss')
            .doc('5')
            .set({
                total_boss_died: 0,
                current_boss_hp: 1500,
                boss_max_hp: [1500, 1500, 2200, 2700, 11100]
            })
    }

    async resetBoss(current_boss, current_week) {
        const queryRef = this.db.collection('servers')
            .doc(this.guildID)
            .collection('boss')
            .doc(String(current_boss))
        let query = await queryRef.get()
       	let phase = this.checkPhase(current_week - 1)

        await queryRef.update({
            total_boss_died: current_week - 1,
            current_boss_hp: query.data().boss_max_hp[phase]
        })
    }

    async resetBossHp(current_boss, new_hp) {
        const queryRef = this.db.collection('servers')
            .doc(this.guildID)
            .collection('boss')
            .doc(String(current_boss))

        await queryRef.update({
            current_boss_hp: new_hp
        })
    }

    async cancelMemberKnife(member, boss) {
        let query = await this.db.collection('servers')
            .doc(this.guildID)
            .collection('knife')
            .where('member_id', '==', member)
            .where('boss', '==', boss)
            .get()
        await query.forEach(doc => {
            this.deleteKnife(doc.id)
        })
    }

    async setKnifeCount(value) {
        let queryRef = this.db.collection('servers')
            .doc(this.guildID)
            .collection('setting')
            .doc('boss')
        let query = await queryRef.get()
        if (query.exists && query.data().knife_count) {
            await queryRef.update({
                knife_count: value
            })
        } else {
            await queryRef.set({
                knife_count: value
            })
        }
    }

    async displayAllSetting() {
        return await this.db.collection('servers')
            .doc(this.guildID)
            .collection('setting')
            .get()
    }

    async deleteKnife(id) {
        await this.db.collection('servers')
            .doc(this.guildID)
            .collection('knife')
            .doc(id)
            .delete()
    }

    async getAllGuild() {
        return await this.db.collection('servers')
            .get()
    }

    async deleteGuildKnife(guildID,collection, batchSize = 10) {

        const collectionRef = this.db
            .collection("servers")
            .doc(guildID)
            .collection(collection);
        const query = collectionRef.limit(batchSize);

        // Delete all existing knife reports
        return new Promise((resolve, reject) => {
            this._deleteQueryBatch(this.db, query, resolve).catch(reject);
        });
    };

    async _deleteQueryBatch(db, query, resolve) {
        const snapshot = await query.get();

        const batchSize = snapshot.size;
        if (batchSize == 0) {
            // When there are no documents left, we are done
            resolve();
            return;
        }

        // Delete documents in a batch
        const batch = db.batch();
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();

        // Recursion on the next process tick, to avoid exploding the stack.
        process.nextTick(() => {
            this._deleteQueryBatch(db, query, resolve);
        });
    }

    async getMemberData() {
        return await this.db.collection('servers')
            .doc(this.guildID)
            .collection('member')
            .orderBy('count')
            .get()
    }

    async getMemberAllKnifeData() {
        return await this.db.collection('servers')
            .doc(this.guildID)
            .collection('knife')
            .orderBy('member')
            .get()
    }

	checkPhase(total_boss_died){
		if(total_boss_died > 40){
  			return 4
		}else if(total_boss_died > 30){
  			return 3
		}else if(total_boss_died > 10){
  			return 2
		}else if(total_boss_died > 3){
  			return 1
		}else{
			return 0
		}	
	}
}

module.exports = AdminManager