'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { X, Edit, Download, User, Calendar, MessageSquare, History, Tag, Shield, TrafficCone, KeyRound } from 'lucide-react'
import { Account } from '@/components/providers/DataProvider'

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
    if (!isOpen || !account) return null

    const handleDownloadCookie = () => {
        if (!account.cookieData) return;
        const blob = new Blob([account.cookieData], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${account.name}_cookies.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

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
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Деталі: {account.name}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><X size={20} /></button>
                </header>

                <main className="p-6 overflow-y-auto space-y-6">
                    <section>
                        <h3 className="text-base font-semibold mb-3">Основна інформація</h3>
                        <dl className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6">
                            <DetailItem icon={User} label="Платформа" value={account.platform} />
                            <DetailItem icon={Shield} label="Статус" value={account.status} />
                            <DetailItem icon={TrafficCone} label="Тип трафіку" value={account.trafficType} />
                            <DetailItem icon={User} label="Пріоритет" value={account.priority} />
                            <DetailItem icon={User} label="Відповідальний" value={account.farmerId || 'Не призначено'} />
                            <DetailItem icon={Calendar} label="Створено" value={new Date(account.createdAt).toLocaleString('uk-UA')} />
                            <DetailItem icon={Tag} label="Теги" value={account.tags?.join(', ')} />
                            {account.cookieData && (
                                <DetailItem icon={Download} label="Cookie-файл" value={
                                    <button onClick={handleDownloadCookie} className="text-blue-600 hover:underline text-sm">
                                        Завантажити
                                    </button>
                                } />
                            )}
                        </dl>
                    </section>
                    
                     <DetailItem icon={KeyRound} label="Коди 2FA" value={<pre className="text-xs whitespace-pre-wrap bg-gray-100 dark:bg-gray-900 p-2 rounded">{account.twoFactorCode}</pre>} fullWidth />

                    <section>
                        <h3 className="text-base font-semibold mb-2 flex items-center"><History className="mr-2" size={18}/>Історія статусів</h3>
                        <div className="border rounded-lg p-3 max-h-48 overflow-y-auto bg-gray-50 dark:bg-gray-900/50 space-y-2 text-sm">
                            {[...(account.statusHistory || [])].reverse().map((s, i) => (
                                <p key={i}>
                                    <span className="font-medium">{s.status}</span> - <span className="text-gray-600 dark:text-gray-400">{s.changedBy}</span> о <span className="text-gray-600 dark:text-gray-400">{new Date(s.changedAt).toLocaleString('uk-UA')}</span>
                                </p>
                            ))}
                            {(!account.statusHistory || account.statusHistory.length === 0) && <p className="text-gray-500">Історія відсутня.</p>}
                        </div>
                    </section>

                    <section>
                        <h3 className="text-base font-semibold mb-2 flex items-center"><MessageSquare className="mr-2" size={18}/>Коментарі</h3>
                        <div className="border rounded-lg p-3 max-h-48 overflow-y-auto bg-gray-50 dark:bg-gray-900/50 space-y-3">
                            {[...(account.comments || [])].reverse().map(c => (
                                <div key={c.id}>
                                    <p className="text-sm font-medium">{c.authorName} <span className="text-xs font-normal text-gray-500">{new Date(c.createdAt).toLocaleString('uk-UA')}</span></p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{c.text}</p>
                                </div>
                            ))}
                             {(!account.comments || account.comments.length === 0) && <p className="text-sm text-gray-500">Коментарі відсутні.</p>}
                        </div>
                    </section>
                </main>

                <footer className="flex justify-end items-center p-4 border-t dark:border-gray-700 space-x-3 shrink-0">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">Закрити</button>
                    <button onClick={onEdit} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                        <Edit size={16} />
                        <span>Редагувати</span>
                    </button>
                </footer>
            </motion.div>
        </motion.div>
    )
} 