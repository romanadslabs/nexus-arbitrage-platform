import { AccountsService, AirtableService, FIELD_NAMES, TABLES } from './airtable'
import { Account } from '@/types'

// Сервіс для автоматизації фармінгу
export class FarmingService {
  private accountsService = AccountsService
  private airtableService = AirtableService

  constructor() {}

  // Основний метод для запуску процесу
  async runFarmingCycle() {
    console.log('🚀 Запуск нового циклу фармінгу...')
    
    const readyAccounts = await this.getReadyAccounts();
    console.log(`🔍 Знайдено ${readyAccounts.length} готових до роботи акаунтів.`);

    for (const account of readyAccounts) {
      await this.processAccount(account);
    }

    console.log('✅ Цикл фармінгу завершено.');
  }

  // Обробка одного аккаунта
  private async processAccount(account: Account) {
    console.log(`⚙️ Обробка акаунта: ${account.name} (ID: ${account.id})`);
    try {
      // Тут буде логіка взаємодії з Kasmweb або іншим браузерним API
      // Наприклад, запуск скриптів, перевірка статусу і т.д.
      
      // Після успішного фармінгу - оновлюємо статус
      await this.updateAccountStatus(account.id, 'completed');
      console.log(`✅ Акаунт ${account.name} успішно оброблено.`);

    } catch (error) {
      console.error(`❌ Помилка обробки акаунта ${account.name}:`, error);
      await this.updateAccountStatus(account.id, 'error');
    }
  }

  // Отримання акаунтів зі статусом 'ready'
  private async getReadyAccounts(): Promise<Account[]> {
    const records = await this.accountsService.getAccountsByStatus('ready');
    return records.map(record => ({
      id: record.id,
      ...record.fields
    } as unknown as Account));
  }

  // Оновлення статусу акаунта
  private async updateAccountStatus(accountId: string, status: string) {
    await this.accountsService.updateAccount(accountId, {
      status: status,
    });
  }
}

export const farmingService = new FarmingService(); 