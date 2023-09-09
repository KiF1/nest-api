import { QuestionComment } from "@/domain/forum/enterprises/entities/question-comment";
import { QuestionCommentsRepository } from "../../repositories/question-comments-repository";
import { Either, right } from "@/cors/either";

interface FetchQuestionCommentsUseCaseRequest{
  questionId: string
  page: number
}

type FetchQuestionCommentsUseCaseResponse = Either<null, { questionComments: QuestionComment[]}>

export class FetchQuestionCommentsUseCase{
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}
  
  async execute({ questionId, page }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse>{
    const questionComments = await this.questionCommentsRepository.findManyByQuestionId(questionId, { page })
    return right({ questionComments })
  }
}