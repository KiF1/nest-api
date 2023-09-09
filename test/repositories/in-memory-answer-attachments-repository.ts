import { PaginationParams } from "@/cors/repositories/pagination-params"
import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository"
import { AnswerAttachment } from "@/domain/forum/enterprises/entities/answer-attachment"

export class InMemoryAnswerAttachmentRepository implements AnswerAttachmentsRepository{
  public items: AnswerAttachment[] = []

  async findManyByAnswerId(answerId: string){
    const answerAttachment = this.items.filter(item => item.answerId.toString() ===  answerId)
    return answerAttachment
  }

  async deleteManyByAnswerId(answerId: string){
    const answerAttachment = this.items.filter(item => item.answerId.toString() !==  answerId)
    this.items = answerAttachment
  }
}