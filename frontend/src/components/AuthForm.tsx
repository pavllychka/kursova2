'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { APIResponse, ServerUser, UserCreate } from '@/types'
import { Briefcase, Globe } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { loginUser, registerUser } from '@/api'

const SERVER_URL = 'http://localhost:5000/api'

export default function AuthForms() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [registerData, setRegisterData] = useState<Omit<UserCreate, "id">>({
    name: '',
    email: '',
    password: '',
    role: 'user',
    location: { x: 0, y: 0 }
  })
  const [loginData, setLoginData] = useState({ email: '', password: '' })

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    registerUser(registerData).then((data) => {
      console.log('Registration successful:', data)
      login(data)
      navigate('/')
    }).catch((error) => {
      console.error('Error during registration:', error)
      toast({ title: "Registration failed", variant: "destructive" });
    })
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    loginUser(loginData).then((data) => {
      console.log('Login successful:', data)
      login(data)
      console.log('Navigating to home')
      navigate('/')
    }).catch((error) => {
      console.error('Error during login:', error)
      toast({ title: "Login failed", variant: "destructive" });
    })
  }

  return (
      <div className="flex min-h-screen">
        <div className="flex-1 bg-primary text-white flex items-center justify-center">
          <div className="p-9">
            <div className='flex flex-row gap-4'>
              <Globe size={48} className='mb-4' />
              <Briefcase size={48} className='mb-4' />
            </div>
            <h1 className="text-4xl font-bold mb-4">Welcome to Project Founder</h1>
            <p className="text-lg">Discover exciting projects and connect with top talent. Join our community to unlock new opportunities and take your career to the next level.</p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <Tabs defaultValue="register" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="register">Register</TabsTrigger>
              <TabsTrigger value="login">Login</TabsTrigger>
            </TabsList>
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Register</CardTitle>
                  <CardDescription>Create a new account.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <form onSubmit={handleRegisterSubmit}>
                    <div className="space-y-1">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={registerData.role}
                        onValueChange={(value) => setRegisterData({ ...registerData, role: value as "user" | "project_creator" })}
                        required
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="project_creator">Project Creator</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="location">Location</Label>
                      <div className="flex flex-row gap-2">
                        <Input
                          id="location-x"
                          placeholder="Latitude"
                          type="text"
                          onChange={(e) => setRegisterData({ ...registerData, location: { x: parseFloat(e.target.value), y: registerData.location.y } })}
                          required
                        />
                        <Input
                          id="location-y"
                          placeholder="Longitude"
                          type="text"
                          onChange={(e) => setRegisterData({ ...registerData, location: { x: registerData.location.x, y: parseFloat(e.target.value) } })}
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" className="mt-4 w-full">Register</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>Login to your account.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <form onSubmit={handleLoginSubmit}>
                    <div className="space-y-1">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" className="mt-4 w-full">Login</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  }
