import { Question } from "@/domain/forum/enterprises/entities/question";
import { QuestionsRepository } from "../../repositories/question-repository";
import { Either, right } from "@/cors/either";
import { ResourceNotFoundError } from "@/cors/errors/not-found-error";


interface GetQuestionBySlugUseCaseRequest{
  slug: string
}

type GetQuestionBySlugUseCaseResponse = Either<ResourceNotFoundError, { question: Question }>

export class GetQuestionBySlugUseCase{
  constructor(private questionRepository: QuestionsRepository) {}
  
  async execute({ slug }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse>{
    const question = await this.questionRepository.findBySlug(slug)
    if(!question){
      throw new Error('Question not found')
    }

    return right({ question })
  }
}