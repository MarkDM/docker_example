import UserForm from './UserForm';
import { getUsers } from './actions';

export default async function Home() {
  const users = await getUsers();

  return <UserForm users={users} />;
}
