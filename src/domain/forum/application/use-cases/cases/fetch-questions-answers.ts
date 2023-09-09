import { Answer } from "@/domain/forum/enterprises/entities/answer";
import { AnswersRepository } from "../../repositories/answers-repository";
import { Either, right } from "@/cors/either";

interface FetchQuestionsAnswersUseCaseRequest{
  questionId: string
  page: number
}

type FetchQuestionsAnswersUseCaseResponse = Either<null, { answers: Answer[] }>

export class FetchQuestionsAnswersUseCase{
  constructor(private answersRepository: AnswersRepository) {}
  
  async execute({ questionId, page }: FetchQuestionsAnswersUseCaseRequest): Promise<FetchQuestionsAnswersUseCaseResponse>{
    const answers = await this.answersRepository.findManyByQuestionId(questionId, { page })
    return right({ answers })
  }
}