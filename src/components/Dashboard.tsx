import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { loadStripe } from '@stripe/stripe-js'
import { Heart, LogOut, CreditCard, Bell, CheckCircle, XCircle, Calendar } from 'lucide-react'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '')

interface DashboardProps {
  user: any
}

export default function Dashboard({ user }: DashboardProps) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [currentMessage, setCurrentMessage] = useState<any>(null)

  useEffect(() => {
    fetchCurrentMessage()
  }, [])

  const fetchCurrentMessage = async () => {
    try {
      const response = await axios.get('/api/messages/current')
      setCurrentMessage(response.data)
    } catch (error) {
      console.error('Error fetching message:', error)
    }
  }

  const handleSubscribe = async () => {
    setLoading(true)
    try {
      const response = await axios.post('/api/payment/create-checkout-session')
      const stripe = await stripePromise
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId: response.data.sessionId })
      }
    } catch (error) {
      console.error('Subscription error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription?')) return
    try {
      await axios.post('/api/payment/cancel', {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Subscription cancelled successfully')
      setUser({ ...user, isSubscribed: false, subscriptionStatus: 'canceled' })
    } catch (error) {
      console.error('Cancel error:', error)
      toast.error('Failed to cancel subscription')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="w-8 h-8 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-800">Daily Positivity</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome, {user?.name || 'User'}!
            </h1>
            <p className="text-gray-600">
              {user?.isSubscribed 
                ? 'You are actively subscribed and receiving daily activities.'
                : 'Subscribe to start receiving daily positive psychology activities.'}
            </p>
          </div>

          {/* Subscription Status */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Subscription Status</h2>
              {user?.isSubscribed ? (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-medium">Active</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-red-600">
                  <XCircle className="w-6 h-6" />
                  <span className="font-medium">Not Subscribed</span>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Subscription Type</p>
                <p className="text-lg font-semibold text-gray-900 capitalize">
                  {user?.subscriptionType || 'N/A'}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <p className="text-lg font-semibold text-gray-900">{user?.email || 'N/A'}</p>
              </div>
              {user?.phone && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Phone</p>
                  <p className="text-lg font-semibold text-gray-900">{user.phone}</p>
                </div>
              )}
            </div>

            {user?.isSubscribed ? (
              <button
                onClick={handleCancelSubscription}
                className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-semibold"
              >
                Cancel Subscription
              </button>
            ) : (
              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <CreditCard className="w-5 h-5" />
                <span>{loading ? 'Processing...' : 'Subscribe Now'}</span>
              </button>
            )}
          </div>

          {/* Current Message Preview */}
          {currentMessage && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center space-x-2 mb-4">
                <Calendar className="w-6 h-6 text-indigo-600" />
                <h2 className="text-2xl font-bold text-gray-900">Today's Activity</h2>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-lg">
                <p className="text-gray-700 text-lg leading-relaxed">
                  {currentMessage.message?.content || 'No message available'}
                </p>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Day {currentMessage.tracker?.currentDay} • {currentMessage.tracker?.currentBatch}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
