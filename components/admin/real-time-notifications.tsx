"use client"

import { useState, useEffect } from "react"
import { Bell, X, Check, AlertCircle, ShoppingCart, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApp } from "@/app/providers"
import { useToast } from "@/hooks/use-toast"

interface Notification {
  id: string
  type: string
  title: string
  message: string
  data?: any
  is_read: boolean
  created_at: string
}

export function RealTimeNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [mounted, setMounted] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Fetch initial notifications
    fetchNotifications()
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  // Check for new notifications and show toast
  useEffect(() => {
    const previousCount = localStorage.getItem('notificationCount')
    const currentCount = unreadCount.toString()
    
    if (previousCount && parseInt(previousCount) < unreadCount && unreadCount > 0) {
      // Show toast for new notifications
      toast({
        title: "إشعار جديد",
        description: "لديك إشعارات جديدة غير مقروءة",
        duration: 5000,
      })
      
      // Play notification sound (optional)
      if (typeof window !== 'undefined') {
        try {
          // Create a simple beep sound
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()
          
          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)
          
          oscillator.frequency.value = 800
          oscillator.type = 'sine'
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
          
          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + 0.3)
        } catch (error) {
          // Ignore audio errors
        }
      }
    }
    
    localStorage.setItem('notificationCount', currentCount)
  }, [unreadCount, toast])

  const fetchNotifications = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
      const res = await fetch(`${backendUrl}/api/notifications`)
      const data = await res.json()
      setNotifications(data.success ? data.data : [])
      setUnreadCount(data.data?.filter((n: any) => !n.is_read).length || 0)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const createNotification = async (type: string, title: string, message: string, data?: any) => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, title, message, data })
      })
    } catch (error) {
      console.error('Error creating notification:', error)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
      await fetch(`${backendUrl}/api/notifications/${notificationId}/read`, { method: 'POST' })
      setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n)))
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
      await fetch(`${backendUrl}/api/notifications/mark-all-read`, { method: 'POST' })
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_order':
        return <ShoppingCart className="h-5 w-5 text-blue-600" />
      case 'order_cancelled':
        return <AlertCircle className="h-5 w-5 text-red-600" />
      case 'low_stock':
        return <Package className="h-5 w-5 text-orange-600" />
      default:
        return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "الآن"
    if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`
    if (diffInMinutes < 1440) return `منذ ${Math.floor(diffInMinutes / 60)} ساعة`
    return `منذ ${Math.floor(diffInMinutes / 1440)} يوم`
  }

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" onClick={() => setShowNotifications(!showNotifications)} className="relative h-10 w-10 sm:h-12 sm:w-12">
        <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
        {mounted && unreadCount > 0 ? (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </Button>

      {showNotifications && (
        <>
          {/* Mobile backdrop */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden" onClick={() => setShowNotifications(false)} />
          <div className="absolute right-0 sm:right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[80vh] overflow-hidden">
          <div className="p-3 sm:p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">الإشعارات</h3>
              <div className="flex items-center gap-1 sm:gap-2">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs sm:text-sm px-2 sm:px-3">
                    <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="hidden sm:inline">قراءة الكل</span>
                    <span className="sm:hidden">الكل</span>
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={() => setShowNotifications(false)} className="h-8 w-8 sm:h-10 sm:w-10">
                  <X className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm sm:text-base">لا توجد إشعارات</div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 sm:p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !notification.is_read ? "bg-blue-50" : ""
                  }`}
                  onClick={() => !notification.is_read && markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-xs sm:text-sm leading-tight">{notification.title}</p>
                      <p className="text-gray-600 text-xs sm:text-sm mt-1 leading-tight line-clamp-2">{notification.message}</p>
                      {notification.data && (
                        <div className="text-xs text-gray-500 mt-1">
                          {(() => {
                            try {
                              const data = JSON.parse(notification.data)
                              if (data.order_number) {
                                return `رقم الطلب: ${data.order_number}`
                              }
                              return null
                            } catch {
                              return null
                            }
                          })()}
                        </div>
                      )}
                      <p className="text-gray-400 text-xs mt-2">{formatTime(notification.created_at)}</p>
                    </div>
                    {!notification.is_read && (
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-1 sm:mt-2"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        </>
      )}
    </div>
  )
}
