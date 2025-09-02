import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
      include: {
        company: true,
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async findAll(companyId: string) {
    return this.prisma.user.findMany({
      where: {
        companyId,
        deletedAt: null,
      },
      include: {
        company: true,
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        company: true,
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        company: true,
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findById(id); // Check if user exists

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      include: {
        company: true,
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findById(id); // Check if user exists

    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async assignRole(userId: string, roleId: string) {
    return this.prisma.userRole.create({
      data: {
        userId,
        roleId,
      },
    });
  }

  async removeRole(userId: string, roleId: string) {
    return this.prisma.userRole.delete({
      where: {
        userId_roleId: {
          userId,
          roleId,
        },
      },
    });
  }
}

