

class AnswerDto {
  answer_id: string;

  answer_text: string;

  is_correct: boolean;
}

class QuizQuestionDto {
  question_id: string;

  question_text: string;

  answers: AnswerDto[];
}

export class CreateMultiChoiceQuizDto {
  quiz_id: string;

  nbr_questions: number;

  difficulty: number;

  grading_option: string;

  quiz_questions: QuizQuestionDto[];
}