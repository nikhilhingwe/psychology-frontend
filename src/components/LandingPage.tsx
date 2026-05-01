import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Heart, Mail, Sparkles, Check, ArrowRight, Zap, Brain, Calendar } from 'lucide-react'
import axios from 'axios'

export default function LandingPage() {
  const [currentMessage, setCurrentMessage] = useState<any>(null)

  useEffect(() => {
    fetchCurrentMessage()
  }, [])

  const fetchCurrentMessage = async () => {
    try {
      const response = await axios.get('/api/messages/current')
      setCurrentMessage(response.data.message)
    } catch (error) {
      console.error('Error fetching current message:', error)
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Daily Positivity
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-indigo-600 transition font-medium">
                Sign In
              </Link>
              <Link to="/signup" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-xl hover:shadow-lg transition-all duration-300 font-medium">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-5 py-2.5 rounded-full mb-8 border border-indigo-200">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">500+ Science-Backed Activities</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
              Transform Your Mental Wellness
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                One Day at a Time
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Receive daily positive psychology activities via email or text. Evidence-based exercises designed by mental health professionals to boost your mood, reduce stress, and build lasting resilience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/signup" className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-2xl transition-all duration-300 flex items-center space-x-2">
                <span>Start Your Free Journey</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#features" className="bg-white text-gray-800 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-300 border border-gray-200 shadow-sm hover:shadow-md">
                How It Works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Message Section */}
      {currentMessage && (
        <section className="py-20 px-6 bg-gradient-to-b from-white to-indigo-50">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-indigo-100">
              <div className="text-center mb-8">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-4 py-2 rounded-full mb-4">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-semibold">Today's Message</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Daily Inspiration</h2>
                <p className="text-gray-600">Take a moment to nurture your mind and spirit</p>
              </div>
              
              <div className="space-y-8">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Today's Theme</h3>
                  </div>
                  <p className="text-xl text-gray-800 font-semibold">{currentMessage.category}</p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Today's Activity</h3>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">{currentMessage.activity}</p>
                </div>

                <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-100">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Today's Affirmation</h3>
                  </div>
                  <p className="text-lg text-gray-700 italic leading-relaxed">"{currentMessage.affirmation}"</p>
                </div>
              </div>

              <div className="mt-10 text-center">
                <Link to="/signup" className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-2xl transition-all duration-300">
                  <span>Get Daily Messages Like This</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
            
            {/* Social Proof */}
            <section className="py-16 px-6 bg-white">
              <div className="container mx-auto max-w-4xl text-center">
                <p className="text-sm text-gray-500 mb-4 font-medium">Trusted by individuals seeking better mental wellness</p>
                <div className="flex items-center justify-center space-x-8">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                        {i}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-bold text-gray-900">2,500+</span> active subscribers
                  </p>
                </div>
              </div>
            </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Science-backed methods designed for real results
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl hover:shadow-2xl transition-all duration-500 border border-indigo-100">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Daily Delivery</h3>
              <p className="text-gray-600 leading-relaxed">
                Receive a new positive psychology activity every morning via email or text message. Start your day with intention and positivity.
              </p>
            </div>
            
            <div className="group bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl hover:shadow-2xl transition-all duration-500 border border-purple-100">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Evidence-Based</h3>
              <p className="text-gray-600 leading-relaxed">
                All activities are based on proven positive psychology research and therapeutic techniques used by mental health professionals.
              </p>
            </div>
            
            <div className="group bg-gradient-to-br from-pink-50 to-orange-50 p-8 rounded-2xl hover:shadow-2xl transition-all duration-500 border border-pink-100">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Build Lasting Habits</h3>
              <p className="text-gray-600 leading-relaxed">
                Consistent daily practice helps build lasting positive habits and improves mental wellness over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Backed by Science, Designed for You
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Our activities are crafted using the latest research in positive psychology, cognitive behavioral therapy, and mindfulness practices.
              </p>
              <div className="space-y-4">
                {[
                  "Gratitude exercises to boost happiness",
                  "Mindfulness practices for stress reduction",
                  "Cognitive reframing techniques",
                  "Self-compassion building activities"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
                  <div className="text-white text-lg font-semibold mb-2">Today's Activity</div>
                  <div className="text-white/90 text-sm leading-relaxed">
                    "Take 5 minutes to write down three things you're grateful for today. Notice how this simple practice shifts your focus to the positive."
                  </div>
                  <div className="mt-4 flex items-center space-x-2 text-white/70 text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>Day 127 of 500</span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-pink-400 to-orange-400 rounded-2xl -z-10 opacity-50 blur-xl"></div>
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-2xl -z-10 opacity-50 blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">
              Choose how you'd like to receive your daily activities
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-3xl border-2 border-gray-200 hover:border-indigo-300 transition-all duration-300 hover:shadow-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Email Only</h3>
              <div className="flex items-baseline mb-6">
                <span className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">$9.99</span>
                <span className="text-xl text-gray-600 ml-2">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  "Daily email activities",
                  "500+ activities library",
                  "Cancel anytime",
                  "Email support"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <div className="w-5 h-5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to="/signup?plan=email" className="block w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center py-4 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold text-lg">
                Get Started
              </Link>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
              <div className="relative">
                <div className="inline-flex items-center space-x-2 bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                  <Sparkles className="w-4 h-4" />
                  <span>Most Popular</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Email + SMS</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-5xl font-bold text-white">$14.99</span>
                  <span className="text-xl text-white/80 ml-2">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {[
                    "Daily email AND text",
                    "500+ activities library",
                    "Cancel anytime",
                    "Priority support",
                    "SMS reminders"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center text-white">
                      <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <Check className="w-3 h-3 text-indigo-600" />
                      </div>
                      <span className="font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/signup?plan=both" className="block w-full bg-white text-indigo-600 text-center py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold text-lg shadow-lg">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            <div className="relative">
              <Heart className="w-16 h-16 text-white mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Start Your Wellness Journey Today</h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of people who are transforming their mental wellness, one day at a time.
              </p>
              <Link to="/signup" className="inline-flex items-center space-x-2 bg-white text-indigo-600 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold text-lg shadow-lg">
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Daily Positivity</span>
            </div>
            <div className="flex items-center space-x-6 text-gray-400 text-sm">
              <a href="#" className="hover:text-white transition">Privacy</a>
              <a href="#" className="hover:text-white transition">Terms</a>
              <a href="#" className="hover:text-white transition">Contact</a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">© 2024 Daily Positivity. All rights reserved. Built with care for your mental wellness.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
