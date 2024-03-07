const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    PermissionFlagsBits,
  } = require('discord.js');
  
  module.exports = {
    /**
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
      const targetUser = interaction.options.get('target-user').member;
      const roleToSet = interaction.options.get('role-to-set').role;
      const newUsername = interaction.options.get('new-username').value;
  
      await interaction.deferReply();
  
      if (!targetUser) {
        await interaction.editReply("That user doesn't exist in this server.");
        return;
      }
  
      const targetUserRolePosition = targetUser.roles.highest.position;
      const requestUserRolePosition = interaction.member.roles.highest.position;
      const botRolePosition = interaction.guild.members.me.roles.highest.position;
  
      if (targetUserRolePosition >= requestUserRolePosition) {
        await interaction.editReply(
          "You can't set the role for that user because they have the same/higher role than you."
        );
        return;
      }
  
      if (targetUserRolePosition >= botRolePosition) {
        await interaction.editReply(
          "I can't set the role for that user because they have the same/higher role than me."
        );
        return;
      }
  
      // Set the role and change the nickname
      try {
        await targetUser.roles.add([roleToSet]);
        await targetUser.setNickname(`${roleToSet.name} ${newUsername}`);
        await interaction.editReply(
          `Role and nickname set for ${targetUser.displayName}`
        );
      } catch (error) {
        console.log(`There was an error when setting role and nickname: ${error}`);
      }
    },
  
    name: 'setrole',
    description: 'Sets a role and changes the nickname of a member.',
    options: [
      {
        name: 'target-user',
        description: 'The user you want to set the role for.',
        type: ApplicationCommandOptionType.User,
        required: true,
      },
      {
        name: 'role-to-set',
        description: 'The role you want to set for the user.',
        type: ApplicationCommandOptionType.Role,
        required: true,
      },
      {
        name: 'new-username',
        description: 'The new username to set for the user.',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
    permissionsRequired: [PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ManageNicknames],
    botPermissions: [PermissionFlagsBits.ManageRoles, PermissionFlagsBits.ManageNicknames],
  };
  