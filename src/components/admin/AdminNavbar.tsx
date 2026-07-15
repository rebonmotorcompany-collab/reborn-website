'use client'

import { logOut } from '@/actions/auth'
import { Bell, Search, LogOut, Menu, Sun, Moon } from 'lucide-react'
import { User } from 'next-auth'
import { useAppContext } from '@/context/AppContext'

interface AdminNavbarProps {
  user: User & { roles?: string[] }
}

export default function AdminNavbar({ user }: AdminNavbarProps) {
  const { theme, setTheme } = useAppContext();

  return (
    <header className="h-16 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-4 sm:px-6 z-10 sticky top-0">
      <div className="flex items-center flex-1">
        <button className="md:hidden mr-4 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="hidden md:flex relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-100 dark:bg-neutral-900 border-none rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:outline-none dark:text-white"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
        </button>

        <button className="relative p-2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-neutral-950"></span>
        </button>

        <div className="h-8 w-px bg-neutral-200 dark:bg-neutral-800 mx-2"></div>

        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-neutral-900 dark:text-white leading-none">{user.name}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 capitalize">
              {user.roles?.[0]?.replace('-', ' ')}
            </p>
          </div>
          
          <button 
            onClick={() => logOut()}
            className="p-2 text-neutral-500 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
