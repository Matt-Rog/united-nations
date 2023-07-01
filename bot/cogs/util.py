import discord
from discord.ext import commands
from discord import app_commands

class Util(commands.Cog):
    def __init__(self, bot: commands.bot):
        self.bot = bot
        
    @app_commands.command(name="ping", description="Test bot connection.")
    async def ping(self, interaction: discord.Interaction):
        await interaction.response.send_message(f"Pong! {round(self.bot.latency * 1000)}ms")
        
async def setup(bot: commands.Bot) -> None:
    await bot.add_cog(Util(bot))
        