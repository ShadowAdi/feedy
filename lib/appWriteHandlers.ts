import { User } from "@/context/UserContext";
import {
  account,
  appWriteVariables,
  databases,
  ID,
  OAuthProvider,
} from "./appWrite";
import {
  CreateFeedbackParams,
  CreateFeedbackResponse,
  FeedbackProps,
  ProjectType,
} from "./types";
import { Query } from "appwrite";
import { FeedbackStatus, FeedbackType } from "./enum";

interface CreateUserProps {
  email: string;
  password: string;
  username: string;
  bio?: string;
  avatar: string;
}

interface UpdateUserProps {
  username: string;
  bio?: string;
  avatar: string;
}

export async function signIn(
  email: string,
  password: string
): Promise<{
  success: boolean;
  message: string;
  error?: any;
  session?: any;
}> {
  try {
    const emailSession = await account.createEmailPasswordSession(
      email,
      password
    );
    return {
      success: true,
      message: "Login Successful",
      session: emailSession,
    };
  } catch (error) {
    return { message: "User login Failed", success: false, error: error };
  }
}

export async function createUser({
  avatar,
  email,
  password,
  username,
  bio,
}: CreateUserProps): Promise<{
  success: boolean;
  message: string;
  error?: any;
  user?: any;
  session?: any;
}> {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw new Error("Account creation failed.");

    const { message, success, error, session } = await signIn(email, password);
    if (success) {
      const newUser = await databases.createDocument(
        appWriteVariables.databaseId,
        appWriteVariables.userCollectionId,
        newAccount.$id, // Use newAccount.$id as the document ID
        {
          email,
          username,
          avatar,
          bio,
        }
      );

      // Fetch the user details immediately after account creation
      const userDetails = await GetUser();

      return {
        message: "User Created",
        success: true,
        user: userDetails.user || newUser,
        session,
      };
    }
    return {
      message,
      success: false,
      error,
    };
  } catch (error: any) {
    console.log("Error in registering: ", error);
    return { message: "User Creation Failed", success: false, error };
  }
}

export const loginWithGoogle = async (): Promise<{
  message: string;
  success: boolean;
  error?: any;
  session?: any;
}> => {
  try {
    const session = account.createOAuth2Session(
      OAuthProvider.Google,
      "https://feedy-nine.vercel.app/dashboard",
      "https://feedy-nine.vercel.app/register"
    );

    return {
      message: "User Login Successful",
      success: true,
      session: session,
    };
  } catch (error: any) {
    console.error(error);
    return {
      message: "User Login Failed",
      success: false,
      error: error,
    };
  }
};

export const logout = async (): Promise<{
  message: string;
  success: boolean;
  error?: any;
}> => {
  try {
    await account.deleteSession("current");
    return {
      message: "Logout Successfull",
      success: true,
    };
  } catch (error: any) {
    console.log("Logging Out Error: ", error);
    return {
      error: error,
      message: "Logging Out Failed",
      success: false,
    };
  }
};

export const GetUser = async (): Promise<{
  message: string;
  success: boolean;
  user?: User;
  error?: any;
}> => {
  try {
    const accountUser = await account.get();
    const userDocument = await databases.getDocument(
      appWriteVariables.databaseId,
      appWriteVariables.userCollectionId,
      accountUser.$id
    );

    return {
      message: "User fetched successfully",
      success: true,
      user: {
        $id: accountUser.$id,
        email: accountUser.email,
        username: accountUser.name,
        $createdAt: accountUser.$createdAt,
        avatar: userDocument.avatar,
        bio: userDocument.bio,
      },
    };
  } catch (error: any) {
    console.error("Error fetching user:", error);
    return {
      message: "Error fetching user",
      success: false,
      error,
    };
  }
};

export const GetAllProjects = async (
  userId: string
): Promise<{
  success: boolean;
  message: string;
  error?: any;
  allProjects?: ProjectType[];
  totalProjects?: number;
}> => {
  try {
    const data = await databases.listDocuments(
      appWriteVariables.databaseId,
      appWriteVariables.projectsCollectionId,
      [
        Query.equal("userId", userId), // Filter projects by user_id
      ]
    );

    const allProjects: ProjectType[] = data.documents.map((doc) => ({
      $collectionId: doc.$collectionId,
      $createdAt: doc.$createdAt,
      $id: doc.$id,
      $updatedAt: doc.$updatedAt,
      feedbacks: doc.feedbacks || [],
      project_description: doc.project_description || "",
      project_name: doc.project_name || "",
      project_url: doc.project_url || "",
      total_feedbacks: doc.total_feedbacks || 0,
    }));

    return {
      allProjects,
      success: true,
      message: "Get The Data",
      totalProjects: data.total,
    };
  } catch (error) {
    console.log("Error: ", error);
    return {
      message: "Failed to Fetch the data",
      success: false,
      error: error,
      totalProjects: 0,
      allProjects: undefined,
    };
  }
};

