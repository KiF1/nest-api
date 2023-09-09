import { InMemoryQuestionsRepository } from 'tests/repositories/in-memory-questions-repository';
import { makeQuestion } from 'tests/factories/make-question';
import { FetchRecentQuestionsUseCase } from '../cases/fetch-recent-questions';
import { InMemoryQuestionAttachmentRepository } from 'tests/repositories/in-memory-questions-attachments-repository';

let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: FetchRecentQuestionsUseCase

describe('Fetch recent questions', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository = new InMemoryQuestionAttachmentRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentRepository)
    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to fetch recent questions', async () => {
    await inMemoryQuestionsRepository.create(makeQuestion({ createdAt: new Date(2023, 0, 20) }))
    await inMemoryQuestionsRepository.create(makeQuestion({ createdAt: new Date(2023, 0, 18) }))
    await inMemoryQuestionsRepository.create(makeQuestion({ createdAt: new Date(2023, 0, 23) }))
    const result = await sut.execute({
      page: 1
    })

    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2023, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2023, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2023, 0, 18) })
    ])
  })

  it('should be able to fetch paginated recent questions', async () => {
    for(let i = 1; i <= 22; i++){
      await inMemoryQuestionsRepository.create(makeQuestion())
    }
    const result = await sut.execute({
      page: 2
    })

    expect(result.value?.questions).toHaveLength(2)
  })
})

