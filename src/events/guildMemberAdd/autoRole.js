const { Client, GuildMember } = require('discord.js');
const AutoRole = require('../../models/AutoRole');

/**
 *
 * @param {Client} client
 * @param {GuildMember} member
 */
module.exports = async (client, member) => {
  try {
    let guild = member.guild;
    if (!guild) return;

    const autoRole = await AutoRole.findOne({ guildId: guild.id });
    if (!autoRole) return;

    await member.roles.add(autoRole.roleId);

    
    const role = guild.roles.cache.get(autoRole.roleId);

    
    await member.setNickname(`${role.name} ${member.user.username}`);
  } catch (error) {
    console.log(`Error giving role automatically: ${error}`);
  }
};
