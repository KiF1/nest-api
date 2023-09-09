import { PaginationParams } from '@/cors/repositories/pagination-params';
import { Answer } from './../../enterprises/entities/answer';

export interface AnswersRepository{
  create(answer: Answer): Promise<void>
  save(answer: Answer): Promise<void>
  findById(id: string): Promise<Answer | null>
  delete(answer: Answer): Promise<void>
  findManyByQuestionId(questionId: string, params: PaginationParams): Promise<Answer[]>
}