import React, { createContext, useContext, useState, ReactNode } from 'react'

interface SidebarContextType {
  isOpen: boolean
  toggleSidebar: () => void
  openSidebar: () => void
  closeSidebar: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}

interface SidebarProviderProps {
  children: ReactNode
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(prev => !prev)
  }

  const openSidebar = () => {
    setIsOpen(true)
  }

  const closeSidebar = () => {
    setIsOpen(false)
  }

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        toggleSidebar,
        openSidebar,
        closeSidebar
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}