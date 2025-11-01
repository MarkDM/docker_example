import UserForm from './UserForm';
import { getUsers } from './actions';

export default async function Home() {
  try {
    const users = await getUsers();
    return <UserForm users={users} />;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return <div>Error loading users</div>;
  }
}
