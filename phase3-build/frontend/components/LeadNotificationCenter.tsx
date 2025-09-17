'use client';

import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, TrendingUp, X, Eye, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Notification } from '@/types';
import { formatTimeAgo, getPriorityColor } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface LeadNotificationCenterProps {
  notifications?: Notification[];
  onNotificationClick?: (notification: Notification) => void;
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAllRead?: () => void;
  className?: string;
}

export default function LeadNotificationCenter({
  notifications = [],
  onNotificationClick,
  onMarkAsRead,
  onMarkAllRead,
  className
}: LeadNotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localNotifications, setLocalNotifications] = useState<Notification[]>(notifications);

  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

  const unreadCount = localNotifications.filter(n => !n.read).length;
  const criticalCount = localNotifications.filter(n => n.priority === 'critical' && !n.read).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'high_value_lead':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'urgent_response':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'missed_target':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'conversion':
        return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'system_alert':
        return <Bell className="h-4 w-4 text-purple-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
    onNotificationClick?.(notification);
  };

  const handleMarkAsRead = (notificationId: string) => {
    setLocalNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    onMarkAsRead?.(notificationId);
  };

  const handleMarkAllRead = () => {
    setLocalNotifications(prev => prev.map(n => ({ ...n, read: true })));
    onMarkAllRead?.();
  };

  const sortedNotifications = [...localNotifications].sort((a, b) => {
    // Unread first, then by priority, then by timestamp
    if (a.read !== b.read) return a.read ? 1 : -1;

    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    if (a.priority !== b.priority) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }

    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return (
    <div className={className}>
      <Button
        variant="ghost"
        size="sm"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5 text-gray-600" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className={`absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs ${
              criticalCount > 0 ? 'bg-red-600 animate-pulse' : 'bg-tnt-red'
            }`}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-96 z-50"
          >
            <Card className="shadow-lg border-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {unreadCount} new
                      </Badge>
                    )}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        onClick={handleMarkAllRead}
                      >
                        Mark all read
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <ScrollArea className="h-96">
                  {sortedNotifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No notifications</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {sortedNotifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                            !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                          }`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className={`text-sm font-medium ${
                                  !notification.read ? 'text-gray-900' : 'text-gray-700'
                                }`}>
                                  {notification.title}
                                </p>
                                <div className="flex items-center space-x-2">
                                  <Badge
                                    className={`text-xs px-2 py-1 ${getPriorityColor(notification.priority)}`}
                                  >
                                    {notification.priority}
                                  </Badge>
                                  {!notification.read && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  )}
                                </div>
                              </div>

                              <p className={`text-sm mt-1 ${
                                !notification.read ? 'text-gray-800' : 'text-gray-600'
                              }`}>
                                {notification.message}
                              </p>

                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-500">
                                  {formatTimeAgo(notification.timestamp)}
                                </span>

                                <div className="flex items-center space-x-2">
                                  {notification.actionRequired && (
                                    <Badge variant="destructive" className="text-xs px-2 py-1">
                                      Action Required
                                    </Badge>
                                  )}

                                  {notification.leadId && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-xs h-6 px-2"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Handle view lead action
                                      }}
                                    >
                                      <ExternalLink className="h-3 w-3 mr-1" />
                                      View Lead
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Critical notifications overlay */}
      <AnimatePresence>
        {criticalCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-4 right-4 z-50"
          >
            <Card className="bg-red-50 border-red-200 shadow-lg max-w-sm">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 animate-pulse" />
                  <div>
                    <p className="text-sm font-medium text-red-900">
                      Critical Alert: {criticalCount} urgent notification{criticalCount > 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-red-700 mt-1">
                      High-value leads require immediate attention
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 text-red-700 border-red-300 hover:bg-red-100"
                      onClick={() => setIsOpen(true)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View Notifications
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}