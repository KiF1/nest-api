import { Answer } from "@/domain/forum/enterprises/entities/answer";
import { AnswersRepository } from "../../repositories/answers-repository";
import { Either, left, right } from "@/cors/either";
import { NotAllowedError } from "@/cors/errors/not-allowed-error"
import { ResourceNotFoundError } from "@/cors/errors/not-found-error"
import { UniqueEntityID } from "@/cors/entities/unique-entity-id";
import { AnswerAttachment } from "@/domain/forum/enterprises/entities/answer-attachment";
import { AnswerAttachmentList } from "@/domain/forum/enterprises/entities/answer-attachment-list";
import { AnswerAttachmentsRepository } from "../../repositories/answer-attachments-repository";

interface EditAnswerUseCaseRequest{
  authorId: string
  answerId: string
  content: string
  attachmentsIds: string[]
}


type EditAnswerUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, { answer: Answer }> 

export class EditAnswerUseCase{
  constructor(private answerRepository: AnswersRepository, private answerAttachmentsRepository: AnswerAttachmentsRepository) {}
  
  async execute({ authorId, answerId, content, attachmentsIds }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse>{
    const answer = await this.answerRepository.findById(answerId);
    if(!answer){
      return left(new ResourceNotFoundError())
    }
    if(authorId !== answer.authorId.toString()){
      return left(new NotAllowedError())
    }

    const currentAnswerAttachments = await this.answerAttachmentsRepository.findManyByAnswerId(answerId)
    const answerAttachmentList = new AnswerAttachmentList(currentAnswerAttachments)
    const answerAttachments = attachmentsIds.map(attachmentId => {
      return AnswerAttachment.create({ attachmentId: new UniqueEntityID(attachmentId), answerId: answer.id })
    }) 

    answerAttachmentList.update(answerAttachments)
    answer.attachments = answerAttachmentList
    answer.content = content

    await this.answerRepository.save(answer);
    return right({ answer })
  }
}