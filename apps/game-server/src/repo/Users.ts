import { nanoid } from 'nanoid';
import type { PrismaClient } from '../prisma-client';

interface CreateUserArgs {
  username: string;
}

export class UsersRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getUserById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async createUser({ username }: CreateUserArgs) {
    return this.prisma.user.create({
      data: {
        id: nanoid(),
        username,
      },
    });
  }
}
