import { InMemoryAnswersRepository } from 'tests/repositories/in-memory-answers-repository';
import { makeAnswer } from 'tests/factories/make-answer';
import { UniqueEntityID } from '@/cors/entities/unique-entity-id';
import { InMemoryQuestionsRepository } from 'tests/repositories/in-memory-questions-repository';
import { ChooseQuestionBestAnswerUseCase } from '../cases/choose-question-best-answer';
import { makeQuestion } from 'tests/factories/make-question';
import { InMemoryAnswerAttachmentRepository } from 'tests/repositories/in-memory-answer-attachments-repository';
import { InMemoryQuestionAttachmentRepository } from 'tests/repositories/in-memory-questions-attachments-repository';
import { NotAllowedError } from '@/cors/errors/not-allowed-error';

let inMemoryAnswersAttachmentRepository: InMemoryAnswerAttachmentRepository
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: ChooseQuestionBestAnswerUseCase

describe('Choose Question best Answer', () => {
  beforeEach(() => {
    inMemoryAnswersAttachmentRepository = new InMemoryAnswerAttachmentRepository()
    inMemoryQuestionAttachmentRepository = new InMemoryQuestionAttachmentRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswersAttachmentRepository)
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentRepository)
    sut = new ChooseQuestionBestAnswerUseCase(inMemoryQuestionsRepository, inMemoryAnswersRepository)
  })

  it('should be able to choose the question best answer', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({
      questionId: question.id
    })
    
    await inMemoryQuestionsRepository.create(question);
    await inMemoryAnswersRepository.create(answer);

    await sut.execute({ 
      answerId: answer.id.toString(), 
      authorId: question.authorId.toString()
    })
    expect(inMemoryQuestionsRepository.items[0].bestAnswerId).toEqual(answer.id)
  })
  it('should be not able to choose another user question best answer', async () => {
    const question = makeQuestion({
      authorId: new UniqueEntityID('author-1')
    })
    const answer = makeAnswer({
      questionId: question.id
    })
    
    await inMemoryQuestionsRepository.create(question);
    await inMemoryAnswersRepository.create(answer);

    const result = await sut.execute({ 
      authorId: 'author-2',
      answerId: answer.id.toString() 
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})

