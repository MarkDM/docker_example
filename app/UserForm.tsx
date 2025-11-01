'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { createUser, updateUser, deleteUser } from './actions';
import type { User } from '@/lib/schemas';

type UserFormProps = {
  users: User[];
};

type Notification = {
  message: string;
  type: 'success' | 'error';
};

export default function UserForm({ users }: UserFormProps) {
  const [createState, createAction, createPending] = useActionState(createUser, null);
  const [updateState, updateAction, updatePending] = useActionState(updateUser, null);
  const createFormRef = useRef<HTMLFormElement>(null);
  const updateFormRef = useRef<HTMLFormElement>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Unified notification handler
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    const timer = setTimeout(() => setNotification(null), 3000);
    return () => clearTimeout(timer);
  };

  useEffect(() => {
    if (createState?.success) {
      createFormRef.current?.reset();
    }
  }, [createState]);

  useEffect(() => {
    if (updateState?.message) {
      showNotification(updateState.message, updateState.success ? 'success' : 'error');
      if (updateState.success) {
        updateFormRef.current?.reset();
        setEditingUser(null);
      }
    }
  }, [updateState]);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      const result = await deleteUser(id);
      showNotification(result.message, result.success ? 'success' : 'error');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    updateFormRef.current?.reset();
  };

  // Reusable form input component
  const FormInput = ({ 
    id, 
    name, 
    label, 
    type = 'text', 
    defaultValue, 
    required = true 
  }: { 
    id: string; 
    name: string; 
    label: string; 
    type?: string; 
    defaultValue?: string; 
    required?: boolean;
  }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        defaultValue={defaultValue}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
        required={required}
      />
    </div>
  );

  const notificationClasses = notification?.type === 'success' 
    ? 'bg-green-50 text-green-800 border border-green-200' 
    : 'bg-red-50 text-red-800 border border-red-200';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Global Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${notificationClasses}`}>
            <div className="flex items-center">
              <span>{notification.message}</span>
              <button
                onClick={() => setNotification(null)}
                className="ml-4 text-sm font-medium hover:opacity-70"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Simple CRUD application with Next.js and PostgreSQL</p>
        </div>

        {/* Create/Edit Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {editingUser ? 'Edit User' : 'Create New User'}
          </h2>
          
          {editingUser ? (
            <form ref={updateFormRef} action={updateAction} className="space-y-4">
              <input type="hidden" name="id" value={editingUser.id} />
              
              <FormInput
                id="update-name"
                name="name"
                label="Name"
                defaultValue={editingUser.name}
              />

              <FormInput
                id="update-email"
                name="email"
                label="Email"
                type="email"
                defaultValue={editingUser.email}
              />

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={updatePending}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                >
                  {updatePending ? 'Updating...' : 'Update User'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 border bg-red-500 border-gray-300 rounded-md text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <form ref={createFormRef} action={createAction} className="space-y-4">
              <FormInput
                id="name"
                name="name"
                label="Name"
              />

              <FormInput
                id="email"
                name="email"
                label="Email"
                type="email"
              />

              <button
                type="submit"
                disabled={createPending}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
              >
                {createPending ? 'Creating...' : 'Create User'}
              </button>
            </form>
          )}
        </div>

        {/* Users List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Users List</h2>
          
          {users.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No users found. Create one above!</p>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Created: {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="px-4 py-2 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
