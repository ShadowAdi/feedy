import { Models } from "appwrite";

export interface ProjectType {
  $collectionId: string;
  $createdAt: string;
  $id: string;
  $updatedAt: string;
  feedbacks: any[];
  project_description: string;
  project_name: string;
  project_url: string;
}

export type FeedbackProps = Models.Document & {
  projectId: string;
  description: string;
  username: string;
  userEmail: string;
  page_url: string;
  feedback_type: string;
  status: string;
  rating: number; // Add this field for ratings
};

export const tableColumns = [
  {
    key: "description",
    label: "description",
  },
  {
    key: "username",
    label: "username",
  },
  {
    key: "userEmail",
    label: "userEmail",
  },
  {
    key: "page_url",
    label: "page_url",
  },
 
  {
    key: "feedback_type",
    label: "feedback_type",
  },
  {
    key: "status",
    label: "status",
  },
  {
    key: "rating",
    label: "rating",
  },
];

export enum FeedbackStatus {
  NEW = "new",
  IN_PROGRESS = "inProgress",
  RESOLVED = "resolved",
}

export enum FeedbackType {
  BUG = "bug",
  GENERAL_INFORMATION = "generalInformation",
  FEATURE = "feature",
}

// Interface for function parameters
export interface CreateFeedbackParams {
  description: string;
  username: string;
  userEmail: string;
  page_url: string;
  feedback_type: FeedbackType;
  status: FeedbackStatus;
  rating: number;
  project_id: string;
}

export interface CreateFeedbackResponse {
  message: string;
  success: boolean;
  error?: any;
}
