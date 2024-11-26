import { Outlet } from 'react-router-dom';
import UserMenu from './UserMenu';
import NavMenu from './NavManu';

export default function MainPage() {
  return (
    <div className="container mx-auto py-8">
      <NavMenu />
      <UserMenu />
      <Outlet />
    </div>
  );
}