import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { authService } from '../services'

const AuthContext = createContext()

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
}

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null
      }
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      }
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      }
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
        error: null
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    
    if (token && user) {
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          token,
          user: JSON.parse(user)
        }
      })
    } else {
      dispatch({ type: 'AUTH_FAILURE', payload: null })
    }
  }, [])

  const login = async (email, password) => {
    try {
      dispatch({ type: 'AUTH_START' })
      const response = await authService.login(email, password)
      
      if (response.success) {
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))
        
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            token: response.token,
            user: response.user
          }
        })
        return { success: true }
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: response.message })
        return { success: false, message: response.message }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      dispatch({ type: 'AUTH_FAILURE', payload: message })
      return { success: false, message }
    }
  }

  const register = async (userData) => {
    try {
      dispatch({ type: 'AUTH_START' })
      const response = await authService.register(userData)
      
      if (response.success) {
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))
        
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            token: response.token,
            user: response.user
          }
        })
        return { success: true }
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: response.message })
        return { success: false, message: response.message }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      dispatch({ type: 'AUTH_FAILURE', payload: message })
      return { success: false, message }
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      dispatch({ type: 'LOGOUT' })
    }
  }

  const updateProfile = async (userData) => {
    try {
      const response = await authService.updateProfile(userData)
      if (response.success) {
        localStorage.setItem('user', JSON.stringify(response.user))
        dispatch({ type: 'UPDATE_USER', payload: response.user })
        return { success: true }
      }
      return { success: false, message: response.message }
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed'
      return { success: false, message }
    }
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const isAdmin = () => {
    return state.user?.role === 'admin'
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    clearError,
    isAdmin
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}



