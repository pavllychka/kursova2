import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"
import { Briefcase, MapPin, Code, Clock, Phone, Instagram, Linkedin, Github } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { ServerUser } from "@/types"
import { Badge } from "./ui/badge"

type UserDataProps = {
  user?: ServerUser
}

export default function UserData({ user }: UserDataProps) {
  if (!user) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">User data not available.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`} alt={user.name} />
            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{user.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <Badge className="mt-2" variant={user.role === "project_creator" ? "default" : "secondary"}>
              {user.role === "project_creator" ? "Project Creator" : "User"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        {user.position && (
          <div className="flex items-center space-x-2">
            <Briefcase className="w-4 h-4 text-muted-foreground" />
            <span>{user.position}</span>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span>Location: ({user.locationDisplay || `${user.location.x}, ${user.location.y}`})</span>
        </div>
        {user.skills && (
          <div className="flex items-center space-x-2">
            <Code className="w-4 h-4 text-muted-foreground" />
            <span>{user.skills}</span>
          </div>
        )}
        {user.yearsOfExperience !== undefined && (
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>{user.yearsOfExperience || 0} years of experience</span>
          </div>
        )}
        {user.phoneNumber && (
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span>{user.phoneNumber}</span>
          </div>
        )}
        <div className="flex space-x-4 mt-4">
          {user.instagramLink && (
            <a href={user.instagramLink} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground" aria-label="Instagram">
              <Instagram className="w-5 h-5" />
            </a>
          )}
          {user.linkedinLink && (
            <a href={user.linkedinLink} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground" aria-label="LinkedIn">
              <Linkedin className="w-5 h-5" />
            </a>
          )}
          {user.githubLink && (
            <a href={user.githubLink} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground" aria-label="GitHub">
              <Github className="w-5 h-5" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  )
}