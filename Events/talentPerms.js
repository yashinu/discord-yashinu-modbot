const { MessageEmbed } = require("discord.js");
const conf = require('../ayarlar.json');
const qdb = require("quick.db");
const cdb = new qdb.table("cezalar");
const db = new qdb.table("ayarlar");
const client = global.client;

client.komutlar = [
  {isim: "vip", rol: "590673911167975437"},
  {isim: "elite", rol: "604116530166235166"},
  {isim: "important", rol: "582928589964705792"},
  {isim: "rapper", rol: "615947945485008945"},
  {isim: "beatboxer", rol: "701780622326366309"},
  {isim: "vocalist", rol: "582928585510223893"},
  {isim: "gitarist", rol: "591040795281326101"},
  {isim: "kemanist", rol: "606187559500120064"},
  {isim: "piyanist", rol: "627557650724421643"},
  {isim: "designer", rol: "605119171033825300"},
  {isim: "gamer", rol: "631524481386676244"},
  {isim: "intro-maker", rol: "629746296647057418"},
  {isim: "poet", rol: "598628757326266371"},
  {isim: "painter", rol: "597808607463211045"},
  {isim: "instagram-user", rol: "641288137934635017"},
  {isim: "lovers", rol: "595644405273067532"},
  {isim: "sap", rol: "662988962134229002"},
  {isim: "ekip", rol: "582928588349636608"},
  {isim: "terapist", rol: "689184135960461399"},
  {isim: "rehber", rol: "626907350602743838"},
  {isim: "uyarı1", rol: "611937755257372683"},
  {isim: "uyarı2", rol: "611937759745146908"},
  {isim: "uyarı3", rol: "611937764820385812"},
  {isim: "streamer", rol: "696703917664370849"},
  {isim: "yetkilial1", rol: "589975289249923083"},
  {isim: "yetkilial2", rol: "592791364370956308"},
  {isim: "yetkilial3", rol: "589975277610860555"},
  {isim: "teyitver", rol: "589975277610860555"},
];

module.exports = (message) => {
  if (!message.content.startsWith(conf.prefix)) return;
  let ayar = db.get('ayar') || {};
  let args = message.content.substring(conf.prefix.length).split(" ");
  let command = args[0];
  args = args.splice(1);
  let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if (!uye) return;
  let komut = client.komutlar.find(k => k.isim === command);
  if (komut && (komut.isim === "yetkilial1" || komut.isim === "yetkilial2" || komut.isim === "yetkilial3")) {
    if (!message.member.roles.cache.has("702571625811542047") && !message.member.roles.cache.has(ayar.sahipRolu) && !conf.sahip.some(id => message.author.id === id)) return;
    uye.roles.add([komut.rol, "729396561691541586", "601851617343701034", "645664873191309314"]);
    return message.react(client.emojiler.onay);
  };

  if (komut && (komut.isim === "teyitver")) {
    if (!message.member.roles.cache.has("626080186588200960") && !message.member.roles.cache.has(ayar.sahipRolu) && !conf.sahip.some(id => message.author.id === id)) return;
    uye.roles.add(["600429816935874609", "603665487662153738"]);
    return message.react(client.emojiler.onay);
  };

  if (komut && komut.isim === "terapist") {
  if (!message.member.roles.cache.has("701007285983379456") && !message.member.roles.cache.has(ayar.sahipRolu) && !conf.sahip.some(id => message.author.id === id)) return;
    uye.roles.cache.has(komut.rol) ? uye.roles.remove(komut.rol) : uye.roles.add(komut.rol);
    return message.react(client.emojiler.onay);
  };
  if (komut && (komut.isim === "rehber" || komut.isim === "uyarı1" || komut.isim === "uyarı2" || komut.isim === "uyarı3")) {
  if (!message.member.roles.cache.has("645674008229969920") && !message.member.roles.cache.has(ayar.sahipRolu) && !conf.sahip.some(id => message.author.id === id)) return;
    uye.roles.cache.has(komut.rol) ? uye.roles.remove(komut.rol) : uye.roles.add(komut.rol);
    return message.react(client.emojiler.onay);
  };
  if (komut && (komut.isim === "streamer" || komut.isim === "youtuber" || komut.isim === "coder" || komut.isim === "famous")) {
    if (!message.member.hasPermission("ADMINISTRATOR")) return;
    uye.roles.cache.has(komut.rol) ? uye.roles.remove(komut.rol) : uye.roles.add(komut.rol);
    return message.react(client.emojiler.onay);
  };

  if (komut && (komut.isim === "elite")) {
    if (!message.member.hasPermission("ADMINISTRATOR")) return;
    uye.roles.cache.has(komut.rol) ? uye.roles.remove(komut.rol) : uye.roles.add(komut.rol);
    return message.react(client.emojiler.onay);
  };
  if (!message.member.roles.cache.has("603665487662153738") && !message.member.roles.cache.has(ayar.sahipRolu) && !conf.sahip.some(id => message.author.id === id)) return;
  if (!uye || !komut) return;
  uye.roles.cache.has(komut.rol) ? uye.roles.remove(komut.rol).catch() : uye.roles.add(komut.rol).catch();
  return message.react(client.emojiler.onay);
};

module.exports.configuration = {
  name: "message"
};