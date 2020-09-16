const qdb = require("quick.db");
const db = new qdb.table("ayarlar");
const kdb = new qdb.table("kullanici");
const Member = require('../Member.js');
const ayar = db.get('ayar') || {};
const client = global.client;
module.exports = () => {
  console.log("Bot aktif!");
  client.user.setActivity("YASHINU ❤️ ALOSHA");
  if (ayar.botSesKanali && client.channels.cache.has(ayar.botSesKanali)) client.channels.cache.get(ayar.botSesKanali).join().catch();
  Object.keys(kdb.get("teyit")).forEach(x => {
    let teyitleri = new Map();
    if (kdb.get(`teyit.${x}.erkek`)) teyitleri.set("erkekTeyit", kdb.get(`teyit.${x}.erkek`));
    if (kdb.get(`teyit.${x}.kiz`)) teyitleri.set("kizTeyit", kdb.get(`teyit.${x}.kiz`));
    let newMember = new Member({
      guildID: "391936662306947072",
      userID: x,
      afk: {},
      yetkili: teyitleri
    });
    newMember.save().then(x => console.log(x+' aktarıldı!'));
  });
}
module.exports.configuration = {
  name: "ready"
}