'use client';

import React from 'react';
import { Bell, User, LogOut, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User as UserType } from '@/types';

interface TNTBrandHeaderProps {
  user?: UserType;
  notificationCount?: number;
  onNotificationClick?: () => void;
  onLogout?: () => void;
}

export default function TNTBrandHeader({
  user,
  notificationCount = 0,
  onNotificationClick,
  onLogout
}: TNTBrandHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              {/* TNT Logo */}
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-tnt-black to-tnt-red rounded-lg">
                <span className="text-white font-bold text-xl">TNT</span>
              </div>

              {/* Brand Text */}
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold text-tnt-black">
                  TNT Transportation
                </h1>
                <p className="text-sm text-tnt-red font-medium">
                  Driven by Service, Defined by Excellence
                </p>
              </div>
            </div>
          </div>

          {/* Center - Dashboard Title */}
          <div className="hidden md:flex items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Speed-to-Lead Dashboard
            </h2>
          </div>

          {/* Right side - User actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              onClick={onNotificationClick}
            >
              <Bell className="h-5 w-5 text-gray-600" />
              {notificationCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-tnt-red"
                >
                  {notificationCount > 99 ? '99+' : notificationCount}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.name}</span>
                      <span className="text-xs text-gray-500">{user.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Brand Text */}
      <div className="sm:hidden px-4 pb-3">
        <h1 className="text-lg font-bold text-tnt-black">TNT Transportation</h1>
        <p className="text-xs text-tnt-red font-medium">
          Driven by Service, Defined by Excellence
        </p>
      </div>
    </header>
  );
}