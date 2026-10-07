/** Single shared PrismaClient. WHY: each client opens its own connection pool; one instance avoids exhausting DB connections. */
import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();
