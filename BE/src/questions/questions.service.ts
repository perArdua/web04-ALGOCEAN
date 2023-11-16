import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ReadQuestionDto } from './dto/read-question.dto';
import { ReadQuestionListDto } from './dto/read-question-list.dto';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async readOneQuestion(id: number): Promise<ReadQuestionDto> {
    const question = await this.prisma.question.findUnique({
      where: {
        Id: id,
      },
      include: {
        User: {
          select: {
            Nickname: true,
            LikeInfo: {
              where: {
                LikedEntityId: id,
              },
            },
          },
        },
      },
    });

    return {
      id: question.Id,
      title: question.Title,
      nickname: question.User.Nickname,
      tag: question.Tag,
      createdAt: question.CreatedAt,
      programmingLanguage: question.ProgrammingLanguage,
      isAdopted: question.IsAdopted,
      viewCount: question.ViewCount,
      likeCount: question.LikeCount,
      isLiked: question.User.LikeInfo[0]?.IsLiked || false,
    };
  }

  async readQuestionList(page: number): Promise<ReadQuestionListDto[]> {
    const pageSize = 10; // 한 페이지당 질문 개수는 10개
    const skip = (page - 1) * pageSize;

    const questions = await this.prisma.question.findMany({
      skip,
      take: pageSize,
      include: {
        User: {
          select: {
            Nickname: true,
          },
        },
      },
    });

    return questions.map((question) => ({
      id: question.Id,
      title: question.Title,
      nickname: question.User.Nickname,
      tag: question.Tag,
      createdAt: question.CreatedAt,
      programmingLanguage: question.ProgrammingLanguage,
      isAdopted: question.IsAdopted,
      viewCount: question.ViewCount,
      likeCount: question.LikeCount,
    }));
  }
}
