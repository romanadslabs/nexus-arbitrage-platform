'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { X, Paperclip, Send, UserPlus } from 'lucide-react'
import { useData } from '@/components/providers/DataProvider'
import { Account, Comment, StatusChangeEvent } from '@/components/providers/DataProvider'
import { useAuth } from '@/components/providers/AuthProvider'

interface AccountModalProps {
  isOpen: boolean
  onClose: () => void
  account: Account | null
  statuses: Record<string, { label: string; color: string }>
}

export default function AccountModal({ isOpen, onClose, account, statuses }: AccountModalProps) {
  const { createAccount, updateAccount, addCommentToAccount, assignFarmerToAccount } = useData()
  const { user } = useAuth()
  const [formData, setFormData] = useState<Partial<Account>>({})
  const [newComment, setNewComment] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (account) {
      setFormData(account)
    } else {
      setFormData({
        name: '', email: '', phone: '', platform: 'Facebook',
        status: 'ready_for_farm', trafficType: 'paid', priority: 'medium',
        tags: [], comments: [], twoFactorCode: '', cookieData: ''
      })
    }
  }, [account, isOpen])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, cookieData: event.target?.result as string }))
      }
      reader.readAsText(file)
    }
  }

  const handleDownloadCookie = () => {
    if (!formData.cookieData) return;
    const blob = new Blob([formData.cookieData], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${formData.name}_cookies.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
  
  const handleAssignToMe = async () => {
    if (account && user) {
      await assignFarmerToAccount(account.id, user.id);
      setFormData(prev => ({ ...prev, farmerId: user.id }));
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim() || !account) return;
    await addCommentToAccount(account.id, newComment);
    setNewComment('');
    // Refresh form data to show new comment
    setFormData(prev => ({
        ...prev,
        comments: [...(prev.comments || []), {id: '', text: newComment, authorId: user!.id, authorName: user!.name, createdAt: new Date()}]
    }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (account) {
      await updateAccount(account.id, formData)
    } else {
      await createAccount(formData as any)
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">{account ? 'Редагувати' : 'Створити'} акаунт</h2>
          <button onClick={onClose}><X /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Main fields */}
          <div className="grid grid-cols-2 gap-4">
            <div><label>Назва</label><input name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Назва" className="w-full p-2 border rounded" /></div>
            <div><label>Email</label><input name="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="Email" className="w-full p-2 border rounded" /></div>
            <div><label>Телефон</label><input name="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="Телефон" className="w-full p-2 border rounded" /></div>
            <div><label>Платформа</label><select name="platform" value={formData.platform} onChange={(e) => setFormData({...formData, platform: e.target.value})} className="w-full p-2 border rounded">
              <option value="Facebook">Facebook</option><option value="Google">Google</option><option value="TikTok">TikTok</option>
            </select></div>
            <div><label>Статус</label><select name="status" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full p-2 border rounded">
              {Object.entries(statuses).map(([key, { label }]) => ( <option key={key} value={key}>{label}</option> ))}
            </select></div>
            <div><label>Тип трафіку</label><select name="trafficType" value={formData.trafficType} onChange={(e) => setFormData({...formData, trafficType: e.target.value as any})} className="w-full p-2 border rounded">
                <option value="paid">Платний</option><option value="organic">УБТ</option>
            </select></div>
            <div><label>Пріоритет</label><select name="priority" value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})} className="w-full p-2 border rounded">
              <option value="low">Низький</option><option value="medium">Середній</option><option value="high">Високий</option><option value="urgent">Терміновий</option>
            </select></div>
          </div>
          {/* 2FA */}
          <div><label>Коди 2FA</label><textarea name="twoFactorCode" value={formData.twoFactorCode} onChange={(e) => setFormData({...formData, twoFactorCode: e.target.value})} placeholder="Коди 2FA" rows={3} className="w-full p-2 border rounded" /></div>
          {/* Tags */}
          <div><label>Теги</label><input name="tags" value={formData.tags?.join(', ')} onChange={(e) => setFormData({...formData, tags: e.target.value.split(',').map(t => t.trim())})} placeholder="Теги (через кому)" className="w-full p-2 border rounded" /></div>
          {/* Cookie file */}
          <div>
            <label>Cookie-файл</label>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 border rounded flex items-center gap-2"><Paperclip size={16} />{formData.cookieData ? 'Змінити' : 'Завантажити'}</button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".json,.txt"/>
              {formData.cookieData && <button type="button" onClick={handleDownloadCookie} className="px-4 py-2 border rounded text-green-600">Вивантажити</button>}
              {formData.cookieData && <span className="text-sm text-gray-500">Файл завантажено</span>}
            </div>
          </div>

          {/* Status History */}
          {account && account.statusHistory && (
            <div>
              <label className="font-semibold">Історія статусів</label>
              <div className="mt-2 space-y-3 max-h-40 overflow-y-auto border p-2 rounded-lg bg-gray-50">
                {formData.statusHistory?.map((event: StatusChangeEvent, index: number) => (
                  <div key={index} className="text-sm">
                    <p>
                      <span className="font-semibold">{statuses[event.status]?.label || event.status}</span>
                      <span className="text-xs text-gray-500 mx-2">({event.changedBy})</span>
                      <span className="text-xs text-gray-400 font-normal">{new Date(event.changedAt).toLocaleString()}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          {account && (
            <div>
              <label className="font-semibold">Історія коментарів</label>
              <div className="mt-2 space-y-3 max-h-40 overflow-y-auto border p-2 rounded-lg bg-gray-50">
                {formData.comments?.map(comment => (
                  <div key={comment.id} className="text-sm">
                    <p className="font-semibold">{comment.authorName} <span className="text-xs text-gray-400 font-normal">{new Date(comment.createdAt).toLocaleString()}</span></p>
                    <p>{comment.text}</p>
                  </div>
                ))}
                 {formData.comments?.length === 0 && <p className="text-sm text-gray-400">Коментарів ще немає.</p>}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <input value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Ваш коментар..." className="flex-grow p-2 border rounded"/>
                <button type="button" onClick={handleAddComment} className="p-2 bg-blue-500 text-white rounded-full"><Send size={16} /></button>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-4 mt-auto">
            <div>
              {account && !account.farmerId && user?.role === 'farmer' && (
                  <button type="button" onClick={handleAssignToMe} className="px-4 py-2 border rounded flex items-center gap-2 text-sm text-green-600">
                      <UserPlus size={16} /> Взяти в роботу
                  </button>
              )}
            </div>
            <div className="flex space-x-3">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded">Скасувати</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{account ? 'Зберегти' : 'Створити'}</button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
} 