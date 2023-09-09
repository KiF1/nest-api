import { InMemoryAnswerCommentsRepository } from 'tests/repositories/in-memory-answer-comments-repository';
import { DeleteAnswerCommentUseCase } from '../cases/delete-answer-comment';
import { makeAnswerComment } from 'tests/factories/make-answer-comment';
import { UniqueEntityID } from '@/cors/entities/unique-entity-id';
import { NotAllowedError } from '@/cors/errors/not-allowed-error';

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete Answer Comment', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to delete a answer comment', async () => {
    const answerComment = makeAnswerComment();

    await inMemoryAnswerCommentsRepository.create(answerComment);

    await sut.execute({ 
      authorId: answerComment.authorId.toString(),
      answerCommentId: answerComment.id.toString(), 
    })

    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0)
  })

  it('should be able to delete another user answer comment', async () => {
    const answerComment = makeAnswerComment({
      authorId: new UniqueEntityID('author-1')
    });

    await inMemoryAnswerCommentsRepository.create(answerComment);

    const result = await sut.execute({ 
      authorId: 'author-2',
      answerCommentId: answerComment.id.toString(), 
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
 
