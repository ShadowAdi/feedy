import { Account, Client, Databases, OAuthProvider, Storage } from "appwrite";

export const appWriteVariables = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
  userCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID as string,
  projectsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_COLLECTION_ID as string,
  feedbackCollectionId: process.env.NEXT_PUBLIC_APPWRITE_FEEDBACK_COLLECTION_ID as string,
  storageId: process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID as string,
};

export const client = new Client();
client
  .setEndpoint(appWriteVariables.endpoint)
  .setProject(appWriteVariables.projectId)

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client)


export { ID } from "appwrite";
export { OAuthProvider };
