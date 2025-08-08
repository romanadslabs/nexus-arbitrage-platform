'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { X, Edit, Download, User, Calendar, MessageSquare, History, Tag, Shield, AlertTriangle, KeyRound, RotateCcw } from 'lucide-react'
import { Account } from '@/components/providers/DataProvider'
import { useData } from '@/components/providers/DataProvider'

interface AccountDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  onEdit: () => void
  account: Account | null
}

const DetailItem = ({ icon: Icon, label, value, fullWidth = false }: { icon: React.ElementType, label: string, value: React.ReactNode, fullWidth?: boolean }) => (
    <div className={fullWidth ? "col-span-2" : ""}>
        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center mb-1">
            <Icon className="w-4 h-4 mr-2" />
            <span>{label}</span>
        </dt>
        <dd className="text-sm text-gray-900 dark:text-white break-words">{value || 'N/A'}</dd>
    </div>
)

export default function AccountDetailsModal({ isOpen, onClose, onEdit, account }: AccountDetailsModalProps) {
    const { updateAccount, addCommentToAccount, accounts } = useData()
    const [comment, setComment] = useState('')
    const [twoFactorInput, setTwoFactorInput] = useState('')
    const [isSaving2FA, setIsSaving2FA] = useState(false)

    // Резервні коди вводяться вручну (8 кодів, по одному в рядку)
    const currentAcc = useMemo(() => {
      if (!account) return null
      return accounts.find(a => a.id === account.id) || account
    }, [accounts, account])

    const [backupCodesInput, setBackupCodesInput] = useState('')

    // ініціалізувати textarea з поточними кодами при відкритті
    React.useEffect(() => {
      if (currentAcc?.backupCodes && currentAcc.backupCodes.length > 0) {
        setBackupCodesInput(currentAcc.backupCodes.join('\n'))
      } else {
        setBackupCodesInput('')
      }
    }, [currentAcc?.id])

    if (!isOpen || !account || !currentAcc) return null

    const handleDownloadCookie = () => {
        if (!currentAcc.cookieData) return;
        const blob = new Blob([currentAcc.cookieData], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${currentAcc.name}_cookies.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    const mask2FA = (code?: string) => code ? code.replace(/.(?=.{4})/g, '*') : 'N/A'

    const handleSave2FA = async () => {
      if (!twoFactorInput.trim()) return
      try {
        setIsSaving2FA(true)
        await updateAccount(currentAcc.id, { twoFactorCode: twoFactorInput.trim() })
        setTwoFactorInput('')
      } finally {
        setIsSaving2FA(false)
      }
    }

    const handleSaveBackupCodes = async () => {
      const raw = backupCodesInput.split(/\r?\n|,|;|\s+/).map(s => s.trim()).filter(Boolean)
      // залишимо лише унікальні і верхній регістр для однакового вигляду
      const unique = Array.from(new Set(raw.map(s => s.toUpperCase())))
      if (unique.length !== 8) {
        alert('Потрібно ввести рівно 8 резервних кодів (по одному в рядку).')
        return
      }
      await updateAccount(currentAcc.id, { backupCodes: unique })
    }

    const handleAddComment = async () => {
      if (!comment.trim()) return
      await addCommentToAccount(currentAcc.id, comment.trim())
      setComment('')
    }

    const backupCodesList = (currentAcc.backupCodes || []).map((c, i) => (
      <code key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-900 rounded text-xs mr-2 inline-block mb-1">{c}</code>
    ))

    const statusOptions = [
      { value: 'ready_for_farm', label: 'Готовий до фарму' },
      { value: 'farming_day_1', label: 'Фарм, день 1' },
      { value: 'farming_day_2', label: 'Фарм, день 2' },
      { value: 'farming_day_3', label: 'Фарм, день 3' },
      { value: 'in_progress', label: 'В процесі' },
      { value: 'ready_for_ads', label: 'Готовий до реклами' },
      { value: 'launched', label: 'Запущено' },
      { value: 'blocked_pp', label: 'Заблоковано PP' },
      { value: 'blocked_system', label: 'Заблоковано системою' },
      { value: 'blocked_passport', label: 'Заблоковано паспорт' },
      { value: 'sold', label: 'Продано' },
      { value: 'dead', label: 'Dead' },
    ]

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-4 border-b dark:border-gray-700 shrink-0">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Деталі: {currentAcc.name}</h2>
                    <div className="flex items-center gap-3">
                      {/* Зручна зміна статусу */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Статус:</span>
                        <select
                          value={currentAcc.status}
                          onChange={(e) => updateAccount(currentAcc.id, { status: e.target.value })}
                          className="text-sm px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          {statusOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                      <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><X size={20} /></button>
                    </div>
                </header>

                <main className="p-6 overflow-y-auto space-y-6">
                    <section>
                        <h3 className="text-base font-semibold mb-3">Основна інформація</h3>
                        <dl className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6">
                            <DetailItem icon={User} label="Платформа" value={currentAcc.platform} />
                            <DetailItem icon={Shield} label="Статус" value={currentAcc.status} />
                            <DetailItem icon={AlertTriangle} label="Тип трафіку" value={currentAcc.trafficType} />
                            <DetailItem icon={User} label="Пріоритет" value={currentAcc.priority} />
                            <DetailItem icon={User} label="Відповідальний" value={currentAcc.farmerId || 'Не призначено'} />
                            <DetailItem icon={Calendar} label="Створено" value={new Date(currentAcc.createdAt).toLocaleString('uk-UA')} />
                            <DetailItem icon={Tag} label="Теги" value={currentAcc.tags?.join(', ')} />
                            {currentAcc.cookieData && (
                                <DetailItem icon={Download} label="Cookie-файл" value={
                                    <button onClick={handleDownloadCookie} className="text-blue-600 hover:underline text-sm">
                                        Завантажити
                                    </button>
                                } />
                            )}
                            <DetailItem icon={User} label="Створив" value={`${currentAcc.createdByName || '—'}`} />
                        </dl>
                    </section>
                    
                    <section>
                      <h3 className="text-base font-semibold mb-2 flex items-center"><KeyRound className="mr-2" size={18}/>Двофакторна автентифікація</h3>
                      <div className="space-y-3">
                        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-sm text-blue-900 dark:text-blue-200">
                          Введіть 8 резервних кодів Google (по одному в кожному рядку). Ці коди потрібні для відновлення доступу. Не генеруємо коди автоматично — їх надає Google у налаштуваннях 2FA. Збережіть їх у безпечному місці.
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="text-sm text-gray-600 dark:text-gray-300">Поточний 2FA: <span className="font-mono">{mask2FA(currentAcc.twoFactorCode)}</span></div>
                            <div className="flex gap-2">
                              <input value={twoFactorInput} onChange={e=> setTwoFactorInput(e.target.value)} placeholder="Введіть 2FA код (якщо є)" className="flex-1 px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                              <button onClick={handleSave2FA} disabled={isSaving2FA || !twoFactorInput.trim()} className="px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-50">{isSaving2FA ? 'Збереження...' : 'Зберегти'}</button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-gray-600 dark:text-gray-300">Резервні коди (8 шт.):</div>
                            <textarea
                              value={backupCodesInput}
                              onChange={(e) => setBackupCodesInput(e.target.value)}
                              placeholder={`Введіть по одному коду в рядку\nНапр.:\nABCD-EFGH\nIJKL-MNOP\n...`}
                              rows={6}
                              className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                            <div className="flex items-center justify-between">
                              <div className="text-xs text-gray-500">Введено: {Array.from(new Set(backupCodesInput.split(/\r?\n|,|;|\s+/).map(s=>s.trim()).filter(Boolean).map(s=>s.toUpperCase()))).length}/8</div>
                              <button onClick={handleSaveBackupCodes} className="px-3 py-2 bg-gray-800 text-white rounded">Зберегти коди</button>
                            </div>
                            <div className="text-xs text-gray-500">Збережені коди:</div>
                            <div>{backupCodesList.length ? backupCodesList : <span className="text-xs text-gray-500">Немає</span>}</div>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section>
                        <h3 className="text-base font-semibold mb-2 flex items-center"><History className="mr-2" size={18}/>Історія статусів</h3>
                        <div className="border rounded-lg p-3 max-h-48 overflow-y-auto bg-gray-50 dark:bg-gray-900/50 space-y-2 text-sm">
                            {[...(currentAcc.statusHistory || [])].reverse().map((s, i) => (
                                <p key={i}>
                                    <span className="font-medium">{s.status}</span> - <span className="text-gray-600 dark:text-gray-400">{s.changedBy}</span> о <span className="text-gray-600 dark:text-gray-400">{new Date(s.changedAt).toLocaleString('uk-UA')}</span>
                                </p>
                            ))}
                            {(!currentAcc.statusHistory || currentAcc.statusHistory.length === 0) && <p className="text-gray-500">Історія відсутня.</p>}
                        </div>
                    </section>

                    <section>
                        <h3 className="text-base font-semibold mb-2 flex items-center"><MessageSquare className="mr-2" size={18}/>Коментарі</h3>
                        <div className="border rounded-lg p-3 max-h-48 overflow-y-auto bg-gray-50 dark:bg-gray-900/50 space-y-3">
                            {[...(currentAcc.comments || [])].reverse().map(c => (
                                <div key={c.id}>
                                    <p className="text-sm font-medium">{c.authorName} <span className="text-xs font-normal text-gray-500">{new Date(c.createdAt).toLocaleString('uk-UA')}</span></p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{c.text}</p>
                                </div>
                            ))}
                            {(!currentAcc.comments || currentAcc.comments.length === 0) && <p className="text-sm text-gray-500">Коментарі відсутні.</p>}
                        </div>
                        <div className="mt-3 flex gap-2">
                          <input value={comment} onChange={e=> setComment(e.target.value)} className="flex-1 px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Додати коментар..." />
                          <button onClick={handleAddComment} disabled={!comment.trim()} className="px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-50">Зберегти</button>
                        </div>
                    </section>
                </main>

                <footer className="flex justify-between items-center p-4 border-t dark:border-gray-700 space-x-3 shrink-0">
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      <RotateCcw size={14}/> Оновлено: {new Date(currentAcc.updatedAt).toLocaleString('uk-UA')}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={onClose} className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">Закрити</button>
                      <button onClick={onEdit} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                          <Edit size={16} />
                          <span>Редагувати</span>
                      </button>
                    </div>
                </footer>
            </motion.div>
        </motion.div>
    )
} 