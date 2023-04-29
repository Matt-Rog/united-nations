import mongoose from "mongoose";
const NationSchema = new mongoose.Schema({
  game_id: { type: String, required: true },
  players: { type: Array, required: true },
  territories: { type: Array, required: true },
});

export const NationModel = mongoose.model("Nation", NationSchema);

export const getNations = () => NationModel.find();

export const getNationById = (id: string) => NationModel.findById(id);

export const createNation = (values: Record<string, any>) =>
  new NationModel(values).save().then((nation) => nation.toObject());

export const deleteNationById = (id: string) =>
  NationModel.findOneAndDelete({ _id: id });

export const updateNationById = (id: string, values: Record<string, any>) =>
  NationModel.findByIdAndUpdate(id, values);
