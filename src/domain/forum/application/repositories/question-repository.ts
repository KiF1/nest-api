import { PaginationParams } from "@/cors/repositories/pagination-params";
import { Question } from "../../enterprises/entities/question";

export abstract class QuestionsRepository {
  abstract findById(id: string): Promise<Question | null>;
  abstract delete(question: Question): Promise<void>;
  abstract save(question: Question): Promise<void>;
  abstract create(question: Question): Promise<void>;
  abstract findBySlug(slug: string): Promise<Question | null>;
  abstract findManyRecent(params: PaginationParams): Promise<Question[]>;
}
