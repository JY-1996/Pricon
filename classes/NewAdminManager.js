class NewAdminManager {

    constructor(db, guildID) {
        this.db = db
        this.guildID = guildID
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
    
    
}

module.exports = NewAdminManager