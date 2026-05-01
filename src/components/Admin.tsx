import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Users, MessageSquare, Upload, TrendingUp, LogOut, RefreshCw, CreditCard, BarChart3, LayoutDashboard, FileSpreadsheet, Send, Activity, Loader2, Trash2 } from 'lucide-react'

interface AdminProps {
  user: any
}

export default function Admin({ user }: AdminProps) {
  const navigate = useNavigate()
  const [stats, setStats] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [tracker, setTracker] = useState<any>(null)
  const [file, setFile] = useState<File | null>(null)
  const [batchName, setBatchName] = useState('Batch 1')
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState('stats')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [manualMessage, setManualMessage] = useState({
    category: '',
    activity: '',
    affirmation: '',
    targetSubscriptionType: 'all',
    selectedUsers: [] as string[],
    selectedMessageId: ''
  })
  const [sendingMessage, setSendingMessage] = useState(false)
  const [deliveries, setDeliveries] = useState<any[]>([])
  const [deliveryPagination, setDeliveryPagination] = useState({ page: 1, limit: 50, total: 0, totalPages: 0 })
  const [deliveryFilter, setDeliveryFilter] = useState({ status: '', userEmail: '' })
  const [userSearch, setUserSearch] = useState('')
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [messageSearch, setMessageSearch] = useState('')
  const [showMessageDropdown, setShowMessageDropdown] = useState(false)
  const [usersPagination, setUsersPagination] = useState({ page: 1, limit: 50, total: 0, totalPages: 0 })
  const [usersFilter, setUsersFilter] = useState({ search: '', subscriptionType: '', isSubscribed: '', subscriptionStatus: '' })
  const [messagesPagination, setMessagesPagination] = useState({ page: 1, limit: 50, total: 0, totalPages: 0 })
  const [messagesFilter, setMessagesFilter] = useState({ search: '', batchName: '', isSent: '' })
  const [selectedMessages, setSelectedMessages] = useState<string[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [loadingDeliveries, setLoadingDeliveries] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers()
    }
  }, [activeTab, usersPagination.page, usersFilter])

  useEffect(() => {
    if (activeTab === 'messages') {
      fetchMessages()
    }
  }, [activeTab, messagesPagination.page, messagesFilter])

  useEffect(() => {
    if (activeTab === 'delivery-metrics') {
      fetchDeliveries()
    }
  }, [activeTab, deliveryPagination.page, deliveryFilter])

  const fetchDeliveries = async () => {
    try {
      setLoadingDeliveries(true)
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/admin/deliveries', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: deliveryPagination.page,
          limit: deliveryPagination.limit,
          status: deliveryFilter.status || undefined,
          userEmail: deliveryFilter.userEmail || undefined
        }
      })
      setDeliveries(response.data.deliveries)
      setDeliveryPagination({
        page: response.data.page,
        limit: response.data.limit,
        total: response.data.total,
        totalPages: response.data.totalPages
      })
    } catch (error) {
      console.error('Error fetching deliveries:', error)
    } finally {
      setLoadingDeliveries(false)
    }
  }

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      const [statsRes, usersRes, messagesRes, trackerRes] = await Promise.all([
        axios.get('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/admin/users', { 
          headers: { Authorization: `Bearer ${token}` },
          params: { page: 1, limit: 50 }
        }),
        axios.get('/api/admin/messages', { 
          headers: { Authorization: `Bearer ${token}` },
          params: { page: 1, limit: 50 }
        }),
        axios.get('/api/admin/tracker', { headers: { Authorization: `Bearer ${token}` } })
      ])
      setStats(statsRes.data)
      setUsers(usersRes.data.users)
      setUsersPagination({ page: usersRes.data.page, limit: usersRes.data.limit, total: usersRes.data.total, totalPages: usersRes.data.totalPages })
      setMessages(messagesRes.data.messages)
      setMessagesPagination({ page: messagesRes.data.page, limit: messagesRes.data.limit, total: messagesRes.data.total, totalPages: messagesRes.data.totalPages })
      setTracker(trackerRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true)
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: usersPagination.page, limit: usersPagination.limit, ...usersFilter }
      })
      setUsers(response.data.users)
      setUsersPagination({ page: response.data.page, limit: response.data.limit, total: response.data.total, totalPages: response.data.totalPages })
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoadingUsers(false)
    }
  }

  const fetchMessages = async () => {
    try {
      setLoadingMessages(true)
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/admin/messages', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: messagesPagination.page, limit: messagesPagination.limit, ...messagesFilter }
      })
      setMessages(response.data.messages)
      setMessagesPagination({ page: response.data.page, limit: response.data.limit, total: response.data.total, totalPages: response.data.totalPages })
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoadingMessages(false)
    }
  }

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      toast.error('Please select a file to upload')
      return
    }

    if (!file.name.endsWith('.xlsx')) {
      toast.error('Please upload an Excel file (.xlsx)')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('batchName', batchName)

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post('/api/messages/upload', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      })
      toast.success(`Messages uploaded successfully! ${response.data.count} messages added to ${response.data.batchName}`)
      fetchData()
      setFile(null)
      setBatchName(`Batch ${messages.length + 1}`)
    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error(error.response?.data?.message || 'Upload failed. Please check the file format.')
    } finally {
      setUploading(false)
    }
  }

  const handleUpdateTracker = async () => {
    try {
      const token = localStorage.getItem('token')
      await axios.put('/api/admin/tracker', {
        currentDay: tracker?.currentDay,
        currentBatch: tracker?.currentBatch
      }, { headers: { Authorization: `Bearer ${token}` } })
      toast.success('Tracker updated successfully!')
      fetchData()
    } catch (error) {
      console.error('Update error:', error)
      toast.error('Failed to update tracker')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    
    try {
      toast.loading('Deleting user...')
      const token = localStorage.getItem('token')
      await axios.delete(`/api/admin/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
      toast.dismiss()
      toast.success('User deleted successfully')
      fetchUsers()
    } catch (error: any) {
      toast.dismiss()
      console.error('Delete error:', error)
      toast.error(error.response?.data?.message || 'Failed to delete user')
    }
  }

  const handleEditUser = (user: any) => {
    setEditingUser(user)
    setEditModalOpen(true)
  }

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return

    try {
      toast.loading('Updating user...')
      const token = localStorage.getItem('token')
      await axios.put(`/api/admin/users/${editingUser._id}`, editingUser, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.dismiss()
      toast.success('User updated successfully')
      setEditModalOpen(false)
      setEditingUser(null)
      fetchUsers()
    } catch (error: any) {
      toast.dismiss()
      console.error('Update error:', error)
      toast.error(error.response?.data?.message || 'Failed to update user')
    }
  }

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return
    
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`/api/admin/messages/${messageId}`, { headers: { Authorization: `Bearer ${token}` } })
      toast.success('Message deleted successfully')
      fetchData()
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete message')
    }
  }

  const handleSelectMessage = (messageId: string) => {
    setSelectedMessages(prev => 
      prev.includes(messageId) 
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    )
  }

  const handleSelectAllMessages = () => {
    if (selectedMessages.length === messages.length && messages.length > 0) {
      setSelectedMessages([])
    } else {
      setSelectedMessages(messages.map(m => m._id))
    }
  }

  const handleBulkDeleteMessages = async () => {
    if (selectedMessages.length === 0) {
      toast.error('Please select messages to delete')
      return
    }
    
    if (!confirm(`Are you sure you want to delete ${selectedMessages.length} message(s)?`)) return
    
    try {
      toast.loading('Deleting messages...')
      const token = localStorage.getItem('token')
      await axios.post('/api/admin/messages/bulk-delete', { ids: selectedMessages }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.dismiss()
      toast.success('Messages deleted successfully')
      setSelectedMessages([])
      fetchMessages()
    } catch (error) {
      toast.dismiss()
      console.error('Delete error:', error)
      toast.error('Failed to delete messages')
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualMessage.category || !manualMessage.activity || !manualMessage.affirmation) {
      toast.error('Please fill in all fields')
      return
    }

    setSendingMessage(true)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post('/api/admin/send-message', manualMessage, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success(`Message sent successfully! ${response.data.emailCount} emails, ${response.data.smsCount} SMS sent to ${response.data.totalSubscribers} subscribers`)
      setManualMessage({
        category: '',
        activity: '',
        affirmation: '',
        targetSubscriptionType: 'all',
        selectedUsers: [],
        selectedMessageId: ''
      })
    } catch (error: any) {
      console.error('Send message error:', error)
      toast.error(error.response?.data?.message || 'Failed to send message')
    } finally {
      setSendingMessage(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-slate-900 to-indigo-900 min-h-screen transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-lg font-bold text-white">Admin Panel</h1>
                <p className="text-xs text-indigo-300">Dashboard</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('stats')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
              activeTab === 'stats' 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                : 'text-indigo-200 hover:bg-white/10'
            }`}
          >
            <BarChart3 className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium">Stats Overview</span>}
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
              activeTab === 'users' 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                : 'text-indigo-200 hover:bg-white/10'
            }`}
          >
            <Users className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium">Users Management</span>}
          </button>

          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
              activeTab === 'subscriptions' 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                : 'text-indigo-200 hover:bg-white/10'
            }`}
          >
            <CreditCard className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium">Subscriptions</span>}
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
              activeTab === 'upload' 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                : 'text-indigo-200 hover:bg-white/10'
            }`}
          >
            <FileSpreadsheet className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium">Excel Upload</span>}
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
              activeTab === 'messages' 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                : 'text-indigo-200 hover:bg-white/10'
            }`}
          >
            <MessageSquare className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium">Messages</span>}
          </button>

          <button
            onClick={() => setActiveTab('send-message')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
              activeTab === 'send-message' 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                : 'text-indigo-200 hover:bg-white/10'
            }`}
          >
            <Send className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium">Send Message</span>}
          </button>

          <button
            onClick={() => setActiveTab('delivery-metrics')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
              activeTab === 'delivery-metrics' 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                : 'text-indigo-200 hover:bg-white/10'
            }`}
          >
            <Activity className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium">Delivery Metrics</span>}
          </button>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
              {user?.name?.[0] || 'A'}
            </div>
            {sidebarOpen && (
              <div>
                <p className="text-sm font-medium text-white">{user?.name || 'Admin'}</p>
                <p className="text-xs text-indigo-300">Administrator</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition text-white"
          >
            <LogOut className="w-4 h-4" />
            {sidebarOpen && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 capitalize">{activeTab}</h2>
            <p className="text-sm text-gray-500">Manage your application</p>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <LayoutDashboard className="w-5 h-5 text-gray-600" />
          </button>
        </header>

        <div className="p-8">
          {activeTab === 'stats' && (
            <div>
              {/* Stats Cards */}
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-3xl font-bold text-gray-900">{stats?.totalUsers || 0}</span>
                  </div>
                  <p className="text-gray-600 font-medium">Total Users</p>
                  <p className="text-sm text-gray-400 mt-1">Registered accounts</p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-3xl font-bold text-gray-900">{stats?.activeSubscribers || 0}</span>
                  </div>
                  <p className="text-gray-600 font-medium">Active Subscribers</p>
                  <p className="text-sm text-gray-400 mt-1">Paying customers</p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-3xl font-bold text-gray-900">{stats?.totalMessages || 0}</span>
                  </div>
                  <p className="text-gray-600 font-medium">Total Messages</p>
                  <p className="text-sm text-gray-400 mt-1">In database</p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-3xl font-bold text-gray-900">{tracker?.currentDay || 0}</span>
                  </div>
                  <p className="text-gray-600 font-medium">Current Day</p>
                  <p className="text-sm text-gray-400 mt-1">{tracker?.currentBatch || 'N/A'}</p>
                </div>
              </div>

              {/* Message Tracker */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Message Tracker Settings</h3>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Day</label>
                    <input
                      type="number"
                      value={tracker?.currentDay || 1}
                      onChange={(e) => setTracker({ ...tracker, currentDay: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Batch</label>
                    <input
                      type="text"
                      value={tracker?.currentBatch || 'Batch 1'}
                      onChange={(e) => setTracker({ ...tracker, currentBatch: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <button
                  onClick={handleUpdateTracker}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition font-medium"
                >
                  Update Tracker
                </button>
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Upload Excel File</h3>
              <form onSubmit={handleFileUpload} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Batch Name</label>
                  <input
                    type="text"
                    value={batchName}
                    onChange={(e) => setBatchName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Batch 1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Excel File (.xlsx)</label>
                  <div 
                    onClick={() => document.getElementById('file-upload')?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-500 transition cursor-pointer"
                  >
                    <input
                      type="file"
                      accept=".xlsx"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="file-upload"
                    />
                    <div className="flex flex-col items-center">
                      <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-400">Excel files (.xlsx) only</p>
                      {file && (
                        <p className="mt-4 text-sm font-medium text-indigo-600">{file.name}</p>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={!file || uploading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl hover:shadow-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <Upload className="w-5 h-5" />
                  <span>{uploading ? 'Uploading...' : 'Upload Messages'}</span>
                </button>
              </form>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Users ({usersPagination.total})</h3>
                <button
                  onClick={fetchUsers}
                  className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
              </div>

              {/* Filters */}
              <div className="flex space-x-4 mb-6">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={usersFilter.search}
                    onChange={(e) => {
                      setUsersFilter({ ...usersFilter, search: e.target.value })
                      setUsersPagination({ ...usersPagination, page: 1 })
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div className="w-40">
                  <select
                    value={usersFilter.subscriptionType}
                    onChange={(e) => {
                      setUsersFilter({ ...usersFilter, subscriptionType: e.target.value })
                      setUsersPagination({ ...usersPagination, page: 1 })
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">All Types</option>
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="both">Both</option>
                  </select>
                </div>
                <div className="w-40">
                  <select
                    value={usersFilter.isSubscribed}
                    onChange={(e) => {
                      setUsersFilter({ ...usersFilter, isSubscribed: e.target.value })
                      setUsersPagination({ ...usersPagination, page: 1 })
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">All Status</option>
                    <option value="true">Subscribed</option>
                    <option value="false">Not Subscribed</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              {loadingUsers ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stripe ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{user.phone || '-'}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 capitalize">{user.subscriptionType}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            user.isSubscribed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.isSubscribed ? 'Subscribed' : 'Not Subscribed'}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {user.stripeCustomerId ? (
                            <span className="text-xs text-indigo-600">{user.stripeCustomerId.slice(0, 8)}...</span>
                          ) : '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {user.subscriptionEndDate ? new Date(user.subscriptionEndDate).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="text-indigo-600 hover:text-indigo-800 font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="text-red-600 hover:text-red-800 font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              )}

              {/* Pagination */}
              {usersPagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setUsersPagination({ ...usersPagination, page: usersPagination.page - 1 })}
                    disabled={usersPagination.page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {usersPagination.page} of {usersPagination.totalPages} ({usersPagination.total} total)
                  </span>
                  <button
                    onClick={() => setUsersPagination({ ...usersPagination, page: usersPagination.page + 1 })}
                    disabled={usersPagination.page === usersPagination.totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'subscriptions' && (
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Subscriptions ({users.filter(u => u.isSubscribed).length})</h2>
                <button
                  onClick={fetchData}
                  className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stripe ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.filter(u => u.isSubscribed).map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 capitalize">{user.subscriptionType}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            user.subscriptionStatus === 'active' ? 'bg-green-100 text-green-800' :
                            user.subscriptionStatus === 'canceled' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {user.subscriptionStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {user.stripeCustomerId ? (
                            <span className="text-xs text-indigo-600">{user.stripeCustomerId.slice(0, 8)}...</span>
                          ) : '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {user.subscriptionEndDate ? new Date(user.subscriptionEndDate).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          ${user.subscriptionType === 'both' ? '14.99' : '9.99'}/mo
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'send-message' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Send Manual Message to Subscribers</h3>
            
            {/* Select from existing messages */}
            <div className="mb-6 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">Or select from existing messages (Excel uploads)</label>
              <div className="relative">
                <input
                  type="text"
                  value={messageSearch}
                  onChange={(e) => {
                    setMessageSearch(e.target.value)
                    setShowMessageDropdown(true)
                  }}
                  onFocus={() => setShowMessageDropdown(true)}
                  onBlur={() => setTimeout(() => setShowMessageDropdown(false), 200)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Search messages by category, batch, or day..."
                />
                {showMessageDropdown && messageSearch && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto">
                    {messages
                      .filter(m => 
                        m.category.toLowerCase().includes(messageSearch.toLowerCase()) ||
                        m.batchName.toLowerCase().includes(messageSearch.toLowerCase()) ||
                        m.dayNumber.toString().includes(messageSearch)
                      )
                      .slice(0, 10)
                      .map((message) => (
                        <div
                          key={message._id}
                          onClick={() => {
                            setManualMessage({
                              ...manualMessage,
                              category: message.category,
                              activity: message.activity,
                              affirmation: message.affirmation,
                              selectedMessageId: message._id
                            })
                            setMessageSearch('')
                            setShowMessageDropdown(false)
                          }}
                          className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium text-gray-900">{message.category} - Day {message.dayNumber}</div>
                          <div className="text-sm text-gray-500">{message.batchName}</div>
                          <div className="text-xs text-gray-400 mt-1 truncate">{message.activity.substring(0, 50)}...</div>
                        </div>
                      ))}
                    {messages.filter(m => 
                      m.category.toLowerCase().includes(messageSearch.toLowerCase()) ||
                      m.batchName.toLowerCase().includes(messageSearch.toLowerCase()) ||
                      m.dayNumber.toString().includes(messageSearch)
                    ).length === 0 && (
                      <div className="px-4 py-3 text-gray-500">No messages found</div>
                    )}
                  </div>
                )}
              </div>
              {manualMessage.selectedMessageId && (
                <button
                  type="button"
                  onClick={() => {
                    setManualMessage({
                      ...manualMessage,
                      category: '',
                      activity: '',
                      affirmation: '',
                      selectedMessageId: ''
                    })
                  }}
                  className="mt-2 text-sm text-red-600 hover:text-red-800"
                >
                  Clear selected message
                </button>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <input
                  type="text"
                  value={manualMessage.category}
                  onChange={(e) => setManualMessage({ ...manualMessage, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Mindfulness, Gratitude, Kindness"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Activity</label>
                <textarea
                  value={manualMessage.activity}
                  onChange={(e) => setManualMessage({ ...manualMessage, activity: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={3}
                  placeholder="Today's activity description..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Affirmation</label>
                <textarea
                  value={manualMessage.affirmation}
                  onChange={(e) => setManualMessage({ ...manualMessage, affirmation: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={2}
                  placeholder="Today's affirmation..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Specific Users (Optional)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => {
                      setUserSearch(e.target.value)
                      setShowUserDropdown(true)
                    }}
                    onFocus={() => setShowUserDropdown(true)}
                    onBlur={() => setTimeout(() => setShowUserDropdown(false), 200)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Search users by email..."
                  />
                  {showUserDropdown && userSearch && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto">
                      {users
                        .filter(u => u.email.toLowerCase().includes(userSearch.toLowerCase()))
                        .slice(0, 10)
                        .map((user) => (
                          <div
                            key={user._id}
                            onClick={() => {
                              if (!manualMessage.selectedUsers.includes(user._id)) {
                                setManualMessage({ ...manualMessage, selectedUsers: [...manualMessage.selectedUsers, user._id] })
                              }
                              setUserSearch('')
                            }}
                            className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <div className="font-medium text-gray-900">{user.email}</div>
                            <div className="text-sm text-gray-500">{user.name} - {user.subscriptionType} - {user.isSubscribed ? 'Subscribed' : 'Not Subscribed'}</div>
                          </div>
                        ))}
                      {users.filter(u => u.email.toLowerCase().includes(userSearch.toLowerCase())).length === 0 && (
                        <div className="px-4 py-3 text-gray-500">No users found</div>
                      )}
                    </div>
                  )}
                </div>
                {manualMessage.selectedUsers.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {manualMessage.selectedUsers.map((userId) => {
                      const user = users.find(u => u._id === userId)
                      return (
                        <span
                          key={userId}
                          className="inline-flex items-center space-x-2 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                        >
                          <span>{user?.email || 'Unknown'}</span>
                          <button
                            type="button"
                            onClick={() => setManualMessage({
                              ...manualMessage,
                              selectedUsers: manualMessage.selectedUsers.filter(id => id !== userId)
                            })}
                            className="hover:text-red-600"
                          >
                            ×
                          </button>
                        </span>
                      )
                    })}
                    <button
                      type="button"
                      onClick={() => setManualMessage({ ...manualMessage, selectedUsers: [] })}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Subscribers</label>
                <select
                  value={manualMessage.targetSubscriptionType}
                  onChange={(e) => setManualMessage({ ...manualMessage, targetSubscriptionType: e.target.value })}
                  disabled={manualMessage.selectedUsers.length > 0}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="all">All Subscribers</option>
                  <option value="email">Email Only</option>
                  <option value="sms">SMS Only</option>
                  <option value="both">Email & SMS</option>
                </select>
                {manualMessage.selectedUsers.length > 0 && (
                  <p className="text-sm text-gray-500 mt-1">Specific users selected - target filter disabled</p>
                )}
              </div>
              <button
                type="submit"
                disabled={sendingMessage}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl hover:shadow-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>{sendingMessage ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          </div>
        )}

        {activeTab === 'delivery-metrics' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Message Delivery Metrics</h3>
            
            {/* Filters */}
            <div className="flex space-x-4 mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by email..."
                  value={deliveryFilter.userEmail}
                  onChange={(e) => {
                    setDeliveryFilter({ ...deliveryFilter, userEmail: e.target.value })
                    setDeliveryPagination({ ...deliveryPagination, page: 1 })
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="w-48">
                <select
                  value={deliveryFilter.status}
                  onChange={(e) => {
                    setDeliveryFilter({ ...deliveryFilter, status: e.target.value })
                    setDeliveryPagination({ ...deliveryPagination, page: 1 })
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="sent">Sent</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-4 text-white">
                <p className="text-sm opacity-90">Total Sent</p>
                <p className="text-2xl font-bold">{deliveries.filter(d => d.status === 'sent').length}</p>
              </div>
              <div className="bg-gradient-to-r from-red-500 to-rose-500 rounded-xl p-4 text-white">
                <p className="text-sm opacity-90">Total Failed</p>
                <p className="text-2xl font-bold">{deliveries.filter(d => d.status === 'failed').length}</p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-4 text-white">
                <p className="text-sm opacity-90">Total Deliveries</p>
                <p className="text-2xl font-bold">{deliveryPagination.total}</p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white">
                <p className="text-sm opacity-90">Success Rate</p>
                <p className="text-2xl font-bold">
                  {deliveryPagination.total > 0 
                    ? Math.round((deliveries.filter(d => d.status === 'sent').length / deliveryPagination.total) * 100) 
                    : 0}%
                </p>
              </div>
            </div>

            {/* Table */}
            {loadingDeliveries ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
              </div>
            ) : deliveries.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-500 text-lg">No delivery data available</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sent Via</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sent Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {deliveries.map((delivery) => (
                      <tr key={delivery._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{delivery.userEmail}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 capitalize">{delivery.userSubscriptionType}</td>
                        <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">{delivery.category}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 capitalize">{delivery.sentVia}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{new Date(delivery.sentDate).toLocaleDateString()}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            delivery.status === 'sent' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {delivery.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {deliveryPagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setDeliveryPagination({ ...deliveryPagination, page: deliveryPagination.page - 1 })}
                  disabled={deliveryPagination.page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {deliveryPagination.page} of {deliveryPagination.totalPages}
                </span>
                <button
                  onClick={() => setDeliveryPagination({ ...deliveryPagination, page: deliveryPagination.page + 1 })}
                  disabled={deliveryPagination.page === deliveryPagination.totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Messages ({messagesPagination.total})</h3>
              <div className="flex items-center space-x-3">
                {selectedMessages.length > 0 && (
                  <button
                    onClick={handleBulkDeleteMessages}
                    className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Selected ({selectedMessages.length})</span>
                  </button>
                )}
                <button
                  onClick={fetchMessages}
                  className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex space-x-4 mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by category, activity, or affirmation..."
                  value={messagesFilter.search}
                  onChange={(e) => {
                    setMessagesFilter({ ...messagesFilter, search: e.target.value })
                    setMessagesPagination({ ...messagesPagination, page: 1 })
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="w-40">
                <select
                  value={messagesFilter.isSent}
                  onChange={(e) => {
                    setMessagesFilter({ ...messagesFilter, isSent: e.target.value })
                    setMessagesPagination({ ...messagesPagination, page: 1 })
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="true">Sent</option>
                  <option value="false">Not Sent</option>
                </select>
              </div>
            </div>

            {/* Table */}
            {loadingMessages ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                        <input
                          type="checkbox"
                          checked={selectedMessages.length === messages.length && messages.length > 0}
                          onChange={handleSelectAllMessages}
                          className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Affirmation</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {messages.map((message) => (
                      <tr key={message._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedMessages.includes(message._id)}
                            onChange={() => handleSelectMessage(message._id)}
                            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{message.dayNumber}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{message.batchName}</td>
                        <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                          <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                            {message.category}
                          </span>
                        </td>
                      <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">{message.activity}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">{message.affirmation}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          message.isSent ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {message.isSent ? 'Sent' : 'Not Sent'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          onClick={() => handleDeleteMessage(message._id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}

            {/* Pagination */}
            {messagesPagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setMessagesPagination({ ...messagesPagination, page: messagesPagination.page - 1 })}
                  disabled={messagesPagination.page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {messagesPagination.page} of {messagesPagination.totalPages} ({messagesPagination.total} total)
                </span>
                <button
                  onClick={() => setMessagesPagination({ ...messagesPagination, page: messagesPagination.page + 1 })}
                  disabled={messagesPagination.page === messagesPagination.totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>

    {/* Edit User Modal */}
    {editModalOpen && editingUser && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Edit User</h3>
          <form onSubmit={handleUpdateUser} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={editingUser.name}
                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={editingUser.email}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="text"
                value={editingUser.phone || ''}
                onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subscription Type</label>
              <select
                value={editingUser.subscriptionType}
                onChange={(e) => setEditingUser({ ...editingUser, subscriptionType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="both">Both</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Is Subscribed</label>
              <select
                value={editingUser.isSubscribed ? 'true' : 'false'}
                onChange={(e) => setEditingUser({ ...editingUser, isSubscribed: e.target.value === 'true' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subscription Status</label>
              <select
                value={editingUser.subscriptionStatus}
                onChange={(e) => setEditingUser({ ...editingUser, subscriptionStatus: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="canceled">Canceled</option>
                <option value="past_due">Past Due</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Is Admin</label>
              <select
                value={editingUser.isAdmin ? 'true' : 'false'}
                onChange={(e) => setEditingUser({ ...editingUser, isAdmin: e.target.value === 'true' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-xl hover:shadow-lg transition font-medium"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditModalOpen(false)
                  setEditingUser(null)
                }}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-xl hover:bg-gray-300 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
)
}
