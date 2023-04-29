import mongoose from "mongoose";

const MarketItemSchema = new mongoose.Schema({
  resource_id: { type: String, required: true },
  price: { type: String, required: true },
  quantity: { type: String },
  seller: { type: String, required: true },
});

const GameSchema = new mongoose.Schema({
  discord_guild_id: { type: String },
  players: { type: Array, required: true },
  nations: { type: Array },
  resources: { type: Array },
  territories: { type: Array },
  market: [MarketItemSchema],
});

export const GameModel = mongoose.model("Game", GameSchema);

export const getGames = () => GameModel.find();

export const getGameById = (id: string) => GameModel.findById(id);

export const createGame = (values: Record<string, any>) =>
  new GameModel(values).save().then((game) => game.toObject());

export const deleteGameById = (id: string) =>
  GameModel.findOneAndDelete({ _id: id });

export const updateGameById = (id: string, values: Record<string, any>) =>
  GameModel.findByIdAndUpdate(id, values);
