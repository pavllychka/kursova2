import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

export default function UserMenu() {
  const { user, logout } = useAuth();

  return (
    <div className="absolute top-4 right-4 flex items-center space-x-4 mb-2">
      {user && (
        <>
          <Link to={`/${user.id}`} className="text-lg font-medium">
            <span className="text-lg font-medium">{`${user.name} (${user.email})`}</span>
          </Link>
          <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            Logout
          </button>
        </>
      )}
    </div>
  );
}
