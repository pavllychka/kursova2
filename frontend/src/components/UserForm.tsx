import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { getUser, updateUser } from "@/api";
import { ServerUser } from "@/types";
import { useParams } from "react-router-dom";
import UserData from "@/components/UserData";

export default function UserProfile() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<ServerUser>();
  console.log("user", user);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!userId) return;
    getUser(+userId).then((u) => setUser(u));
  }, [userId]);

  if (!userId) {
    return <div>User not found</div>;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "latitude" || name === "longitude") {
      const names = { latitude: "x", longitude: "y" };
      setUser(
        (prevUser) =>
          ({
            ...prevUser,
            location: {
              ...prevUser?.location,
              [names[name]]: parseFloat(value),
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any)
      );
      return;
    }
    setUser(
      (prevUser) =>
        ({
          ...prevUser,
          [name]: value,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !user) return;
    updateUser(currentUser?.id, user);
    
    console.log("Updated user data:", user);
    setIsEditing(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-4">
      <CardHeader className="flex justify-between items-center flex-row">
        <CardTitle className="text-2xl font-bold">User Profile</CardTitle>
        {!isEditing && user && user?.id === currentUser?.id && (
          <Button type="button" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={user?.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={user?.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  name="position"
                  defaultValue={user?.position}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="skills">Skills</Label>
                <Textarea
                  id="skills"
                  name="skills"
                  defaultValue={user?.skills}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                  <Input
                    id="yearsOfExperience"
                    name="yearsOfExperience"
                    type="number"
                    defaultValue={user?.yearsOfExperience}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    defaultValue={user?.phoneNumber}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="instagramLink">Instagram</Label>
                  <Input
                    id="instagramLink"
                    name="instagramLink"
                    defaultValue={user?.instagramLink}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="linkedinLink">LinkedIn</Label>
                  <Input
                    id="linkedinLink"
                    name="linkedinLink"
                    defaultValue={user?.linkedinLink}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="githubLink">GitHub</Label>
                <Input
                  id="githubLink"
                  name="githubLink"
                  defaultValue={user?.githubLink}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    name="latitude"
                    type="number"
                    step="any"
                    defaultValue={user?.location.x}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    name="longitude"
                    type="number"
                    step="any"
                    defaultValue={user?.location.y}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <Button type="submit">Save</Button>
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <UserData user={user} />
        )}
      </CardContent>
    </Card>
  );
}
