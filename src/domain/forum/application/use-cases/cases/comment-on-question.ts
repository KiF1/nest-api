import { QuestionsRepository } from "../../repositories/question-repository";
import { UniqueEntityID } from "@/cors/entities/unique-entity-id";
import { QuestionComment } from "@/domain/forum/enterprises/entities/question-comment";
import { QuestionCommentsRepository } from "../../repositories/question-comments-repository";
import { Either, left, right } from "@/cors/either";
import { ResourceNotFoundError } from "@/cors/errors/not-found-error";


interface CommentOnQuestionUseCaseRequest{
  authorId: string
  questionId: string
  content: string
}

type CommentOnQuestionUseCaseResponse = Either<ResourceNotFoundError, { questionComment: QuestionComment }>

export class CommentOnQuestionUseCase{
  constructor(private questionRepository: QuestionsRepository, private questionCommentsRepository: QuestionCommentsRepository) {}
  
  async execute({ authorId, questionId, content }: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse>{
    const question = await this.questionRepository.findById(questionId);
    if(!question){
      return left(new ResourceNotFoundError())
    }
    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityID(authorId),
      questionId: new UniqueEntityID(questionId),
      content
    })

    await this.questionCommentsRepository.create(questionComment)
    
    return right({ questionComment })
  }
}