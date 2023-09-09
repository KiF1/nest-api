import { InMemoryAnswersRepository } from 'tests/repositories/in-memory-answers-repository';
import { makeAnswer } from 'tests/factories/make-answer';
import { InMemoryAnswerCommentsRepository } from 'tests/repositories/in-memory-answer-comments-repository';
import { CommentOnAnswerUseCase } from '../cases/comment-on-answer';
import { InMemoryAnswerAttachmentRepository } from 'tests/repositories/in-memory-answer-attachments-repository';

let inMemoryAnswersAttachmentRepository: InMemoryAnswerAttachmentRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: CommentOnAnswerUseCase

describe('Comment on Answer', () => {
  beforeEach(() => {
    inMemoryAnswersAttachmentRepository = new InMemoryAnswerAttachmentRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswersAttachmentRepository)
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new CommentOnAnswerUseCase(inMemoryAnswersRepository, inMemoryAnswerCommentsRepository)
  })

  it('should be able to comment on answer', async () => {
    const answer = makeAnswer()
    
    await inMemoryAnswersRepository.create(answer);

    await sut.execute({ 
      answerId: answer.id.toString(), 
      authorId: answer.authorId.toString(),
      content: 'Comentário test'
    })

    expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual('Comentário test')
  })
})
 