export const CreateProject = async ({
  project_url,
  project_name,
  userId,
  project_description,
}: {
  project_url: string;
  project_name: string;
  project_description?: string;
  userId: string;
}): Promise<{
  message: string;
  success: boolean;
  projectId?: string;
  error?: any;
}> => {
  try {
    const data = await databases.createDocument(
      appWriteVariables.databaseId,
      appWriteVariables.projectsCollectionId,
      ID.unique(),
      {
        project_url: project_url,
        project_name: project_name,
        project_description: project_description,
        userId: userId, // Store the creator's user ID
      }
    );
    return {
      message: "Project Created",
      success: true,
      projectId: data.$id,
    };
  } catch (error) {
    console.log("Error Details:", JSON.stringify(error, null, 2));
    return {
      message: "Creation Failed",
      error: error,
      success: false,
    };
  }
};
export const GetProject = async ({
  projectId,
}: {
  projectId: string;
}): Promise<{
  success: boolean;
  error?: any;
  project?: ProjectType;
}> => {
  try {
    const data = await databases.getDocument(
      appWriteVariables.databaseId,
      appWriteVariables.projectsCollectionId,
      projectId
    );
    const singleProject: ProjectType = {
      $collectionId: data.$collectionId,
      $createdAt: data.$createdAt,
      $id: data.$id,
      $updatedAt: data.$updatedAt,
      feedbacks: data.feedbacks || [], // Default to empty array if undefined
      project_description: data.project_description || "", // Default to empty string if undefined
      project_name: data.project_name || "",
      project_url: data.project_url || "",
    };
    return {
      project: singleProject,
      success: true,
    };
  } catch (error) {
    console.log("Error: ", error);
    return {
      success: false,
      error: error,
    };
  }
};

export const DeleteProject = async ({
  projectId,
}: {
  projectId: string;
}): Promise<{
  success: boolean;
  error?: any;
  message: string;
}> => {
  try {
    await databases.deleteDocument(
      appWriteVariables.databaseId,
      appWriteVariables.projectsCollectionId,
      projectId
    );
    return {
      success: true,
      message: "Document Deleted",
    };
  } catch (error) {
    console.log("Error: ", error);
    return {
      success: false,
      error: error,
      message: "Failed to delete the document",
    };
  }
};

export const UpdateProject = async ({
  project_url,
  project_name,
  project_description,
  projectId,
}: {
  project_url: string;
  project_name: string;
  project_description?: string;
  userId: string;
  projectId: string;
}): Promise<{
  success: boolean;
  error?: any;
  message: string;
  updatedProject?: string;
}> => {
  try {
    const data = await databases.getDocument(
      appWriteVariables.databaseId,
      appWriteVariables.projectsCollectionId,
      projectId
    );

    if (!data) {
      return {
        success: false,
        message: "Project do not exists",
      };
    }

    const updatedProject = await databases.updateDocument(
      appWriteVariables.databaseId,
      appWriteVariables.projectsCollectionId,
      projectId,
      {
        project_name: project_name,
        project_url: project_url,
        project_description: project_description,
      }
    );

    return {
      success: true,
      message: "Document updated",
      updatedProject: updatedProject.$id,
    };
  } catch (error) {
    console.log("Error: ", error);
    return {
      success: false,
      error: error,
      message: "Failed to delete the document",
    };
  }
};

export const GetAllFeedbacks = async (
  projectId: string
): Promise<{
  success: boolean;
  feedbacks?: FeedbackProps[];
  error?: any;
}> => {
  try {
    const data = await databases.listDocuments(
      appWriteVariables.databaseId,
      appWriteVariables.feedbackCollectionId,
      [Query.equal("project_id", projectId)]
    );

    const feedbacks: FeedbackProps[] = data.documents.map((doc) => ({
      projectId: doc.project_id, // Ensure this matches your schema
      description: doc.description || "", // Default to an empty string if missing
      username: doc.username || "Anonymous", // Default to "Anonymous"
      userEmail: doc.userEmail || "unknown@example.com", // Provide a default email
      page_url: doc.page_url || "", // Default to empty if missing
      screenshot_url: doc.screenshot_url || undefined, // Optional field
      feedback_type: doc.feedback_type || "general", // Provide a default type
      status: doc.status || "pending", // Default status
      rating: doc.rating || 3, // Default rating
      $id: doc.$id,
      $collectionId: doc.$collectionId,
      $databaseId: doc.$databaseId,
      $createdAt: doc.$createdAt,
      $updatedAt: doc.$updatedAt,
      $permissions: doc.$permissions,
    }));

    return {
      success: true,
      feedbacks,
    };
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    return {
      success: false,
      error,
    };
  }
};

