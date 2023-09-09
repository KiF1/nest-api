import { Question } from "@/domain/forum/enterprises/entities/question";
import { QuestionsRepository } from "../../repositories/question-repository";
import { Either, right } from "@/cors/either";

interface FetchRecentQuestionsUseCaseRequest{
  page: number
}

type FetchRecentQuestionsUseCaseResponse = Either<null, { questions: Question[] }> 

export class FetchRecentQuestionsUseCase{
  constructor(private questionRepository: QuestionsRepository) {}
  
  async execute({ page }: FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse>{
    const questions = await this.questionRepository.findManyRecent({ page })
    return right({ questions })
  }
}