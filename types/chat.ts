export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
}

export interface ChatHistory {
  id: string;
  title: string | null;
  messages: Message[];
  resumeId: string | null;
  createdAt: string;
  updatedAt: string;
}
