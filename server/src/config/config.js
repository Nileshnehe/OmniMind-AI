import { config} from "dotenv";
config();

if(!process.env.MONGO_URI){
    throw new Error("Mongo URI not defined");
};

export const configData = {
    MONGO_URI: process.env.MONGO_URI
}