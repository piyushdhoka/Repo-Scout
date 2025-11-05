import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LoginForm } from '@/components/Auth/LoginForm'
import { SignupForm } from '@/components/Auth/SignupForm'
import { PasswordResetForm } from '@/components/Auth/PasswordResetForm'

export function AuthPage() {
  const [activeTab, setActiveTab] = useState('login')

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Repo Scout</h1>
          <p className="text-gray-400">Find your next open source contribution</p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-900 border border-gray-800">
            <TabsTrigger
              value="login"
              className="data-[state=active]:bg-black data-[state=active]:text-white text-gray-400"
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="data-[state=active]:bg-black data-[state=active]:text-white text-gray-400"
            >
              Sign Up
            </TabsTrigger>
            <TabsTrigger
              value="reset"
              className="data-[state=active]:bg-black data-[state=active]:text-white text-gray-400"
            >
              Reset
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-6">
            <LoginForm onTabChange={handleTabChange} />
          </TabsContent>

          <TabsContent value="signup" className="mt-6">
            <SignupForm onTabChange={handleTabChange} />
          </TabsContent>

          <TabsContent value="reset" className="mt-6">
            <PasswordResetForm onTabChange={handleTabChange} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AuthPage