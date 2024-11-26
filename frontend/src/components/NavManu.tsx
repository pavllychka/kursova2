import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { MapIcon, Users, FolderKanban } from 'lucide-react'
import { Link, useLocation } from "react-router-dom"

const menuItems = [
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Map', href: '/map', icon: MapIcon },
]

export default function NavMenu() {
  const pathname = useLocation()

  return (
    <nav className="flex justify-center space-x-4 py-4 bg-background shadow-sm">
      {menuItems.map((item) => {
        const isActive = pathname.pathname === item.href
        return (
          <Button
            key={item.name}
            asChild
            variant={isActive ? "default" : "link"}
            className={cn(
              "justify-start transition-all duration-300",
            )}
          >
            <Link to={item.href}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.name}
            </Link>
          </Button>
        )
      })}
    </nav>
  )
}