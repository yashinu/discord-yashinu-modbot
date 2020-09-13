const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const db = new qdb.table("istatistik");
const adb = new qdb.table("ayarlar");

module.exports = (message) => {
    if(message.author.bot) return;
    let raw = db.get(`raw`);
    if(!raw) raw = db.set(`raw`, {day: 1, lastDay: Date.now() + (1000 * 60 * 60 * 24)})
    if(Date.now() >= raw.lastDay) raw = db.set(`raw`, {day: raw.day + 1, lastDay: Date.now() + (1000 * 60 * 60 * 24)});
    db.add(`stats.text.members.${raw.day}.${message.member.id}.${message.channel.id}`, 1);
    db.add(`stats.text.channels.${raw.day}.${message.channel.id}`, 1);
};

module.exports.configuration = {
  name: "message"
};