const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const db = new qdb.table("istatistik");
const adb = new qdb.table("ayarlar");

const sesli = new Map();
module.exports = (oldState, newState) => {
  if(oldState.member && oldState.member.user.bot) return;
  if (!oldState.channelID && newState.channelID) {
    sesli.set(oldState.id, {
      channel: newState.channelID,
      duration: Date.now()
    });
  }
  if (!sesli.has(oldState.id))
    sesli.set(oldState.id, {
      channel: oldState.channelID || newState.channelID,
      duration: Date.now()
    });

  let data = sesli.get(oldState.id);
  let duration = getDuraction(data.duration);
  if (oldState.channelID && !newState.channelID) {
    voiceInit(oldState.id, data.channel, duration);
    sesli.delete(oldState.id);
  } else if (oldState.channelID && newState.channelID) {
    voiceInit(oldState.id, data.channel, duration);
    sesli.set(oldState.id, {
      channel: newState.channelID,
      duration: Date.now()
    });
  }
};

module.exports.configuration = {
  name: "voiceStateUpdate"
};

function getDuraction(ms) {
  return Date.now() - ms;
}

function voiceInit(memberId, channelId, duraction) {
  let raw = db.get(`raw`);
  if (!raw)
    raw = db.set(`raw`, { day: 1, lastDay: Date.now() + 1000 * 60 * 60 * 24 });
  if (Date.now() >= raw.lastDay)
    raw = db.set(`raw`, {
      day: raw.day + 1,
      lastDay: Date.now() + 1000 * 60 * 60 * 24
    });
  db.add(`stats.voice.members.${raw.day}.${memberId}.${channelId}`, duraction);
  db.add(`stats.voice.channels.${raw.day}.${channelId}`, duraction);
}