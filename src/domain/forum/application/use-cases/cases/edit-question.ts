import { Question } from "@/domain/forum/enterprises/entities/question";
import { QuestionsRepository } from "../../repositories/question-repository";
import { Either, left, right } from "@/cors/either";
import { NotAllowedError } from "@/cors/errors/not-allowed-error"
import { ResourceNotFoundError } from "@/cors/errors/not-found-error"
import { QuestionAttachmentsRepository } from "../../repositories/question-attachments-repository";
import { QuestionAttachmentList } from "@/domain/forum/enterprises/entities/question-attachment-list";
import { UniqueEntityID } from "@/cors/entities/unique-entity-id";
import { QuestionAttachment } from "@/domain/forum/enterprises/entities/question-attachment";

interface EditQuestionUseCaseRequest{
  authorId: string
  questionId: string
  title: string
  content: string
  attachmentsIds: string[]
}

type EditQuestionUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, { question: Question }>

export class EditQuestionUseCase{
  constructor(private questionRepository: QuestionsRepository, private questionAttachmentsRepository: QuestionAttachmentsRepository) {}
  
  async execute({ authorId, questionId, content, title, attachmentsIds }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse>{
    const question = await this.questionRepository.findById(questionId);
    if(!question){
      return left(new ResourceNotFoundError())
    }
    if(authorId !== question.authorId.toString()){
      return left(new NotAllowedError())
    }

    const currentQuestionAttachments = await this.questionAttachmentsRepository.findManyByQuestionId(questionId)
    const questionAttachmentList = new QuestionAttachmentList(currentQuestionAttachments)
    const questionAttachments = attachmentsIds.map(attachmentId => {
      return QuestionAttachment.create({ attachmentId: new UniqueEntityID(attachmentId), questionId: question.id })
    }) 

    questionAttachmentList.update(questionAttachments)
    question.attachments = questionAttachmentList
    question.title = title
    question.content = content

    await this.questionRepository.save(question);
    return right({ question })
  }
}