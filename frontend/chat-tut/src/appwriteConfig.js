import { Client, Databases, Account } from "appwrite";

export const PROJECT_ID = "65be12f26d517a5bc332";
export const DATABASE_ID = "65be13b9590def2fe4a9";
export const COLLECTION_ID_MESSAGES = "65be13d695670b31c653";

const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("65be12f26d517a5bc332");

export const databases = new Databases(client);
export const account = new Account(client);

export default client;
