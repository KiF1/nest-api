import { makeAnswer } from "tests/factories/make-answer"
import { InMemoryAnswersRepository } from "tests/repositories/in-memory-answers-repository"
import { OnAnswerCreated } from "../on-answer-created"
import { InMemoryAnswerAttachmentRepository } from "tests/repositories/in-memory-answer-attachments-repository"
import { InMemoryQuestionsRepository } from "tests/repositories/in-memory-questions-repository"
import { InMemoryQuestionAttachmentRepository } from "tests/repositories/in-memory-questions-attachments-repository"
import { SendNotificationUseCase, SendNotificationUseCaseRequest, SendNotificationUseCaseResponse } from "../../use-cases/cases/send-notification"
import { InMemoryNotificationsRepository } from "tests/repositories/in-memory-notifications-repository"
import { makeQuestion } from "tests/factories/make-question"
import { SpyInstance } from "vitest"
import { waitFor } from "tests/utils/wait-for"

let inMemoryQuestionsRespository: InMemoryQuestionsRepository
let inMemoryQuestionsAttachmentsRepository: InMemoryQuestionAttachmentRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase
let sendNotificationExecuteSpy: SpyInstance<[SendNotificationUseCaseRequest], Promise<SendNotificationUseCaseResponse>>

describe('On Answer Created', () => {
  beforeEach(() => {
    inMemoryQuestionsAttachmentsRepository = new InMemoryQuestionAttachmentRepository()
    inMemoryQuestionsRespository = new InMemoryQuestionsRepository(inMemoryQuestionsAttachmentsRepository)
    inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository)
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(inMemoryNotificationsRepository)
    
    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')
    new OnAnswerCreated(inMemoryQuestionsRespository, sendNotificationUseCase)
  })

  it('should  send a notification when an answer is created', async () => {
    const question = makeQuestion();
    const answer = makeAnswer({ questionId: question.id });
    
    inMemoryQuestionsRespository.create(question)
    inMemoryAnswersRepository.create(answer)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})