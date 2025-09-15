import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { quotationService } from '../services'

const MyQuotations = () => {
  const { user } = useAuth()
  const [quotations, setQuotations] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedQuotation, setSelectedQuotation] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  useEffect(() => {
    if (user) {
      fetchMyQuotations()
    }
  }, [user])

  const fetchMyQuotations = async () => {
    try {
      setLoading(true)
      console.log('Fetching quotations for user:', user?._id)
      const response = await quotationService.getMyQuotations()
      console.log('MyQuotations response:', response)
      console.log('Response data structure:', {
        data: response.data,
        quotations: response.quotations,
        success: response.success
      })
      
      // Try different possible data structures
      let quotations = []
      if (response.data?.quotations) {
        quotations = response.data.quotations
      } else if (response.quotations) {
        quotations = response.quotations
      } else if (Array.isArray(response.data)) {
        quotations = response.data
      } else if (Array.isArray(response)) {
        quotations = response
      }
      
      console.log('Final quotations array:', quotations)
      setQuotations(quotations)
    } catch (error) {
      console.error('Error fetching my quotations:', error)
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (quotation) => {
    setSelectedQuotation(quotation)
    setShowDetailsModal(true)
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { 
        color: 'text-yellow-600 bg-yellow-100 border-yellow-200', 
        label: 'Pending', 
        icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>,
        description: 'Your quotation is being reviewed'
      },
      processing: { 
        color: 'text-blue-600 bg-blue-100 border-blue-200', 
        label: 'Processing', 
        icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>,
        description: 'Your quotation is being processed'
      },
      approved: { 
        color: 'text-green-600 bg-green-100 border-green-200', 
        label: 'Approved', 
        icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>,
        description: 'Your quotation has been approved'
      },
      rejected: { 
        color: 'text-red-600 bg-red-100 border-red-200', 
        label: 'Rejected', 
        icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>,
        description: 'Your quotation has been rejected'
      },
      completed: { 
        color: 'text-purple-600 bg-purple-100 border-purple-200', 
        label: 'Completed', 
        icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>,
        description: 'Your quotation has been completed'
      }
    }
    
    const config = statusConfig[status] || { 
      color: 'text-gray-600 bg-gray-100 border-gray-200', 
      label: status, 
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>,
      description: 'Unknown status'
    }
    
    return (
      <div className={`inline-flex items-center px-3 py-2 text-sm font-semibold rounded-lg border ${config.color}`}>
        <span className="mr-2 text-lg">{config.icon}</span>
        <div>
          <div className="font-semibold">{config.label}</div>
          <div className="text-xs opacity-75">{config.description}</div>
        </div>
      </div>
    )
  }

  const getStatusCounts = () => {
    return {
      total: quotations.length,
      pending: quotations.filter(q => q.status === 'pending').length,
      processing: quotations.filter(q => q.status === 'processing').length,
      rejected: quotations.filter(q => q.status === 'rejected').length,
      completed: quotations.filter(q => q.status === 'completed').length
    }
  }

  const statusCounts = getStatusCounts()

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your quotations</h2>
          <a href="/login" className="btn btn-primary">Go to Login</a>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Quotations</h1>
                <p className="mt-2 text-gray-600">Track the status of your quotation requests</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="text-lg font-semibold text-gray-900">{user.fullName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="text-3xl font-bold text-gray-900">{statusCounts.total}</div>
            <div className="text-sm text-gray-600">Total Quotations</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="text-3xl font-bold text-yellow-600">{statusCounts.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="text-3xl font-bold text-blue-600">{statusCounts.processing}</div>
            <div className="text-sm text-gray-600">Processing</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="text-3xl font-bold text-red-600">{statusCounts.rejected}</div>
            <div className="text-sm text-gray-600">Rejected</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="text-3xl font-bold text-purple-600">{statusCounts.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
        </div>

        {/* Quotations Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Quotation History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quotation ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quotations.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="text-gray-500 text-lg">No quotations found</div>
                      <div className="text-gray-400 text-sm mt-2">You haven't requested any quotations yet</div>
                      <div className="text-xs text-gray-300 mt-2">Debug: User ID: {user?._id}</div>
                      <a href="/get-quotation" className="btn btn-primary mt-4">Request a Quotation</a>
                    </td>
                  </tr>
                ) : (
                  quotations.map((quotation) => (
                    <tr key={quotation._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            #{quotation._id.slice(-8).toUpperCase()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {quotation.items?.length || 0} items
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(quotation.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="font-semibold text-lg">
                          Rs. {quotation.totalAmount || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div>{new Date(quotation.createdAt).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(quotation.createdAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewDetails(quotation)}
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-6 py-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a href="/get-quotation" className="btn btn-outline-primary text-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Request New Quote
              </a>
              <a href="/book-reservation" className="btn btn-outline-primary text-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Book Reservation
              </a>
              <a href="/shop" className="btn btn-outline-primary text-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Browse Products
              </a>
            </div>
          </div>
        </div>

        {/* Quotation Details Modal */}
        {showDetailsModal && selectedQuotation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Quotation Details</h2>
                    <p className="text-gray-600">Quotation ID: #{selectedQuotation._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Customer Information */}
                  <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-gray-700">Name:</span>
                        <span className="ml-2 text-gray-900">{selectedQuotation.name}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Email:</span>
                        <span className="ml-2 text-gray-900">{selectedQuotation.email}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Phone:</span>
                        <span className="ml-2 text-gray-900">{selectedQuotation.phone}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Address:</span>
                        <span className="ml-2 text-gray-900">{selectedQuotation.address || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quotation Status */}
                  <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quotation Status</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-gray-700">Status:</span>
                        <div className="mt-2">{getStatusBadge(selectedQuotation.status)}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Total Amount:</span>
                        <span className="ml-2 text-gray-900 font-semibold text-lg">Rs. {selectedQuotation.totalAmount || 0}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Requested:</span>
                        <span className="ml-2 text-gray-900">{new Date(selectedQuotation.createdAt).toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Last Updated:</span>
                        <span className="ml-2 text-gray-900">{new Date(selectedQuotation.updatedAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items */}
                {selectedQuotation.items && selectedQuotation.items.length > 0 && (
                  <div className="mt-6">
                    <div className="card">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Requested Items</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {selectedQuotation.items.map((item, index) => (
                              <tr key={index}>
                                <td className="px-4 py-2 text-sm text-gray-900">{item.product}</td>
                                <td className="px-4 py-2 text-sm text-gray-500">{item.category}</td>
                                <td className="px-4 py-2 text-sm text-gray-900">{item.quantity}</td>
                                <td className="px-4 py-2 text-sm text-gray-900">Rs. {item.price}</td>
                                <td className="px-4 py-2 text-sm text-gray-900 font-semibold">Rs. {item.subtotal}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedQuotation.notes && (
                  <div className="mt-6">
                    <div className="card">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h3>
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedQuotation.notes}</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="btn-outline"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyQuotations
