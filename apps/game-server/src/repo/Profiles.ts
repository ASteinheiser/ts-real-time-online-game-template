import type { PrismaClient, Profile } from '../prisma-client';

export class ProfilesRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getProfileByUserId(userId: string) {
    return this.prisma.profile.findUnique({
      where: { userId },
    });
  }

  async getProfileByUserName(userName: string) {
    return this.prisma.profile.findUnique({
      where: { userName },
    });
  }

  async createProfile({ userId, userName }: Profile) {
    return this.prisma.profile.create({
      data: {
        userId,
        userName,
      },
    });
  }
}
