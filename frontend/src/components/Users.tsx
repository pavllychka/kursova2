import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { useEffect } from "react";
import { ServerUser } from "@/types";
import { MapPinIcon } from "lucide-react";
import { getUsers } from "@/api";
import { Link } from "react-router-dom";

export default function Users() {
  const [users, setUsers] = useState<ServerUser[]>([]);

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">User List</h1>
      <div className="space-y-4">
        {users.map((user) => (
          <Link to={`/${user.id}`} key={user.id} className="block">
            <Card key={user.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center p-6">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`}
                      alt={user.name}
                    />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-xl font-medium leading-none">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <MapPinIcon className="w-4 h-4" />
                      {user.locationDisplay || `${user.location.x}, ${user.location.y}`}
                    </p>
                    <p className="text-sm text-muted-foreground">{user.position}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
