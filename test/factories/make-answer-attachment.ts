import { UniqueEntityID } from "@/cors/entities/unique-entity-id";
import { AnswerAttachment, AnswerAttachmentProps } from "@/domain/forum/enterprises/entities/answer-attachment";

export function makeAnswerAttachment(override: Partial<AnswerAttachmentProps> = {}, id?: UniqueEntityID){
  const answerAttachment = AnswerAttachment.create(
    {
      answerId: new UniqueEntityID(),
      attachmentId: new UniqueEntityID(),
      ...override
    }, 
    id
  )
  return answerAttachment
}