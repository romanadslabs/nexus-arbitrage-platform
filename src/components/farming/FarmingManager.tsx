'use client';

import { useState } from 'react';
import { useData } from '@/components/providers/DataProvider';
import AccountCard from '@/components/accounts/AccountCard';
import Button from '@/components/ui/Button';
import { PlusCircle, Users, Activity, Filter } from 'lucide-react';
import AccountModal from '@/components/accounts/AccountModal';
import { Account, User } from '@/types';

// ... (інтерфейси фільтрів, якщо вони є)

export default function FarmingManager() {
  const { accounts, users, isLoading } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) return <div>Завантаження даних...</div>;
  
  const farmingAccounts = accounts.filter(acc => acc.status.includes('farming'));

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Управління Фармінгом</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
          Відстеження та управління акаунтами в процесі фармінгу.
        </p>
      </header>
      
      {/* Тут можна додати статистику, наприклад, кількість акаунтів у роботі, статистика по фармерах і т.д. */}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mt-6">
        <h2 className="text-xl font-semibold mb-4">Аккаунти в роботі ({farmingAccounts.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {farmingAccounts.map(account => (
            <AccountCard key={account.id} account={account} onUpdate={() => {}} onDelete={() => {}} onEdit={() => {}} onTransfer={() => {}}/>
          ))}
          {farmingAccounts.length === 0 && (
            <p className="text-gray-500">Немає акаунтів у процесі фармінгу.</p>
          )}
        </div>
      </div>
    </div>
  );
} 