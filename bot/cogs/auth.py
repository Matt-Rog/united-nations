import discord
from discord.ext import commands
from discord import app_commands

class Auth(commands.Cog):
    def __init__(self, bot: commands.bot):
        self.bot = bot
    
        
    @app_commands.command(name="signin", description="Signup or sign in to United Nations.")
    async def signin(self, interaction: discord.Interaction):
        button = discord.ui.Button(label='Sign in', style=discord.ButtonStyle.url, url='https://united-nations.vercel.app/auth')
        view = discord.ui.View()
        view.add_item(button)
        await interaction.response.send_message(view=view)
        
async def setup(bot: commands.Bot) -> None:
    await bot.add_cog(Auth(bot))
        