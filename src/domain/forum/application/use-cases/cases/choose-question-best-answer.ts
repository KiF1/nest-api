import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository"
import { Question } from "@/domain/forum/enterprises/entities/question"
import { QuestionsRepository } from "../../repositories/question-repository"
import { Either, left, right } from "@/cors/either"
import { NotAllowedError } from "@/cors/errors/not-allowed-error"
import { ResourceNotFoundError } from "@/cors/errors/not-found-error"

interface ChooseQuestionBestAnswerUseCaseRequest{
  answerId: string
  authorId: string
}

type ChooseQuestionBestAnswerUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, { question: Question }>

export class ChooseQuestionBestAnswerUseCase{
  constructor(private questionsRepository: QuestionsRepository, private answerRepository: AnswersRepository) {}
  
  async execute({ answerId, authorId }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse>{
    const answer = await this.answerRepository.findById(answerId);
    if(!answer){
      return left(new ResourceNotFoundError())
    }

    const question = await this.questionsRepository.findById(answer.questionId.toString());
    if(!question){
      return left(new ResourceNotFoundError())
    }
    if(authorId !== question.authorId.toString()){
      return left(new NotAllowedError())
    }

    question.bestAnswerId = answer.id
    await this.questionsRepository.save(question)

    return right({ question })
  }
}