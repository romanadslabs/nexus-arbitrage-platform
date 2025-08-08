// @/components/workspaces/mockData.ts
import { User, Metric, Task } from '@/types';

export const mockTeamMembers: User[] = [
  { id: 'user-1', name: 'Олександр', role: 'admin', avatar: '/avatars/01.png', status: 'active', email: 'leader@example.com' },
  { id: 'user-2', name: 'Марія', role: 'farmer', avatar: '/avatars/02.png', status: 'active', email: 'farmer@example.com' },
  { id: 'user-3', name: 'Іван', role: 'launcher', avatar: '/avatars/03.png', status: 'suspended', email: 'launcher@example.com' },
  { id: 'user-4', name: 'Дарина', role: 'viewer', avatar: '/avatars/04.png', status: 'pending', email: 'viewer@example.com' },
];

export const mockMetrics: Metric[] = [
  { name: 'Загальний ROI', value: '125%', change: '+5%', changeType: 'increase' },
  { name: 'Витрати', value: '$2,450', change: '+10%', changeType: 'decrease' },
  { name: 'Профіт', value: '$5,800', change: '+15%', changeType: 'increase' },
  { name: 'Активні кампанії', value: '24', change: '-2', changeType: 'decrease' },
];

export const mockTasks: Task[] = [
    { 
        id: 'task-1', 
        title: 'Запустити нову рекламну кампанію для Offer X', 
        status: 'in-progress', 
        priority: 'high', 
        assigneeId: mockTeamMembers[2].id,
        dueDate: new Date('2024-08-15'),
        project: 'Project Alpha',
        tags: ['Marketing', 'Urgent'],
        description: 'Детальний опис завдання для запуску кампанії.',
        comments: [
            { id: 'comment-1', authorId: mockTeamMembers[0].id, content: 'Потрібно прискоритись', createdAt: new Date() }
        ],
        subtasks: [
            { id: 'sub-1', title: 'Підготувати креативи', completed: true },
            { id: 'sub-2', title: 'Налаштувати таргетинг', completed: false },
        ]
    },
    { 
        id: 'task-2', 
        title: 'Проаналізувати результати кампанії Y', 
        status: 'todo', 
        priority: 'medium', 
        assigneeId: mockTeamMembers[1].id,
        dueDate: new Date('2024-08-20'),
        project: 'Project Beta',
        tags: ['Analytics'],
        description: 'Зібрати дані та підготувати звіт.',
        comments: [],
        subtasks: []
    },
]; 