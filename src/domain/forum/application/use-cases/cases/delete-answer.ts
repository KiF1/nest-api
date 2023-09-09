import { Either, left, right } from "@/cors/either";
import { AnswersRepository } from "../../repositories/answers-repository";
import { NotAllowedError } from "@/cors/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/cors/errors/not-found-error";


interface DeleteAnswerUseCaseRequest{
  authorId: string
  answerId: string
}

type DeleteAnswerUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {}>

export class DeleteAnswerUseCase{
  constructor(private answerRepository: AnswersRepository) {}
  
  async execute({ authorId, answerId }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse>{
    const answer = await this.answerRepository.findById(answerId);
    if(!answer){
      return left(new ResourceNotFoundError())
    }
    if(authorId !== answer.authorId.toString()){
      return left(new NotAllowedError())
    }

    await this.answerRepository.delete(answer);
    return right({})
  }
}