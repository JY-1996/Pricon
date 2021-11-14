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
        const queryRef = await this.db.collection('servers')
            .doc(this.guildID)
            .collection('setting')
            .doc('boss_status')
        let query = queryRef.get()
        if (!query.exist) {
            await queryRef.set({
                total_week_done: 0
            })
        }
        await this.db.collection('servers')
            .doc(this.guildID)
            .collection('boss')
            .doc('1')
            .set({
                total_boss_died: 0,
                current_boss_hp: 600,
                boss_max_hp: [600, 600, 1000, 1800, 8500]
            })
        await this.db.collection('servers')
            .doc(this.guildID)
            .collection('boss')
            .doc('2')
            .set({
                total_boss_died: 0,
                current_boss_hp: 800,
                boss_max_hp: [800, 800, 1100, 1900, 9000]
            })
        await this.db.collection('servers')
            .doc(this.guildID)
            .collection('boss')
            .doc('3')
            .set({
                total_boss_died: 0,
                current_boss_hp: 600,
                boss_max_hp: [1000, 1000, 1600, 2200, 9500]
            })
        await this.db.collection('servers')
            .doc(this.guildID)
            .collection('boss')
            .doc('4')
            .set({
                total_boss_died: 0,
                current_boss_hp: 1200,
                boss_max_hp: [1200, 1200, 1800, 2300, 10000]
            })
        await this.db.collection('servers')
            .doc(this.guildID)
            .collection('boss')
            .doc('5')
            .set({
                total_boss_died: 0,
                current_boss_hp: 1500,
                boss_max_hp: [1500, 1500, 2200, 2600, 11100]
            })
    }

    async resetBoss(current_week, current_boss) {
        const queryRef = this.db.collection('servers')
            .doc(this.guildID)
            .collection('setting')
            .doc('boss')
        const boss_max_hp = await this.db.collection('servers')
            .doc(this.guildID)
            .collection('setting')
            .doc('boss_max_hp')
            .get()
        let query = await queryRef.get()
        let current_phase = 1
        if (current_week > 44) {
            current_phase = 5
        } else if (current_week > 34) {
            current_phase = 4
        } else if (current_week > 10) {
            current_phase = 3
        } else if (current_week > 3) {
            current_phase = 2
        }

        await queryRef.update({
            total_boss_died: (current_week - 1) * 5 + current_boss - 1,
            current_boss_hp: boss_max_hp.data()[current_phase][current_boss == 5 ? 0 : current_boss]
        })
    }

    async resetBossHp(new_hp) {
        const queryRef = this.db.collection('servers')
            .doc(this.guildID)
            .collection('setting')
            .doc('boss')

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
}

module.exports = AdminManager