import api from './api'

// Auth Services
export const authService = {
  login: async (email, password) => {
    try {
      console.log('Frontend: Attempting login with:', { email, password: password ? '***' : 'missing' });
      const response = await api.post('/users/login', { email, password });
      console.log('Frontend: Login response:', response.data);
      
      return {
        success: response.data.success,
        token: response.data.token,
        user: response.data.data,
        message: response.data.message
      }
    } catch (error) {
      console.error('Frontend: Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      }
    }
  },
  
  register: async (userData) => {
    const response = await api.post('/users/register', userData)
    return {
      success: response.data.success,
      token: response.data.token,
      user: response.data.data,
      message: response.data.message
    }
  },
  
  logout: async () => {
    const response = await api.get('/users/logout')
    return response.data
  },
  
  getMe: async () => {
    const response = await api.get('/users/me')
    return response.data
  },
  
  getProfile: async () => {
    const response = await api.get('/users/profile')
    return response.data
  },
  
  updateProfile: async (userData) => {
    const response = await api.put('/users/me', userData)
    return response.data
  },
  
  deleteAccount: async () => {
    const response = await api.delete('/users/me')
    return response.data
  }
}

// Product Services
export const productService = {
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params })
    return response.data
  },
  
  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`)
    return response.data
  },
  
  getCategories: async () => {
    const response = await api.get('/products/categories')
    return response.data
  },
  
  getLowStock: async () => {
    const response = await api.get('/products/low-stock')
    return response.data
  },
  
  createProduct: async (productData) => {
    const response = await api.post('/products', productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },
  
  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },
  
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`)
    return response.data
  },
  
  updateStock: async (id, stockData) => {
    const response = await api.patch(`/products/${id}/stock`, stockData)
    return response.data
  }
}

// Quotation Services
export const quotationService = {
  createQuotation: async (quotationData) => {
    const response = await api.post('/quotations', quotationData)
    return response.data
  },
  
  getQuotations: async () => {
    const response = await api.get('/quotations')
    return response.data
  },
  
  getMyQuotations: async () => {
    const response = await api.get('/quotations/my-quotations')
    return response.data
  },
  
  getQuotation: async (id) => {
    const response = await api.get(`/quotations/${id}`)
    return response.data
  },
  
  getQuotationStats: async () => {
    const response = await api.get('/quotations/stats')
    return response.data
  },
  
  getQuotationsByStatus: async (status) => {
    const response = await api.get(`/quotations/status/${status}`)
    return response.data
  },
  
  updateQuotationStatus: async (id, status) => {
    const response = await api.patch(`/quotations/${id}/status`, { status })
    return response.data
  },
  
  deleteQuotation: async (id) => {
    const response = await api.delete(`/quotations/${id}`)
    return response.data
  }
}

// Reservation Services
export const reservationService = {
  createReservation: async (reservationData) => {
    const response = await api.post('/reservations', reservationData)
    return response.data
  },
  
  getReservations: async () => {
    const response = await api.get('/reservations')
    return response.data
  },
  
  getMyReservations: async () => {
    const response = await api.get('/reservations/my-reservations')
    return response.data
  },
  
  getReservation: async (id) => {
    const response = await api.get(`/reservations/${id}`)
    return response.data
  },
  
  updateReservation: async (id, reservationData) => {
    const response = await api.put(`/reservations/${id}`, reservationData)
    return response.data
  },
  
  updateReservationStatus: async (id, status) => {
    const response = await api.patch(`/reservations/${id}/status`, { status })
    return response.data
  },
  
  deleteReservation: async (id) => {
    const response = await api.delete(`/reservations/${id}`)
    return response.data
  }
}

// User Management Services (Admin only)
export const userService = {
  getUsers: async () => {
    const response = await api.get('/users')
    return response.data
  },
  
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData)
    return response.data
  },
  
  updateProfile: async (userData) => {
    const response = await api.put('/users/me', userData)
    return response.data
  },
  
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`)
    return response.data
  }
}

// Supplier Management Services (Admin only)
export const supplierService = {
  createSupplier: async (supplierData) => {
    try {
      const response = await api.post('/suppliers', supplierData)
      return response.data
    } catch (error) {
      console.error('Error creating supplier:', error)
      throw error
    }
  },

  getSuppliers: async (page = 1, limit = 10, isActive) => {
    try {
      const params = new URLSearchParams({ page, limit })
      if (isActive !== undefined) params.append('isActive', isActive)
      const response = await api.get(`/suppliers?${params}`)
      return response.data
    } catch (error) {
      console.error('Error fetching suppliers:', error)
      throw error
    }
  },

  getSupplier: async (id) => {
    try {
      const response = await api.get(`/suppliers/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching supplier:', error)
      throw error
    }
  },

  updateSupplier: async (id, supplierData) => {
    try {
      const response = await api.put(`/suppliers/${id}`, supplierData)
      return response.data
    } catch (error) {
      console.error('Error updating supplier:', error)
      throw error
    }
  },

  deleteSupplier: async (id) => {
    try {
      const response = await api.delete(`/suppliers/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting supplier:', error)
      throw error
    }
  },

  getExpiredAgreements: async () => {
    try {
      const response = await api.get('/suppliers/expired-agreements')
      return response.data
    } catch (error) {
      console.error('Error fetching expired agreements:', error)
      throw error
    }
  },

  notifyLowStock: async (supplierId) => {
    try {
      const response = await api.post(`/suppliers/${supplierId}/notify-low-stock`)
      return response.data
    } catch (error) {
      console.error('Error notifying supplier:', error)
      throw error
    }
  }
}
