import { PrismaClient, Prisma } from '@prisma/client';

export const prisma = new PrismaClient();
export const Decimal = Prisma.Decimal;
