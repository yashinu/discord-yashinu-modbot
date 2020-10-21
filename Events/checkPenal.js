const { MessageEmbed } = require("discord.js");
const conf = require('../ayarlar.json');
const qdb = require("quick.db");
const cdb = new qdb.table("cezalar");
const db = new qdb.table("ayarlar");
const client = global.client;

module.exports = () => {
  setInterval(() => {
    checkRoles();
  }, 20000);
};

module.exports.configuration = {
  name: "ready"
};

function checkRoles() {
  let ayar = db.get('ayar') || {};
  let yasakTaglar = ayar.yasakTaglar || [];
  let jailler = cdb.get("jail") || [];
  let banlılar = cdb.get("ban") || [];
  let muteler = cdb.get("mute") || [];
  let tempjailler = cdb.get("tempjail") || [];
  let tempmuteler = cdb.get("tempmute") || [];
  let sesmuteler = cdb.get("tempsmute") || [];
  let yasakTaglilar = cdb.get("yasakTaglilar") || [];

  if (ayar.teyitsizRolleri) client.guilds.cache.get(conf.sunucuId).members.cache.filter(uye => uye.roles.cache.size === 1).array().forEach((uye, index) => setTimeout(() => { uye.roles.add(ayar.teyitsizRolleri).catch(console.error); }, index*1000));
  if (ayar.tag) {

    client.guilds.cache.get(conf.sunucuId).members.cache.filter(uye => uye.user.username.includes(ayar.tag) && !uye.roles.cache.has(ayar.boosterRolu) && (!uye.roles.cache.has(ayar.ekipRolu) || !uye.displayName.startsWith(ayar.tag))).array().forEach((uye, index) => {
      setTimeout(() => {
        uye.setNickname(uye.displayName.replace(ayar.ikinciTag, ayar.tag));
        if (ayar.ekipRolu) uye.roles.add(ayar.ekipRolu);
      }, index*30000);
    });
  };

  // Yasaklı tag tarama
  for (let kisi of yasakTaglilar) {
    let uye = client.guilds.cache.get(conf.sunucuId).members.cache.get(kisi.slice(1));
    if (uye && yasakTaglar.some(tag => uye.user.username.includes(tag)) && !uye.roles.cache.has(ayar.jailRolu)) uye.roles.set(uye.roles.cache.has(ayar.boosterRolu) ? [ayar.boosterRolu, ayar.jailRolu] : [ayar.jailRolu]).catch();
    if (uye && !yasakTaglar.some(tag => uye.user.username.includes(tag)) && uye.roles.cache.has(ayar.jailRolu)) {
      db.set("yasakTaglilar", yasakTaglilar.filter(x => !x.includes(uye.id)));
      uye.roles.set([ayar.teyitsizRolleri]).catch();
    };
  };
  for (let kisi of jailler) {
    let uye = client.guilds.cache.get(conf.sunucuId).members.cache.get(kisi.slice(1));
    if (uye && !uye.roles.cache.has(ayar.jailRolu)) uye.roles.set(uye.roles.cache.has(ayar.boosterRolu) ? [ayar.boosterRolu, ayar.jailRolu] : [ayar.jailRolu]).catch();
  };

  for (let kisi of banlılar) {
    let uye = client.guilds.cache.get(conf.sunucuId).members.cache.get(kisi.slice(1));
    if (uye)
    uye.kick().catch();
  };

  
  for (let kisi of muteler) {
    let uye = client.guilds.cache.get(conf.sunucuId).members.cache.get(kisi.slice(1));
    if (uye && !uye.roles.cache.has(ayar.muteRolu)) uye.roles.add(ayar.muteRolu).catch();
  };
  
  for (let ceza of tempjailler) {
    let uye = client.guilds.cache.get(conf.sunucuId).members.cache.get(ceza.id);
    if (Date.now() >= ceza.kalkmaZamani) {
      cdb.set("tempjail", tempjailler.filter(x => x.id !== ceza.id));
      if (uye && uye.roles.cache.has(ayar.boosterRolu)) ayar.teyitsizRolleri.push(ayar.boosterRolu);
      if (uye && uye.roles.cache.has(ayar.jailRolu)) uye.roles.set(ayar.teyitsizRolleri).catch();
    } else {
      if (uye && !uye.roles.cache.has(ayar.jailRolu)) uye.roles.set(uye.roles.cache.has(ayar.boosterRolu) ? [ayar.boosterRolu, ayar.jailRolu] : [ayar.jailRolu]).catch();
    };
  };
    // Chat mute tarama
  for (let ceza of tempmuteler) {
    let uye = client.guilds.cache.get(conf.sunucuId).members.cache.get(ceza.id);
    if (Date.now() >= ceza.kalkmaZamani) {
      cdb.set("tempmute", tempmuteler.filter(x => x.id !== ceza.id));
      if (uye && uye.roles.cache.has(ayar.muteRolu)) uye.roles.remove(ayar.muteRolu).catch();
    } else {
      if (uye && !uye.roles.cache.has(ayar.muteRolu)) uye.roles.add(ayar.muteRolu).catch();
    };
  };
  // Sağtık ses mute tarama
  for (let ceza of sesmuteler) {
    let uye = client.guilds.cache.get(conf.sunucuId).members.cache.get(ceza.id);
    if (Date.now() >= ceza.kalkmaZamani) {
      cdb.set("tempsmute", sesmuteler.filter(x => x.id !== ceza.id));
      if (uye && uye.voice.channel && uye.voice.serverMute) uye.voice.setMute(false);
    } else {
      if (uye && uye.voice.channel && !uye.voice.serverMute) uye.voice.setMute(true);
    };
  };
};
