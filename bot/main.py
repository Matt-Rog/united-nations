import discord
from discord.ext import commands
import http.server
import socketserver
import asyncio
import os
from dotenv import load_dotenv
import warnings

# Ignore DeprecationWarning
warnings.filterwarnings("ignore", category=DeprecationWarning)

load_dotenv()
token = os.environ.get('DEV_TOKEN') or os.environ.get('TOKEN')

class Bot(commands.Bot):
    def __init__(self):
        intents = discord.Intents.default()
        intents.members = True
        super().__init__(command_prefix=commands.when_mentioned_or('!'), intents=intents)
        self.cogs_list = ["cogs.util", "cogs.auth", "cogs.game"]

    async def setup_hook(self):
        for ext in self.cogs_list:
            await self.load_extension(ext)
        
    async def on_ready(self):
        
        print("Logged in as " + self.user.name)
        print("Bot ID " + str(self.user.id))
        print("Discord Version " + discord.__version__)
        synced = await self.tree.sync()
        print("Slash CMDs Synced " + str(len(synced)) + " Commands")


class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/":
            self.send_response(200)
            self.send_header("Content-type", "text/html")
            self.end_headers()
            self.wfile.write(b"Hello, world!")  # Replace with your desired response
        else:
            self.send_response(404)
            self.send_header("Content-type", "text/html")
            self.end_headers()
            self.wfile.write(b"404 Not Found")  # Replace with your desired response

with socketserver.TCPServer(("", 8000), Handler) as httpd:
    print("Server started at localhost:" + str(8000))
    server_thread = asyncio.get_event_loop().run_in_executor(None, httpd.serve_forever)
    
    bot = Bot()
    bot.run(token)
    
    server_thread.result()

