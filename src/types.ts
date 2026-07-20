export interface IUser {
  id: string;
  name: string;
  email: string;
}

export interface IBoard {
  _id: string;
  title: string;
  description: string;
  context: string;
  category: "Decision" | "Idea" | "Plan";
  status: "Active" | "Archived";
  isPublic: boolean;
  ownerId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IMessage {
  _id: string;
  boardId: string;
  role: "user" | "model";
  content: string;
  createdAt: string;
}

export interface IGeneratedOutput {
  _id: string;
  boardId: string;
  type: "decision_brief" | "outline" | "plan" | "draft";
  content: string;
  version: number;
  createdAt: string;
}

export interface IRecommendation {
  title: string;
  description: string;
  actionType: "chat" | "generate" | "research";
}

export type ActiveView = 
  | "home"
  | "explore"
  | "board_detail" // public template preview
  | "board_workspace" // active work
  | "login"
  | "register"
  | "dashboard" // dynamic workspace launcher
  | "add_board"
  | "manage_boards"
  | "settings"
  | "about"
  | "contact"
  | "terms";
