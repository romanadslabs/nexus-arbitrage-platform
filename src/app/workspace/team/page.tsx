'use client'

import React, { useState, useMemo } from 'react'
import { useData } from '@/components/providers/DataProvider'
import { TeamMember } from '@/components/providers/DataProvider'
import { UserPlus, Trash2, Edit, Shield, CheckSquare } from 'lucide-react'
import ModernLayout from '@/components/layout/ModernLayout'

// Member Card Component
const MemberCard = ({ member, taskCount, onEdit, onRemove }: { member: TeamMember, taskCount: number, onEdit: (member: TeamMember) => void, onRemove: (memberId: string) => void }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-xl">
                        {member.name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-semibold">{member.name}</p>
                        <p className={`text-sm capitalize flex items-center gap-1 ${member.role === 'leader' ? 'text-amber-500' : 'text-gray-500'}`}>
                            {member.role === 'leader' && <Shield size={14} />}
                            {member.role}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => onEdit(member)} className="text-gray-400 hover:text-blue-500"><Edit size={16}/></button>
                    <button onClick={() => onRemove(member.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <CheckSquare size={16} />
                <span>{taskCount} активних задач</span>
            </div>
        </div>
    )
}

// Member Modal Component
const MemberModal = ({ isOpen, onClose, onSave, member }: { isOpen: boolean, onClose: () => void, onSave: (memberData: any) => void, member: TeamMember | null }) => {
    const [formData, setFormData] = useState<any>({});

    React.useEffect(() => {
        setFormData(member || { name: '', role: 'member' });
    }, [member]);
    
    const handleSave = () => {
        onSave(formData);
        onClose();
    }
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6">
                <h2 className="text-lg font-semibold mb-4">{member?.id ? 'Редагувати учасника' : 'Додати учасника'}</h2>
                <div className="space-y-4">
                    <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ім'я" className="w-full p-2 border rounded"/>
                    <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full p-2 border rounded">
                        <option value="member">Учасник</option>
                        <option value="leader">Лідер</option>
                    </select>
                    <div className="flex justify-end gap-2">
                        <button onClick={onClose} className="px-4 py-2 rounded">Скасувати</button>
                        <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">Зберегти</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Main Page Component
export default function WorkspaceTeamPage() {
    const { workspace, addTeamMember, removeTeamMember, updateWorkspace } = useData()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
    
    const taskCounts = useMemo(() => {
        const counts: { [key: string]: number } = {};
        workspace?.team.forEach(member => {
            counts[member.id] = workspace.tasks.filter(task => task.assigneeId === member.id && task.status !== 'done').length;
        });
        return counts;
    }, [workspace]);

    const handleSaveMember = (memberData: any) => {
        if (memberData.id) {
            const updatedTeam = workspace!.team.map(m => m.id === memberData.id ? {...m, ...memberData} : m);
            updateWorkspace({ team: updatedTeam });
        } else {
            addTeamMember(memberData);
        }
    }

    if (!workspace) return <div>Завантаження...</div>

    return (
        <ModernLayout
            title="Команда"
            description="Керуйте учасниками вашого робочого простору."
        >
            <div className="flex justify-end mb-4">
                 <button onClick={() => { setEditingMember(null); setIsModalOpen(true); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2">
                    <UserPlus size={18}/> Додати учасника
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {workspace.team.map(member => (
                    <MemberCard 
                        key={member.id} 
                        member={member} 
                        taskCount={taskCounts[member.id] || 0}
                        onEdit={(member) => { setEditingMember(member); setIsModalOpen(true); }}
                        onRemove={removeTeamMember}
                    />
                ))}
            </div>
            <MemberModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSaveMember} 
                member={editingMember}
            />
        </ModernLayout>
    )
} 