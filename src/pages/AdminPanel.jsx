import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { productService, quotationService, reservationService, userService, supplierService } from '../services'

const AdminPanel = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalQuotations: 0,
    totalReservations: 0,
    totalSuppliers: 0,
    lowStockProducts: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      
      // Fetch all stats in parallel
      const [products, users, quotations, reservations, suppliers, lowStock] = await Promise.all([
        productService.getProducts(),
        userService.getUsers(),
        quotationService.getQuotations(),
        reservationService.getReservations(),
        supplierService.getSuppliers(),
        productService.getLowStock()
      ])

      console.log('Dashboard stats data:', {
        products: products,
        users: users,
        quotations: quotations,
        reservations: reservations,
        suppliers: suppliers,
        lowStock: lowStock
      })

      setStats({
        totalProducts: products.products?.length || products.data?.length || 0,
        totalUsers: users.users?.length || users.data?.length || 0,
        totalQuotations: quotations.data?.quotations?.length || quotations.quotations?.length || quotations.data?.length || quotations.length || 0,
        totalReservations: reservations.reservations?.length || reservations.data?.length || 0,
        totalSuppliers: suppliers.data?.length || suppliers.suppliers?.length || 0,
        lowStockProducts: lowStock.products?.length || lowStock.data?.length || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, icon, color, link }) => (
    <Link to={link} className="block">
      <div className={`card p-6 hover:shadow-lg transition-shadow ${color}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{loading ? '...' : value}</p>
          </div>
          <div className="text-3xl">{icon}</div>
        </div>
      </div>
    </Link>
  )

  const QuickActionCard = ({ title, description, icon, link, color }) => (
    <Link to={link} className="block">
      <div className={`card p-6 hover:shadow-lg transition-shadow ${color}`}>
        <div className="flex items-center space-x-4">
          <div className="text-3xl">{icon}</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <span className="text-primary-800 font-bold text-xl">
              {user?.fullName?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-bold">Welcome Admin</h1>
            <p className="text-primary-100">Manage your hardware store efficiently</p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon={<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l-8 4v14h16V6l-8-4zM4 6l8-4 8 4v12H4V6z"/><path d="M8 8h2v2H8V8zm4 0h2v2h-2V8zm4 0h2v2h-2V8zM8 12h2v2H8v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z"/></svg>}
            color="bg-blue-50 hover:bg-blue-100"
            link="/admin/products"
          />
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M16 7c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4zm-4 6c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4z"/></svg>}
            color="bg-green-50 hover:bg-green-100"
            link="/admin/users"
          />
          <StatCard
            title="Quotations"
            value={stats.totalQuotations}
            icon={<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>}
            color="bg-yellow-50 hover:bg-yellow-100"
            link="/admin/quotations"
          />
          <StatCard
            title="Reservations"
            value={stats.totalReservations}
            icon={<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>}
            color="bg-purple-50 hover:bg-purple-100"
            link="/admin/reservations"
          />
          <StatCard
            title="Suppliers"
            value={stats.totalSuppliers}
            icon={<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/><path d="M8 8h8v2H8V8zm0 4h8v2H8v-2zm0 4h6v2H8v-2z"/></svg>}
            color="bg-indigo-50 hover:bg-indigo-100"
            link="/admin/suppliers"
          />
          <StatCard
            title="Low Stock"
            value={stats.lowStockProducts}
            icon={<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>}
            color="bg-red-50 hover:bg-red-100"
            link="/admin/products"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <QuickActionCard
            title="Product Management"
            description="Add, edit, or remove products from your inventory"
            icon={<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/></svg>}
            color="bg-blue-50 hover:bg-blue-100"
            link="/admin/products"
          />
          <QuickActionCard
            title="User Management"
            description="Manage customer accounts and admin access"
            icon={<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M16 7c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4zm-4 6c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4z"/></svg>}
            color="bg-green-50 hover:bg-green-100"
            link="/admin/users"
          />
          <QuickActionCard
            title="Quotation Management"
            description="Review and process customer quotations"
            icon={<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>}
            color="bg-yellow-50 hover:bg-yellow-100"
            link="/admin/quotations"
          />
          <QuickActionCard
            title="Reservation Management"
            description="Handle customer reservations and bookings"
            icon={<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>}
            color="bg-purple-50 hover:bg-purple-100"
            link="/admin/reservations"
          />
          <QuickActionCard
            title="Supplier Management"
            description="Manage suppliers and agreements"
            icon={<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/><path d="M8 8h8v2H8V8zm0 4h8v2H8v-2zm0 4h6v2H8v-2z"/></svg>}
            color="bg-indigo-50 hover:bg-indigo-100"
            link="/admin/suppliers"
          />
          <QuickActionCard
            title="Back to Home"
            description="Return to the main website"
            icon={<svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>}
            color="bg-gray-50 hover:bg-gray-100"
            link="/"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="card p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l-8 4v14h16V6l-8-4zM4 6l8-4 8 4v12H4V6z"/><path d="M8 8h2v2H8V8zm4 0h2v2h-2V8zm4 0h2v2h-2V8zM8 12h2v2H8v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z"/></svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New product added</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24"><path d="M16 7c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4zm-4 6c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4z"/></svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New user registered</p>
                <p className="text-xs text-gray-500">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New quotation received</p>
                <p className="text-xs text-gray-500">6 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
