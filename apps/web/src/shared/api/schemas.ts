import { z } from 'zod';

export const loginRequestSchema = z.object({
  accountId: z.string().trim().min(1),
  username: z.string().trim().min(1),
  password: z.string().min(1),
});

export const userSchema = z.object({
  id: z.string().min(1),
  username: z.string().min(1),
  displayName: z.string().min(1),
});

export const loginResponseSchema = z.object({
  accessToken: z.string().min(1),
  user: userSchema,
});

export const refreshResponseSchema = z.object({ accessToken: z.string().min(1) });
export const logoutResponseSchema = z.object({ success: z.boolean() });

export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type User = z.infer<typeof userSchema>;
