import React, { useState, useRef, useEffect } from 'react'
import { Plus, X, FileImage, Loader2 } from 'lucide-react'

import sendIcon from '../../../assets/send.svg'

const ChatInput = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)

  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height to allow shrinking
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }

  // Adjust height whenever text changes (especially for clearing the input)
  useEffect(() => {
    adjustHeight();
  }, [text]);

  const handleAttachmentClick = () => {
    setIsMenuOpen(prev => !prev)
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
    setIsMenuOpen(false)
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(URL.createObjectURL(file))
      setIsUploading(true)
      // Simulate an upload process
      setTimeout(() => setIsUploading(false), 1500)
    }
    // reset input value so the same file can be selected again if needed
    if (e.target) e.target.value = ''
  }

  const removeImage = (e) => {
    if (e) e.stopPropagation()
    setSelectedImage(null)
    setIsUploading(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.currentTarget.contains(e.relatedTarget)) return
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(URL.createObjectURL(file))
      setIsUploading(true)
      setTimeout(() => setIsUploading(false), 1500)
    }
  }

  const handleSubmit = (e) => {
    if (e) e.preventDefault()
    if ((!text.trim() && !selectedImage) || isUploading || isLoading) return

    onSendMessage(text, selectedImage)
    setText('')
    removeImage()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!isLoading && !isUploading) {
        handleSubmit()
      }
    }
  }

  const handleImageClick = () => {
    if (!isUploading) {
      setIsFullScreen(true)
    }
  }

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMenuOpen && !e.target.closest('.attachment-menu-container')) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMenuOpen])

  return (
    <>
      {isFullScreen && selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <button 
            type="button"
            onClick={() => setIsFullScreen(false)}
            className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors bg-black/40 hover:bg-black/60 rounded-full p-2"
          >
            <X className="w-8 h-8" />
          </button>
          <img src={selectedImage} alt="Full screen preview" className="max-w-[90%] max-h-[90%] object-contain" />
        </div>
      )}

      <form onSubmit={handleSubmit}
        className='w-full max-w-3xl mx-auto mb-6 px-4 flex-shrink-0 flex flex-col'
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className='relative flex flex-col bg-bg-card dark:bg-[#161722] border border-border dark:border-[#2D3042] rounded-2xl px-4 py-2.5 focus-within:border-text-muted transition-all duration-200'>
          
          {isDragging && (
            <div className="absolute inset-0 z-50 rounded-2xl bg-bg-card/80 dark:bg-[#161722]/80 backdrop-blur-sm border-2 border-dashed border-text-primary/50 flex flex-col items-center justify-center pointer-events-none transition-all duration-200">
              <svg className="w-8 h-8 mb-2 text-text-primary/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span className="text-text-primary font-medium text-sm">Drop files here</span>
            </div>
          )}

          {selectedImage && (
            <div 
              className="relative inline-block mb-2 ml-1 w-16 h-16 group self-start cursor-pointer"
              onClick={handleImageClick}
            >
              <img src={selectedImage} alt="Selected preview" className="w-full h-full object-cover rounded-xl border border-border dark:border-[#2D3042]" />
              
              {isUploading && (
                <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}

              {!isUploading && (
                <button 
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-text-primary/80 hover:bg-text-primary text-bg-card rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove image"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          <div className="flex items-end">
            <div className="relative mb-0.5 mr-2 attachment-menu-container">
              <button
                type="button"
                onClick={handleAttachmentClick}
                className="py-2 px-2 rounded-lg text-text-primary/70 hover:text-text-primary transition-colors hover:bg-text-primary/10 flex-shrink-0"
                aria-label="Attach file"
              >
                <Plus className={`w-5 h-5 transition-transform duration-300 ${isMenuOpen ? 'rotate-45' : ''}`} />
              </button>
              
              {isMenuOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-36 bg-bg-card dark:bg-[#161722] border border-border dark:border-[#2D3042] rounded-xl shadow-lg overflow-hidden z-50">
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-text-primary hover:bg-text-primary/10 transition-colors text-left"
                  >
                    <FileImage className="w-4 h-4 text-text-primary/70" />
                    <span>Upload file</span>
                  </button>
                </div>
              )}
            </div>
            
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden" 
            />

            <textarea
              ref={textareaRef}
              rows={1}
              placeholder='Ask me what you want'
              value={text}
              disabled={isLoading}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              className='flex-1 bg-transparent text-text-primary text-[15px] outline-none placeholder:text-text-muted/60 resize-none max-h-60 overflow-y-auto omnimind-scrollbar py-1.5 leading-relaxed disabled:opacity-50'
              style={{ minHeight: '24px' }}
            />

            <button
              type="submit"
              disabled={(!text.trim() && !selectedImage) || isUploading || isLoading}
              className={`py-2 px-2 ml-2 rounded-lg transition-all duration-200 mb-0.5 ${((text.trim() || selectedImage) && !isUploading && !isLoading) ? 'bg-text-primary/10 cursor-pointer opacity-100 hover:bg-text-primary/20' : 'opacity-40 cursor-not-allowed'
                }`}
            >
              <img src={sendIcon} alt="send"
                className='w-4 h-4 dark:invert' />
            </button>
          </div>
        </div>
        <span className='flex items-center justify-center text-text-primary/60 text-[12px] mt-3'>OmniMind AI can make mistakes. Check important info.</span>

      </form>
    </>
  )
}

export default ChatInput