export const DeleteFeedback = async (
  feedback_id: string
): Promise<{ success: boolean; message: string; error?: any }> => {
  try {
    await databases.deleteDocument(
      appWriteVariables.databaseId,
      appWriteVariables.feedbackCollectionId,
      feedback_id
    );
    return {
      message: "Delete the feedback",
      success: true,
    };
  } catch (error) {
    console.log("Error Deleting: ", error);
    return {
      message: "Failed to Delete the feedback",
      success: false,
      error: error,
    };
  }
};

export const DeleteManyFeedback = async (
  feedback_ids: string[]
): Promise<{ success: boolean; message: string; error?: any }> => {
  try {
    for (var i = 0; i < feedback_ids.length; i++) {
      await databases.deleteDocument(
        appWriteVariables.databaseId,
        appWriteVariables.feedbackCollectionId,
        feedback_ids[i]
      );
    }

    return {
      message: "Delete the feedback",
      success: true,
    };
  } catch (error) {
    console.log("Error Deleting: ", error);
    return {
      message: "Failed to Delete the feedback",
      success: false,
      error: error,
    };
  }
};

export const GetUserProjects = async (
  userId: string
): Promise<{
  success: boolean;
  error?: any;
  totalProjects?: number;
}> => {
  try {
    const data = await databases.listDocuments(
      appWriteVariables.databaseId,
      appWriteVariables.projectsCollectionId,
      [
        Query.equal("userId", userId), // Filter projects by user_id
      ]
    );

    return {
      success: true,
      totalProjects: data.total,
    };
  } catch (error) {
    console.log("Error: ", error);
    return {
      success: false,
      error: error,
      totalProjects: 0,
    };
  }
};

export const UpdateProfile = async ({
  avatar,
  username,
  bio,
}: UpdateUserProps): Promise<{
  message: string;
  success: boolean;
  error?: any;
}> => {
  try {
    const accountUser = await account.get();
    const userDocument = await databases.getDocument(
      appWriteVariables.databaseId,
      appWriteVariables.userCollectionId,
      accountUser.$id
    );

    await databases.updateDocument(
      appWriteVariables.databaseId,
      appWriteVariables.userCollectionId,
      userDocument.$id,
      {
        username: username,
        bio: bio,
        avatar: avatar,
      }
    );

    return {
      message: "User Updated successfully",
      success: true,
    };
  } catch (error: any) {
    console.error("Error fetching user:", error);
    return {
      message: "Error fetching user",
      success: false,
      error,
    };
  }
};

export const CreateFeedback = async ({
  description,
  username,
  userEmail,
  page_url,
  feedback_type,
  status,
  rating,
  project_id,
}: CreateFeedbackParams): Promise<CreateFeedbackResponse> => {
  try {
    // Default anonymous values if not provided
    if (!username) username = "Anonymous";
    if (!userEmail) userEmail = "anonymous@example.com";

    // Validation
    if (!Object.values(FeedbackType).includes(feedback_type)) {
      throw new Error(
        `Invalid feedback type. Must be one of: ${Object.values(
          FeedbackType
        ).join(", ")}`
      );
    }

    if (!Object.values(FeedbackStatus).includes(status)) {
      throw new Error(
        `Invalid status. Must be one of: ${Object.values(FeedbackStatus).join(
          ", "
        )}`
      );
    }

    if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      throw new Error("Rating must be an integer between 1 and 5");
    }

    // Create the document
    const response = await databases.createDocument(
      appWriteVariables.databaseId,
      appWriteVariables.feedbackCollectionId,
      ID.unique(),
      {
        description,
        username,
        userEmail,
        page_url,
        feedback_type,
        status,
        rating,
        project_id: project_id,
      }
    );

    return {
      message: "Feedback created successfully",
      success: true,
    };
  } catch (error: any) {
    console.error("Error creating feedback:", error);
    return {
      message: error.message || "Error creating feedback",
      success: false,
      error,
    };
  }
};
