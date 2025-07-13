export interface QuestionFormData {
  title: string;
  content: string;
  image: File | null;
  consultant_id: string;
  category: string;
}

export interface QuestionsGetList {
  question_id: string;
  title: string;
  content: string;
  status: "Pending" | "Answered" | "Closed";
  category: string;
  answer?: string | null;
  image_url?: string | null;
  consultant_id: string;
  user_id: string;
  user_full_name: string;
  user_email: string;
  user: {
    user_id: string;
    full_name: string;
  };
}
