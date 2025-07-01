"use client"

import { createContext, useContext, useState, ReactNode } from 'react'

interface ModalContextType {
  showLoginModal: boolean
  showTokenModal: boolean
  setShowLoginModal: (show: boolean) => void
  setShowTokenModal: (show: boolean) => void
  handleShowLoginModal: () => void
  handleShowTokenModal: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: ReactNode }) {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showTokenModal, setShowTokenModal] = useState(false)

  const handleShowLoginModal = () => {
    setShowLoginModal(true)
  }

  const handleShowTokenModal = () => {
    setShowTokenModal(true)
  }

  return (
    <ModalContext.Provider value={{
      showLoginModal,
      showTokenModal,
      setShowLoginModal,
      setShowTokenModal,
      handleShowLoginModal,
      handleShowTokenModal
    }}>
      {children}
    </ModalContext.Provider>
  )
}

export function useModal() {
  const context = useContext(ModalContext)
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
}