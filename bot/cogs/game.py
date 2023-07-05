import discord
from discord.ext import commands
from discord import app_commands
from api import session
import json

class Game(commands.Cog):
    def __init__(self, bot: commands.bot):
        self.bot = bot
        
    game_group = app_commands.Group(name="game", description="Manage game data and settings.")

    
    # /game info
    @game_group.command(name="info", description="View general game metadata.")
    async def info(self, interaction: discord.Interaction):
        response = session.get(session.base_url + "games/" + str(interaction.guild_id))
        print(response.content)
        data = json.loads(response.text)        
        if response.status_code == 200:
            await interaction.response.send_message(data, ephemeral=False)
        else:
            await interaction.response.send_message(data['message'])
    
    # /game create [name]
    @game_group.command(name="create", description="Start a new game for the current server.")
    @app_commands.describe(name="A name for you game")
    async def create(self, interaction: discord.Interaction, name: str):

        response = session.post(session.base_url + "games", json={
            'ownerId': str(interaction.user.id),
            'guildId': str(interaction.guild_id),
            'name': name
        })
        print(response.content)
        data = json.loads(response.text)
        if response.status_code == 200:
            await interaction.response.send_message(data, ephemeral=False)
        else:
            await interaction.response.send_message(data['message'])
    
    # /game destroy    
    @game_group.command(name="destroy", description="End this game, wiping all data.")
    async def destroy(self, interaction: discord.Interaction):

        response = session.delete(session.base_url + "games/" + str(interaction.guild_id), params={
            'userId': str(interaction.user.id)
        })
        print(response.content)
        data = json.loads(response.text)
        if response.status_code == 200:
            await interaction.response.send_message(data, ephemeral=False)
        else:
            await interaction.response.send_message(data['message'])
    
    
    # /game invite [member] [expires]
    @game_group.command(name="invite", description="Invite a server member.")
    @app_commands.describe(member="The member to invite")
    @app_commands.describe(expires="Invite duration in ms")
    async def invite(self, interaction: discord.Interaction, member: discord.User, expires: str):
        # Transform into invite request objects
        members = [{
            'userId': str(member.id),
            'expires': str(expires),
        }]
        
        await interaction.response.defer()
        response = session.post(session.base_url + "games/" + str(interaction.guild_id) + "/invites", json={
            'inviter': str(interaction.user.id),
            'invitees': members
        })
        print(response.content)
        data = json.loads(response.text)
        if response.status_code == 200:
            await interaction.followup.send(data)
        else:
            await interaction.followup.send(data['message'])
    
    # /game invite_many [role] [expires]
    @game_group.command(name="invite_many", description="Invite multiple server members with a role.")
    @app_commands.describe(role="Members with this role will be inivted")
    @app_commands.describe(expires="Invite duration in ms")
    async def invite_many(self, interaction: discord.Interaction, role: discord.Role, expires: str):
        # Collect members via role
        members = []
        if(role.name == "@everyone"):
            guild = interaction.guild
            async for member in guild.fetch_members(limit=None):
                members.append(member)
        else:
            for n in range(len(role.members)):
                members.append(role.members[n])

        # Transform into invite request objects
        members = [{
            'userId': str(member.id),
            'expires': expires,
        } for member in members]
                
        await interaction.response.defer()
        
        response = session.post(session.base_url + "games/" + str(interaction.guild_id) + "/invites", json={
            'inviter': str(interaction.user.id),
            'invitees': members
        })
        print(response.content)
        data = json.loads(response.text)
        if response.status_code == 200:
            await interaction.followup.send(data)
        else:
            await interaction.followup.send(data['message'])

        
async def setup(bot: commands.Bot) -> None:
    await bot.add_cog(Game(bot))
        