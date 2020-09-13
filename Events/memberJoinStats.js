
const qdb = require("quick.db");
const db = new qdb.table("istatistik");
const client = global.client;
module.exports = (member) => {
  if(member.user.bot) return;
  let raw = db.get(`raw`);
  if(!raw) raw = db.set(`raw`, {day: 1, lastDay: Date.now() + (1000 * 60 * 60 * 24)})
  db.add(`stats.server.${raw.day}.members`, 1);
}
module.exports.configuration = {
  name: "guildMemberAdd"
}