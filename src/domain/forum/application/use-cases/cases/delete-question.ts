import { Either, left, right } from "@/cors/either";
import { QuestionsRepository } from "../../repositories/question-repository";
import { NotAllowedError } from "@/cors/errors/not-allowed-error"
import { ResourceNotFoundError } from "@/cors/errors/not-found-error"

interface DeleteQuestionUseCaseRequest{
  authorId: string
  questionId: string
}

type DeleteQuestionUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {}>

export class DeleteQuestionUseCase{
  constructor(private questionRepository: QuestionsRepository) {}
  
  async execute({ authorId, questionId }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse>{
    const question = await this.questionRepository.findById(questionId);
    if(!question){
      return left(new ResourceNotFoundError())
    }
    if(authorId !== question.authorId.toString()){
      return left(new NotAllowedError())
    }

    await this.questionRepository.delete(question);
    return right({})
  }
}