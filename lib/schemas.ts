import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  email: z.string().email('Invalid email address').max(255, 'Email is too long'),
});

export const userUpdateSchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  email: z.string().email('Invalid email address').max(255, 'Email is too long'),
});

export type User = {
  id: number;
  name: string;
  email: string;
  created_at: Date;
  updated_at: Date;
};

export type UserInput = z.infer<typeof userSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;
