import { QuestionAttachment } from "../../enterprises/entities/question-attachment";

export interface QuestionAttachmentsRepository{
  findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]>
  deleteManyByQuestionId(questionId: string): Promise<void>
}