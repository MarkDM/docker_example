'use server';

import { revalidatePath } from 'next/cache';
import { query } from '@/lib/db';
import { userSchema, userUpdateSchema, type User } from '@/lib/schemas';

export async function getUsers(): Promise<User[]> {
  try {
    const result = await query('SELECT * FROM users ORDER BY created_at DESC');
    return result.rows;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw new Error('Failed to fetch users');
  }
}

export async function createUser(prevState: any, formData: FormData) {
  try {
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
    };

    const validatedData = userSchema.parse(data);

    await query(
      'INSERT INTO users (name, email) VALUES ($1, $2)',
      [validatedData.name, validatedData.email]
    );

    revalidatePath('/');
    return { success: true, message: 'User created successfully' };
  } catch (error: any) {
    if (error.code === '23505') {
      return { success: false, message: 'Email already exists' };
    }
    if (error.name === 'ZodError') {
      return { success: false, message: error.errors[0].message };
    }
    console.error('Failed to create user:', error);
    return { success: false, message: 'Failed to create user' };
  }
}

export async function updateUser(prevState: any, formData: FormData) {
  try {
    const data = {
      id: Number(formData.get('id')),
      name: formData.get('name'),
      email: formData.get('email'),
    };

    const validatedData = userUpdateSchema.parse(data);

    await query(
      'UPDATE users SET name = $1, email = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      [validatedData.name, validatedData.email, validatedData.id]
    );

    revalidatePath('/');
    return { success: true, message: 'User updated successfully' };
  } catch (error: any) {
    if (error.code === '23505') {
      return { success: false, message: 'Email already exists' };
    }
    if (error.name === 'ZodError') {
      return { success: false, message: error.errors[0].message };
    }
    console.error('Failed to update user:', error);
    return { success: false, message: 'Failed to update user' };
  }
}

export async function deleteUser(id: number) {
  try {
    await query('DELETE FROM users WHERE id = $1', [id]);
    revalidatePath('/');
    return { success: true, message: 'User deleted successfully' };
  } catch (error) {
    console.error('Failed to delete user:', error);
    return { success: false, message: 'Failed to delete user' };
  }
}
