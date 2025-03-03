import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma/index.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.task.create({
      data,
      include: {
        created_by: {
          omit: {
            password: true,
          },
        },
      },
    });
  }

  async get(authHeader: string) {
    if (!authHeader) {
      throw new Error('Token não encontrado');
    }
  
    const token = authHeader.replace('Bearer ', '');
    const jwtService = new JwtService();
    const decoded = jwtService.decode(token) as { userId: number };
  
    if (!decoded?.userId) {
      throw new Error('Token inválido');
    }
  
    return this.prisma.task.findMany({
      where: {
        solved: false,
        createdBy: decoded.userId,
      },
      include: {
        created_by: {
          omit: {
            password: true,
          },
        },
      },
    });
  }

  async update(id: number, data: any) {
    return this.prisma.task.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
      include: {
        created_by: {
          omit: {
            password: true,
          },
        },
      },
    });
  }

  async findById(id: number) {
    return this.prisma.task.findUnique({
      where: {
        id,
      },
      include: {
        created_by: {
          omit: {
            password: true,
          },
        },
      },
    });
  }
}
