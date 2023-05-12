const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

module.exports = (client) => {
  client.handleCommands = async () => {
    var commandArray = [];
    const commandFolders = fs.readdirSync("./src/commands");
    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(`./src/commands/${folder}`)
        .filter((file) => file.endsWith(".js"));
      const { commands } = client;
      for (const file of commandFiles) {
        const command = require(`../../commands/${folder}/${file}`);
        commands.set(command.data.name, command);
        commandArray.push(command.data.toJSON());
        console.log(`Command: ${command.data.name} has passed through handler`);
      }
    }
    const { token, token_dev } = process.env;
    const clientId = token_dev ? "1106659951407013908" : "1101958978046541894";
    const rest = new REST({ version: "9" }).setToken(token_dev || token);
    try {
      console.log("Reloading app (/) commands.");
      await rest.put(Routes.applicationCommands(clientId), {
        body: commandArray,
      });

      console.log("Successfully reloaded app (/) commands.");
    } catch (error) {
      console.log(error);
    }
  };
};
