import { UniqueEntityID } from '@/cors/entities/unique-entity-id';
import { InMemoryQuestionCommentsRepository } from 'tests/repositories/in-memory-question-comments-repository';
import { FetchQuestionCommentsUseCase } from '../cases/fetch-question-comment';
import { makeQuestionComment } from 'tests/factories/make-question-comment';

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch questions coments', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository()
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to fetch question comments', async () => {
    await inMemoryQuestionCommentsRepository.create(makeQuestionComment({
      questionId: new UniqueEntityID('question-1')
    }))
    await inMemoryQuestionCommentsRepository.create(makeQuestionComment({
      questionId: new UniqueEntityID('question-1')
    }))
    await inMemoryQuestionCommentsRepository.create(makeQuestionComment({
      questionId: new UniqueEntityID('question-1')
    }))

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1
    })

    expect(result.value?.questionComments).toHaveLength(3)
  })

  it('should be able to fetch paginated question coments', async () => {
    for(let i = 1; i <= 22; i++){
      await inMemoryQuestionCommentsRepository.create(makeQuestionComment({
        questionId: new UniqueEntityID('question-1')
      }))
    }
    const result = await sut.execute({
      questionId: 'question-1',
      page: 2
    })

    expect(result.value?.questionComments).toHaveLength(2)
  })
})

