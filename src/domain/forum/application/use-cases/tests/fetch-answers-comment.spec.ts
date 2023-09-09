import { UniqueEntityID } from '@/cors/entities/unique-entity-id';
import { InMemoryAnswerCommentsRepository } from 'tests/repositories/in-memory-answer-comments-repository';
import { makeAnswerComment } from 'tests/factories/make-answer-comment';
import { FetchAnswerCommentsUseCase } from '../cases/fetch-answer-comments';

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch answers coments', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to fetch answer comments', async () => {
    await inMemoryAnswerCommentsRepository.create(makeAnswerComment({
      answerId: new UniqueEntityID('answer-1')
    }))
    await inMemoryAnswerCommentsRepository.create(makeAnswerComment({
      answerId: new UniqueEntityID('answer-1')
    }))
    await inMemoryAnswerCommentsRepository.create(makeAnswerComment({
      answerId: new UniqueEntityID('answer-1')
    }))

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 1
    })

    expect(result.value?.answerComments).toHaveLength(3)
  })

  it('should be able to fetch paginated answer coments', async () => {
    for(let i = 1; i <= 22; i++){
      await inMemoryAnswerCommentsRepository.create(makeAnswerComment({
        answerId: new UniqueEntityID('answer-1')
      }))
    }
    const result = await sut.execute({
      answerId: 'answer-1',
      page: 2
    })

    expect(result.value?.answerComments).toHaveLength(2)
  })
})

