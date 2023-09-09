import { UniqueEntityID } from "@/cors/entities/unique-entity-id"
import { Answer } from "@/domain/forum/enterprises/entities/answer"
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository"
import { Either, right } from "@/cors/either"
import { AnswerAttachment } from "@/domain/forum/enterprises/entities/answer-attachment"
import { AnswerAttachmentList } from "@/domain/forum/enterprises/entities/answer-attachment-list"

interface AnswerQuestionUseCaseRequest{
  instructorId: string
  questionId: string
  attachmentIds:  string[]
  content: string
}

type AnswerQuestionUseCaseResponse = Either<null, { answer: Answer }>

export class AnswerQuestionUseCase{
  constructor(private answerRepository: AnswersRepository) {}
  
  async execute({ instructorId, questionId, content, attachmentIds }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse>{
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityID(instructorId),
      questionId: new UniqueEntityID(questionId),
    })

    const answerAttachments = attachmentIds.map(attachmentId => {
      return AnswerAttachment.create({ attachmentId: new UniqueEntityID(attachmentId), answerId: answer.id })
    }) 

    answer.attachments = new AnswerAttachmentList(answerAttachments)

    await this.answerRepository.create(answer);
    return right({ answer })
  }
}