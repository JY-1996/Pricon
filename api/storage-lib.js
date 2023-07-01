const db = require('../classes/Database')
// const ProgressManager = require('../classes/ProgressManager')
// const KnifeReportManager = require('../classes/KnifeReportManager')
// const KnifeCountManager = require('../classes/KnifeCountManager')
const InfoManager = require('../classes/InfoManager')
const SettingManager = require('../classes/SettingsManager')


// let pm = new ProgressManager(db)
// let krm = new KnifeReportManager(db)
// let kcm = new KnifeCountManager(db)
let im = new InfoManager(db)
let sm = new SettingManager(db)

module.exports = {
  //  ProgressManager: pm,
  //  KnifeReportManager: krm,
  //  KnifeCountManager: kcm,
   InfoManager: im,
   SettingManager: sm,
}
