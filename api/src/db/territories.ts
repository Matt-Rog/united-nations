import mongoose from "mongoose";

const ResourceCount = new mongoose.Schema({
  resource_id: { type: String, required: true },
  count: { type: Number, required: true },
  limit: { type: Number },
});

const TerritorySchema = new mongoose.Schema({
  game_id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  leader: { type: String },
  type: { type: String, required: true },
  resources: [ResourceCount],
  super_territories: { type: Array, required: true },
  sub_territories: { type: String, required: true },
});

export const TerritoryModel = mongoose.model("Territory", TerritorySchema);

export const getTerritorys = () => TerritoryModel.find();

export const getTerritoryById = (id: string) => TerritoryModel.findById(id);

export const createTerritory = (values: Record<string, any>) =>
  new TerritoryModel(values).save().then((territory) => territory.toObject());

export const deleteTerritoryById = (id: string) =>
  TerritoryModel.findOneAndDelete({ _id: id });

export const updateTerritoryById = (id: string, values: Record<string, any>) =>
  TerritoryModel.findByIdAndUpdate(id, values);
