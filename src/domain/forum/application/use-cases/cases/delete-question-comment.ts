import { Either, left } from "@/cors/either";
import { QuestionCommentsRepository } from "../../repositories/question-comments-repository";
import { NotAllowedError } from "@/cors/errors/not-allowed-error"
import { ResourceNotFoundError } from "@/cors/errors/not-found-error"
import { right } from '../../../../../cors/either';

interface DeleteQuestionCommentUseCaseRequest{
  authorId: string
  questionCommentId: string
}

type DeleteQuestionCommentUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {}>

export class DeleteQuestionCommentUseCase{
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}
  
  async execute({ authorId,questionCommentId }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse>{
    const questionComment = await this.questionCommentsRepository.findById(questionCommentId);
    if(!questionComment){
      return left(new ResourceNotFoundError())
    }
    if(questionComment.authorId.toString() !== authorId){
      return left(new NotAllowedError())
    }

    await this.questionCommentsRepository.delete(questionComment)
    
    return right({})
  }
}