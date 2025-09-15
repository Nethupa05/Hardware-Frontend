import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { quotationService } from '../../services'

const QuotationManagement = () => {
  const [quotations, setQuotations] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedQuotation, setSelectedQuotation] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(null)
  const [deletingQuotationId, setDeletingQuotationId] = useState(null)

  useEffect(() => {
    fetchQuotations()
  }, [])

  const fetchQuotations = async () => {
    try {
      setLoading(true)
      const response = await quotationService.getQuotations()
      setQuotations(response.data?.quotations || response.quotations || response.data || [])
    } catch (error) {
      console.error('Error fetching quotations:', error)
    } finally {
      setLoading(false)
    }
  }

  const showQuotationDetails = (quotation) => {
    setSelectedQuotation(quotation)
    setShowDetailsModal(true)
  }

  const handleStatusChange = async (quotationId, newStatus) => {
    try {
      setUpdatingStatus(quotationId)
      await quotationService.updateQuotationStatus(quotationId, newStatus)
      alert(`Quotation status updated to ${newStatus} successfully!`)
      fetchQuotations() // Refresh the quotations list
    } catch (error) {
      console.error('Error updating quotation status:', error)
      alert(`Error updating quotation status: ${error.response?.data?.message || error.message}`)
    } finally {
      setUpdatingStatus(null)
    }
  }

  const handleDeleteQuotation = async (quotationId) => {
    const quotation = quotations.find(q => q._id === quotationId)
    const quotationIdShort = quotationId.slice(-8).toUpperCase()
    
    if (!window.confirm(`Are you sure you want to permanently delete quotation #${quotationIdShort}?\n\nThis action cannot be undone and will remove:\n- Customer: ${quotation?.name || 'Unknown'}\n- Email: ${quotation?.email || 'Unknown'}\n- All quotation details and items\n\nClick OK to confirm deletion.`)) {
      return
    }

    try {
      setDeletingQuotationId(quotationId)
      await quotationService.deleteQuotation(quotationId)
      alert(`Quotation #${quotationIdShort} has been permanently deleted successfully!`)
      fetchQuotations() // Refresh the quotations list
    } catch (error) {
      console.error('Error deleting quotation:', error)
      alert(`Error deleting quotation: ${error.response?.data?.message || error.message}`)
    } finally {
      setDeletingQuotationId(null)
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { 
        color: 'text-yellow-600 bg-yellow-100 border-yellow-200', 
        label: 'Pending', 
        icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
      },
      processing: { 
        color: 'text-blue-600 bg-blue-100 border-blue-200', 
        label: 'Processing', 
        icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
      },
      completed: { 
        color: 'text-green-600 bg-green-100 border-green-200', 
        label: 'Completed', 
        icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
      },
      rejected: { 
        color: 'text-red-600 bg-red-100 border-red-200', 
        label: 'Rejected', 
        icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
      }
    }
    
    const config = statusConfig[status] || { 
      color: 'text-gray-600 bg-gray-100 border-gray-200', 
      label: status, 
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
    }
    
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full border ${config.color}`}>
        <span className="mr-1">{config.icon}</span>
        {config.label}
      </span>
    )
  }

  const filteredQuotations = quotations

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quotation Management</h1>
          <p className="text-gray-600">Review and process customer quotations</p>
        </div>
        <Link to="/admin" className="btn-outline">
          ← Back to Admin
        </Link>
      </div>

      {/* Quotations Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredQuotations.map((quotation) => (
                <tr key={quotation._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{quotation.name}</div>
                      <div className="text-sm text-gray-500">{quotation.email}</div>
                      <div className="text-sm text-gray-500">{quotation.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {quotation.company || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(quotation.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(quotation.status)}
                      <select
                        value={quotation.status}
                        onChange={(e) => handleStatusChange(quotation._id, e.target.value)}
                        disabled={updatingStatus === quotation._id}
                        className="text-xs border border-gray-300 rounded px-2 py-1 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => showQuotationDetails(quotation)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleDeleteQuotation(quotation._id)}
                        disabled={deletingQuotationId === quotation._id}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingQuotationId === quotation._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredQuotations.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No quotations found</div>
          <div className="text-gray-400 text-sm">Try adjusting your filter or check back later</div>
        </div>
      )}

      {/* Quotation Details Modal */}
      {showDetailsModal && selectedQuotation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Quotation Details</h2>
                  <p className="text-gray-600">Request ID: {selectedQuotation._id.slice(-8)}</p>
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
                    {selectedQuotation.company && (
                      <div>
                        <span className="font-medium text-gray-700">Company:</span>
                        <span className="ml-2 text-gray-900">{selectedQuotation.company}</span>
                      </div>
                    )}
                    {selectedQuotation.address && (
                      <div>
                        <span className="font-medium text-gray-700">Address:</span>
                        <span className="ml-2 text-gray-900">{selectedQuotation.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quotation Information */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quotation Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>
                      <div className="mt-2">{getStatusBadge(selectedQuotation.status)}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Category:</span>
                      <span className="ml-2 text-gray-900">{selectedQuotation.productCategory || 'N/A'}</span>
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

              {/* Products Requested */}
              <div className="mt-6">
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Products Requested</h3>
                  {selectedQuotation.items && selectedQuotation.items.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Product Name
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Category
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Quantity
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Unit Price
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Subtotal
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedQuotation.items.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {item.product}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                  {item.category || 'N/A'}
                                </span>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                                  {item.quantity}
                                </span>
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                {item.price ? `Rs. ${item.price}` : 'Not specified'}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                {item.subtotal ? `Rs. ${item.subtotal}` : 'Not calculated'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500">No products specified</p>
                  )}
                </div>
              </div>

              {/* Additional Notes */}
              {selectedQuotation.notes && (
                <div className="mt-6">
                  <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedQuotation.notes}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <span className="font-medium text-gray-700">Change Status:</span>
                  <select
                    value={selectedQuotation.status}
                    onChange={(e) => handleStatusChange(selectedQuotation._id, e.target.value)}
                    disabled={updatingStatus === selectedQuotation._id}
                    className="border border-gray-300 rounded px-3 py-2 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  {updatingStatus === selectedQuotation._id && (
                    <span className="text-sm text-gray-500">Updating...</span>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleDeleteQuotation(selectedQuotation._id)}
                    disabled={deletingQuotationId === selectedQuotation._id}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingQuotationId === selectedQuotation._id ? 'Deleting...' : 'Delete Quotation'}
                  </button>
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
        </div>
      )}
    </div>
  )
}

export default QuotationManagement
