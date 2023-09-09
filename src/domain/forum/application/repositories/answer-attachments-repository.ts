import { AnswerAttachment } from "../../enterprises/entities/answer-attachment";

export interface AnswerAttachmentsRepository{
  findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>
  deleteManyByAnswerId(answerId: string): Promise<void>
}