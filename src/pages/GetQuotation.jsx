import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { quotationService, productService } from '../services'

const GetQuotation = () => {
  const { user, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    name: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phoneNumber || '',
    company: '',
    address: '',
    notes: '',
    items: []
  })

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await productService.getProducts()
      setProducts(response.products || response.data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const fetchCategories = async () => {
    // Use hardcoded categories to ensure all categories are available
    // even if they don't have products in the database yet
    const allCategories = [
      'Building',
      'Plumbing', 
      'Electrical',
      'Painting',
      'Safety',
      'Gardening',
      'Hand Tools',
      'Power Tools',
      'Roofing',
      'Others'
    ]
    setCategories(allCategories)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { 
        category: '', 
        product: '', 
        quantity: 1, 
        price: 0,
        productId: null
      }]
    }))
  }

  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  const updateItem = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => {
        if (i === index) {
          const updatedItem = { ...item, [field]: value }
          
          // If category changed, reset product and price
          if (field === 'category') {
            updatedItem.product = ''
            updatedItem.price = 0
            updatedItem.productId = null
          }
          
          // If product changed, update price
          if (field === 'product') {
            const selectedProduct = products.find(p => p._id === value)
            if (selectedProduct) {
              updatedItem.price = selectedProduct.price
              updatedItem.productId = selectedProduct._id
            }
          }
          
          return updatedItem
        }
        return item
      })
    }))
  }

  const getFilteredProducts = (category) => {
    return products.filter(product => 
      product.isActive && product.category === category
    )
  }

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      alert('Please login to submit a quotation request')
      return
    }

    try {
      setLoading(true)
      
      // Filter out empty items
      const validItems = formData.items.filter(item => 
        item.product.trim() !== '' && item.category.trim() !== ''
      )
      
      const quotationData = {
        ...formData,
        items: validItems,
        totalAmount: calculateTotal(),
        createdBy: user._id
      }

      const result = await quotationService.createQuotation(quotationData)
      
      if (result.success) {
        alert('Quotation request submitted successfully! We will contact you soon.')
        // Reset form
        setFormData({
          name: user?.fullName || '',
          email: user?.email || '',
          phone: user?.phoneNumber || '',
          company: '',
          address: '',
          notes: '',
          items: []
        })
      } else {
        alert('Failed to submit quotation request. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting quotation:', error)
      alert('Error submitting quotation request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Request a Custom Quote</h1>
        <p className="text-gray-600 text-lg">
          Get competitive pricing for your hardware needs. Select products and quantities below.
        </p>
      </div>

      {/* Login Notice */}
      {!isAuthenticated && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Please login</strong> to submit a quotation request. This helps us provide better service and track your requests.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quotation Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-2">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                className="input-field"
                placeholder="Enter your complete address"
              />
            </div>
          </div>

          {/* Product Selection */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">Product Selection</h3>
              <button
                type="button"
                onClick={addItem}
                className="btn-primary"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Product
              </button>
            </div>

            {formData.items.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <h4 className="text-lg font-medium text-gray-900 mb-2">No products selected</h4>
                <p className="text-gray-600 mb-4">Click "Add Product" to start building your quotation</p>
              </div>
            ) : (
              <div className="space-y-6">
                {formData.items.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">Product {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                        <select
                          value={item.category}
                          onChange={(e) => updateItem(index, 'category', e.target.value)}
                          className="input-field"
                          required
                        >
                          <option value="">Select Category</option>
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product *</label>
                        <select
                          value={item.product}
                          onChange={(e) => updateItem(index, 'product', e.target.value)}
                          className="input-field"
                          required
                          disabled={!item.category}
                        >
                          <option value="">Select Product</option>
                          {getFilteredProducts(item.category).length > 0 ? (
                            getFilteredProducts(item.category).map((product) => (
                              <option key={product._id} value={product._id}>
                                {product.name} - Rs. {product.price}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>
                              No products available in this category
                            </option>
                          )}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                          className="input-field"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Unit Price</label>
                        <div className="input-field bg-gray-100 text-gray-600">
                          Rs. {item.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    
                    {item.product && (
                      <div className="mt-4 p-3 bg-white rounded border">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Subtotal:</span>
                          <span className="font-semibold text-lg text-primary-600">
                            Rs. {(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Total Calculation */}
          {formData.items.length > 0 && (
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-primary-900">Total Amount</h3>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary-600">
                    Rs. {calculateTotal().toFixed(2)}
                  </div>
                  <div className="text-sm text-primary-700">
                    {formData.items.length} item{formData.items.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Additional Notes */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-2">Additional Information</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes & Requirements</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                className="input-field"
                placeholder="Please provide any additional details, specifications, or requirements for your quotation request..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !isAuthenticated || formData.items.length === 0}
              className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Quotation Request'}
            </button>
          </div>
        </form>
      </div>

      {/* Information Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">What happens next?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center mr-3 mt-0.5">
              <span className="text-blue-800 font-semibold text-xs">1</span>
            </div>
            <div>
              <strong>Review</strong><br />
              We'll review your requirements and confirm availability
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center mr-3 mt-0.5">
              <span className="text-blue-800 font-semibold text-xs">2</span>
            </div>
            <div>
              <strong>Quote</strong><br />
              We'll prepare a detailed quotation with final pricing
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center mr-3 mt-0.5">
              <span className="text-blue-800 font-semibold text-xs">3</span>
            </div>
            <div>
              <strong>Contact</strong><br />
              We'll contact you within 24 hours with your quote
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GetQuotation