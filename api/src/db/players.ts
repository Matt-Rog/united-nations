import mongoose from "mongoose";

const PlayerSchema = new mongoose.Schema({
  game_id: { type: String, required: true },
  user_id: { type: String, required: true },
  is_game_owner: { type: Boolean, required: true },
  name: { type: String, required: true },
  spectating: { type: Boolean, required: true },
  nation_id: { type: String },
  title: { type: String },
});

export const PlayerModel = mongoose.model("Player", PlayerSchema);

export const getPlayers = () => PlayerModel.find();

export const getPlayerById = (id: string) => PlayerModel.findById(id);

export const createPlayer = (values: Record<string, any>) =>
  new PlayerModel(values).save().then((player) => player.toObject());

export const deletePlayerById = (id: string) =>
  PlayerModel.findOneAndDelete({ _id: id });

export const updatePlayerById = (id: string, values: Record<string, any>) =>
  PlayerModel.findByIdAndUpdate(id, values);
