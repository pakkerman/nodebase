import z from "zod";

import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { CredentialType } from "@/generated/prisma";
import prisma from "@/lib/db";
import { PAGINATION } from "@/config/constants";

export const credentialRouter = createTRPCRouter({
  create: premiumProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        type: z.enum(CredentialType),
        value: z.string().min(1, "Value is required"),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { name, value, type } = input;
      const userId = ctx.auth.user.id;

      return prisma.credential.create({
        data: {
          name,
          userId,
          type,
          value, // TODO: Consider encrypting in prod.
        },
      });
    }),

  remove: protectedProcedure

    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      const { id } = input;
      const userId = ctx.auth.user.id;
      return prisma.credential.delete({
        where: {
          id,
          userId,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1, "Name is required"),
        type: z.enum(CredentialType),
        value: z.string().min(1, "Value is required"),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { id, name, type, value } = input;
      const userId = ctx.auth.user.id;

      return prisma.credential.update({
        where: {
          id,
          userId,
        },
        data: {
          name,
          type,
          value, // TODO: consider encrypting
        },
      });
    }),

  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const userId = ctx.auth.user.id;

      return await prisma.credential.findUniqueOrThrow({
        where: { id, userId },
      });
    }),

  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
        search: z.string().default(""),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input;
      const userId = ctx.auth.user.id;

      const [items, totalCount] = await Promise.all([
        prisma.credential.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            userId,
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
        }),
        prisma.credential.count({
          where: {
            userId,
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        }),
      ]);
      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;
      return {
        items,
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      };
    }),

  getByType: protectedProcedure
    .input(
      z.object({
        type: z.enum(CredentialType),
      }),
    )
    .query(({ input, ctx }) => {
      const { type } = input;
      const userId = ctx.auth.user.id;

      return prisma.credential.findMany({
        where: { type, userId },
        orderBy: {
          updatedAt: "desc",
        },
      });
    }),
});
