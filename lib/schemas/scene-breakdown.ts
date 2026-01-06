import { z } from 'zod';

/**
 * Schema for validating scene breakdown generation requests
 */
export const generateSceneBreakdownSchema = z.object({
  ideaId: z.number().int().positive('Idea ID must be a positive integer'),
  script: z.string()
    .min(50, 'Script must be at least 50 characters')
    .max(5000, 'Script must not exceed 5000 characters'),
  language: z.enum(['english', 'indonesian', 'spanish']).default('english'),
});

export type GenerateSceneBreakdownInput = z.infer<typeof generateSceneBreakdownSchema>;

/**
 * Schema for validating scene breakdown update requests
 */
export const updateSceneBreakdownSchema = z.object({
  ideaId: z.number().int().positive('Idea ID must be a positive integer'),
  content: z.string()
    .max(65535, 'Content must not exceed 65,535 bytes'),
});

export type UpdateSceneBreakdownInput = z.infer<typeof updateSceneBreakdownSchema>;

/**
 * Schema for validating scene breakdown history queries
 */
export const getSceneBreakdownHistorySchema = z.object({
  ideaId: z.number().int().positive('Idea ID must be a positive integer'),
  limit: z.number().int().positive().max(100).default(50).optional(),
  offset: z.number().int().nonnegative().default(0).optional(),
});

export type GetSceneBreakdownHistoryInput = z.infer<typeof getSceneBreakdownHistorySchema>;

/**
 * Schema for validating scene breakdown restore requests
 */
export const restoreSceneBreakdownSchema = z.object({
  ideaId: z.number().int().positive('Idea ID must be a positive integer'),
  version: z.number().int().positive('Version must be a positive integer'),
});

export type RestoreSceneBreakdownInput = z.infer<typeof restoreSceneBreakdownSchema>;
