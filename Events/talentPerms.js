const { MessageEmbed } = require("discord.js");
const conf = require('../ayarlar.json');
const qdb = require("quick.db");
const cdb = new qdb.table("cezalar");
const db = new qdb.table("ayarlar");
const client = global.client;

client.komutlar = [
  {isim: "vip", rol: "721069802768302183"},
  {isim: "vkceza", rol: "721142128163553391"},
  {isim: "dcceza", rol: "721141917345382530"},
  {isim: "bb", rol: "723627021141278810"},
  {isim: "ins", rol: "721069802763845636"},
  {isim: "voice", rol: "721069802763845638"},
  {isim: "rapper", rol: "721069802763845637"},
  {isim: "lovers", rol: "721069802763845640"},
  {isim: "şair", rol: "727248105757737093"},
  {isim: "software", rol: "721069802763845633"},
  {isim: "artist", rol: "721069802763845635"},
  {isim: "designer", rol: "721069802763845634"},
  {isim: "streamer", rol: "721069802763845639"},
  {isim: "voiceactor", rol: "723630408759115796"}
];

module.exports = (message) => {
  if (!message.content.startsWith(conf.prefix)) return;
  let args = message.content.split(' ').slice(1);
  let command = message.content.split(' ')[0].slice(conf.prefix.length);
  let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  let komut = client.komutlar.find(k => k.isim === command);
  if (!komut) return;
  if (komut.isim === "streamer" && message.member.hasPermission("ADMINISTRATOR")) return uye.roles.cache.has(komut.rol) ? uye.roles.remove(komut.rol).then(x => message.react(client.emojiler.onay)) : uye.roles.add(komut.rol).then(x => message.react(client.emojiler.onay));
  if ((komut.isim === "vkceza" && (message.member.roles.cache.has('721879843494559784') || message.member.hasPermission("ADMINISTRATOR"))) || (komut.isim === "dcceza" && (message.member.roles.cache.has('721879274839343124') || message.member.hasPermission("ADMINISTRATOR")))) return uye.roles.cache.has(komut.rol) ? uye.roles.remove(komut.rol).then(x => message.react(client.emojiler.onay)) : uye.roles.add(komut.rol).then(x => message.react(client.emojiler.onay));
  if ((message.member.roles.cache.has('721791414723149875') || message.member.hasPermission("ADMINISTRATOR") || message.member.roles.cache.has('721870588448211007')) && (komut === "voice" || komut.isim === "rapper" || komut.isim === "voiceactor" || komut.isim === "bb" || komut.isim === "ins")) return uye.roles.cache.has(komut.rol) ? uye.roles.remove(komut.rol).then(x => message.react(client.emojiler.onay)) : uye.roles.add(komut.rol).then(x => message.react(client.emojiler.onay));
  if (message.member.roles.cache.has('721069802776559653') || message.member.hasPermission("ADMINISTRATOR")) return uye.roles.cache.has(komut.rol) ? uye.roles.remove(komut.rol).then(x => message.react(client.emojiler.onay)) : uye.roles.add(komut.rol).then(x => message.react(client.emojiler.onay));
};

module.exports.configuration = {
  name: "message"
};