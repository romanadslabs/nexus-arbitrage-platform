'use client'

import React, { useState } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, Calendar, Globe, FileText, Plus, X } from 'lucide-react'
import { User as UserType, Project } from '@/types'

export default function RegistrationForm() {
  const { signUp } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Основні дані
    email: '',
    password: '',
    name: '',
    role: 'farmer' as 'farmer' | 'launcher' | 'leader',
    
    // Контактні дані
    telegramUsername: '',
    phoneNumber: '',
    location: '',
    
    // Особисті дані
    birthDate: '',
    birthTime: '',
    
    // Мови
    languages: ['Українська'],
    
    // Опис
    description: '',
    
    // Проекти
    projects: [] as Project[],
  })

  const [newProject, setNewProject] = useState({
    name: '',
    links: [''],
    description: '',
    role: '',
    responsibilities: '',
    isActive: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const userData: Partial<UserType> = {
        email: formData.email,
        name: formData.name,
        role: formData.role,
        telegramUsername: formData.telegramUsername,
        phoneNumber: formData.phoneNumber,
        location: formData.location,
        birthDate: formData.birthDate ? new Date(formData.birthDate) : undefined,
        birthTime: formData.birthTime,
        languages: formData.languages,
        description: formData.description,
        projects: formData.projects,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      await signUp(formData.email, formData.password, formData.name, formData.role, userData)
    } catch (error) {
      console.error('Registration error:', error)
    } finally {
      setLoading(false)
    }
  }

  const addLanguage = () => {
    setFormData({
      ...formData,
      languages: [...formData.languages, '']
    })
  }

  const removeLanguage = (index: number) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter((_, i) => i !== index)
    })
  }

  const updateLanguage = (index: number, value: string) => {
    const newLanguages = [...formData.languages]
    newLanguages[index] = value
    setFormData({
      ...formData,
      languages: newLanguages
    })
  }

  const addProject = () => {
    if (newProject.name && newProject.description) {
      const project: Project = {
        id: Date.now().toString(),
        name: newProject.name,
        links: newProject.links.filter(link => link.trim()),
        description: newProject.description,
        role: newProject.role,
        responsibilities: newProject.responsibilities,
        isActive: newProject.isActive,
      }

      setFormData({
        ...formData,
        projects: [...formData.projects, project]
      })

      setNewProject({
        name: '',
        links: [''],
        description: '',
        role: '',
        responsibilities: '',
        isActive: true,
      })
    }
  }

  const removeProject = (projectId: string) => {
    setFormData({
      ...formData,
      projects: formData.projects.filter(p => p.id !== projectId)
    })
  }

  const addProjectLink = () => {
    setNewProject({
      ...newProject,
      links: [...newProject.links, '']
    })
  }

  const removeProjectLink = (index: number) => {
    setNewProject({
      ...newProject,
      links: newProject.links.filter((_, i) => i !== index)
    })
  }

  const updateProjectLink = (index: number, value: string) => {
    const newLinks = [...newProject.links]
    newLinks[index] = value
    setNewProject({
      ...newProject,
      links: newLinks
    })
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Основні дані</h3>
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          🏷 ІМ'Я ТА ПРІЗВИЩЕ
        </label>
        <div className="mt-1 relative">
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input-field pl-10"
            placeholder="Введіть ваше ім'я та прізвище"
          />
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Роль в системі
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value as 'farmer' | 'launcher' | 'leader' })}
          className="input-field"
        >
          <option value="farmer">Фармер (створює аккаунти)</option>
          <option value="launcher">Арбітражник (запускає кампанії)</option>
          <option value="leader">Адміністратор (управляє системою)</option>
        </select>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          🏷 EMAIL (РОБОЧИЙ ТА ДЛЯ ЗВ'ЯЗКУ)
        </label>
        <div className="mt-1 relative">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="input-field pl-10"
            placeholder="Введіть ваш email"
          />
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Пароль
        </label>
        <div className="mt-1 relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="input-field pl-10 pr-10"
            placeholder="Введіть ваш пароль"
          />
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Контактні дані</h3>
      
      <div>
        <label htmlFor="telegramUsername" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          🏷 НІКНЕЙМ TELEGRAM
        </label>
        <div className="mt-1 relative">
          <input
            id="telegramUsername"
            name="telegramUsername"
            type="text"
            value={formData.telegramUsername}
            onChange={(e) => setFormData({ ...formData, telegramUsername: e.target.value })}
            className="input-field pl-10"
            placeholder="@username"
          />
          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          🏷 НОМЕР ТЕЛЕФОНУ
        </label>
        <div className="mt-1 relative">
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            className="input-field pl-10"
            placeholder="+380XXXXXXXXX"
          />
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          🏷 ГЕОЛОКАЦІЯ (Місце проживання)
        </label>
        <div className="mt-1 relative">
          <input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="input-field pl-10"
            placeholder="Місто, Країна"
          />
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Дата народження
          </label>
          <div className="mt-1 relative">
            <input
              id="birthDate"
              name="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              className="input-field pl-10"
            />
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div>
          <label htmlFor="birthTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Час народження (опціонально)
          </label>
          <div className="mt-1 relative">
            <input
              id="birthTime"
              name="birthTime"
              type="time"
              value={formData.birthTime}
              onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
              className="input-field pl-10"
            />
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Мови та опис</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          🏷 МОВИ
        </label>
        <div className="mt-1 space-y-2">
          {formData.languages.map((language, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={language}
                onChange={(e) => updateLanguage(index, e.target.value)}
                className="input-field flex-1"
                placeholder="Мова"
              />
              {formData.languages.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLanguage(index)}
                  className="btn-danger px-3"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addLanguage}
            className="btn-secondary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Додати мову
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          🏷 ОПИС
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="input-field"
          placeholder="Розкажіть про себе, ваш досвід, цілі..."
        />
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Проекти</h3>
      
      {/* Список існуючих проектів */}
      {formData.projects.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700 dark:text-gray-300">Ваші проекти:</h4>
          {formData.projects.map((project) => (
            <div key={project.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h5 className="font-medium">{project.name}</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{project.description}</p>
                  <p className="text-xs text-gray-500">Роль: {project.role}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeProject(project.id)}
                  className="btn-danger p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Форма додавання нового проекту */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Додати новий проект:</h4>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              🏷 НАЗВА ПРОЕКТУ
            </label>
            <input
              type="text"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              className="input-field"
              placeholder="Назва проекту"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              🏷 ПОСИЛАННЯ НА ПРОЕКТ
            </label>
            <div className="space-y-2">
              {newProject.links.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => updateProjectLink(index, e.target.value)}
                    className="input-field flex-1"
                    placeholder="https://..."
                  />
                  {newProject.links.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProjectLink(index)}
                      className="btn-danger px-3"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addProjectLink}
                className="btn-secondary flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Додати посилання
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              🏷 ОПИС ПРОЕКТУ
            </label>
            <textarea
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              className="input-field"
              rows={3}
              placeholder="Опис проекту"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              🏷 ВАША РОЛЬ ТА ОБОВ'ЯЗКИ В ПРОЕКТІ
            </label>
            <textarea
              value={newProject.responsibilities}
              onChange={(e) => setNewProject({ ...newProject, responsibilities: e.target.value })}
              className="input-field"
              rows={3}
              placeholder="Ваша роль та обов'язки"
            />
          </div>

          <button
            type="button"
            onClick={addProject}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Додати проект
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
            <User className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Реєстрація в Nexus Platform
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Заповніть всі необхідні дані для створення акаунту
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Крок {currentStep} з 4</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">{Math.round((currentStep / 4) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="btn-secondary"
            >
              Назад
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn-primary"
              >
                Далі
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  'Завершити реєстрацію'
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
} 