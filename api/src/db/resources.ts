import mongoose from "mongoose";

const ResourceSchema = new mongoose.Schema({
  game_id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  required: { type: Boolean, required: true },
  price: { type: Number },
  type: { type: String, required: true },
  emoji_url: { type: String, required: true },
  discord_emoji_id: { type: String },
});

export const ResourceModel = mongoose.model("Resource", ResourceSchema);

export const getResources = () => ResourceModel.find();

export const getResourceById = (id: string) => ResourceModel.findById(id);

export const createResource = (values: Record<string, any>) =>
  new ResourceModel(values).save().then((resource) => resource.toObject());

export const deleteResourceById = (id: string) =>
  ResourceModel.findOneAndDelete({ _id: id });

export const updateResourceById = (id: string, values: Record<string, any>) =>
  ResourceModel.findByIdAndUpdate(id, values);
