import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters').max(50),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30)
    .regex(/^[a-z0-9_]+$/, 'Username must be lowercase letters, numbers, and underscores only'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['PLATFORM_SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'USER']).default('USER'),
  organizationId: z.string().uuid().optional(),
});

export const createOrgSchema = z.object({
  name: z.string().min(2, 'Organization name must be at least 2 characters').max(100),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(50)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric and hyphens only'),
});

export const createTeamSchema = z.object({
  name: z.string().min(2, 'Team name must be at least 2 characters').max(60),
  description: z.string().max(250).optional(),
  memberIds: z.array(z.string()).default([]),
});

export const sendMessageSchema = z.object({
  conversationId: z.string().min(1, 'Conversation ID is required'),
  message: z.string().min(1, 'Message cannot be empty').max(2000, 'Message cannot exceed 2000 characters'),
});

export const createDirectConversationSchema = z.object({
  teamId: z.string().min(1, 'Team ID is required'),
  targetUserId: z.string().min(1, 'Target user ID is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateOrgInput = z.infer<typeof createOrgSchema>;
export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type CreateDirectConversationInput = z.infer<typeof createDirectConversationSchema>;
