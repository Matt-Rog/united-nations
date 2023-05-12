module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(`Ready :3 ${client.user.tag} is logged in and online`);
  },
};
