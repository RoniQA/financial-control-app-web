import { useState } from 'react'
import { 
  Settings as SettingsIcon, 
  Palette, 
  User, 
  Bell, 
  Shield, 
  Database,
  Monitor,
  Moon,
  Sun,
  Save,
  RotateCcw
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { useThemeStore } from '../stores/themeStore'

export function SettingsPage() {
  const { theme, setTheme } = useThemeStore()
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    orders: true,
    stock: true,
    financial: true
  })
  const [userSettings, setUserSettings] = useState({
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo',
    currency: 'BRL',
    dateFormat: 'DD/MM/YYYY'
  })

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme)
  }

  const handleSaveSettings = () => {
    // Aqui você salvaria as configurações no backend
    console.log('Salvando configurações:', { theme, notifications, userSettings })
    // Implementar toast de sucesso
  }

  const handleResetSettings = () => {
    setTheme('light')
    setNotifications({
      email: true,
      push: false,
      sms: false,
      orders: true,
      stock: true,
      financial: true
    })
    setUserSettings({
      language: 'pt-BR',
      timezone: 'America/Sao_Paulo',
      currency: 'BRL',
      dateFormat: 'DD/MM/YYYY'
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Configurações
          </h1>
          <p className="text-secondary-600 dark:text-dark-textSecondary mt-2">
            Personalize sua experiência no Gestus
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="ghost" onClick={handleResetSettings} icon={<RotateCcw className="h-4 w-4" />}>
            Restaurar Padrões
          </Button>
          <Button variant="primary" onClick={handleSaveSettings} icon={<Save className="h-4 w-4" />}>
            Salvar Configurações
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Aparência */}
        <Card variant="elevated" hover>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Palette className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <CardTitle>Aparência</CardTitle>
                <CardDescription>Personalize o visual da aplicação</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium text-secondary-700 dark:text-dark-text mb-3 block">
                Tema
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    theme === 'light'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-glow'
                      : 'border-white/20 dark:border-dark-border hover:border-primary-200 dark:hover:border-primary-400'
                  }`}
                >
                  <Sun className="h-6 w-6 mx-auto mb-2 text-warning-600" />
                  <p className="text-sm font-medium text-secondary-900 dark:text-dark-text">Claro</p>
                </button>
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    theme === 'dark'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-glow'
                      : 'border-white/20 dark:border-dark-border hover:border-primary-200 dark:hover:border-primary-400'
                  }`}
                >
                  <Moon className="h-6 w-6 mx-auto mb-2 text-primary-600" />
                  <p className="text-sm font-medium text-secondary-900 dark:text-dark-text">Escuro</p>
                </button>
                <button
                  onClick={() => handleThemeChange('system')}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    theme === 'system'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-glow'
                      : 'border-white/20 dark:border-dark-border hover:border-primary-200 dark:hover:border-primary-400'
                  }`}
                >
                  <Monitor className="h-6 w-6 mx-auto mb-2 text-secondary-600" />
                  <p className="text-sm font-medium text-secondary-900 dark:text-dark-text">Sistema</p>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card variant="elevated" hover>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-accent-100 rounded-lg">
                <Bell className="h-5 w-5 text-accent-600" />
              </div>
              <div>
                <CardTitle>Notificações</CardTitle>
                <CardDescription>Configure como receber alertas</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-secondary-900">Email</p>
                  <p className="text-sm text-secondary-600">Receber notificações por email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={(e) => setNotifications(prev => ({ ...prev, email: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-secondary-900">Push</p>
                  <p className="text-sm text-secondary-600">Notificações do navegador</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.push}
                    onChange={(e) => setNotifications(prev => ({ ...prev, push: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-secondary-900">Pedidos</p>
                  <p className="text-sm text-secondary-600">Alertas sobre pedidos</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.orders}
                    onChange={(e) => setNotifications(prev => ({ ...prev, orders: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-secondary-900">Estoque</p>
                  <p className="text-sm text-secondary-600">Alertas de estoque baixo</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.stock}
                    onChange={(e) => setNotifications(prev => ({ ...prev, stock: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferências do Usuário */}
        <Card variant="elevated" hover>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-success-100 rounded-lg">
                <User className="h-5 w-5 text-success-600" />
              </div>
              <div>
                <CardTitle>Preferências</CardTitle>
                <CardDescription>Configurações pessoais</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-secondary-700 mb-2 block">
                Idioma
              </label>
              <select
                value={userSettings.language}
                onChange={(e) => setUserSettings(prev => ({ ...prev, language: e.target.value }))}
                className="w-full px-3 py-2 border border-white/20 rounded-xl bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en-US">English (US)</option>
                <option value="es-ES">Español</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-secondary-700 mb-2 block">
                Fuso Horário
              </label>
              <select
                value={userSettings.timezone}
                onChange={(e) => setUserSettings(prev => ({ ...prev, timezone: e.target.value }))}
                className="w-full px-3 py-2 border border-white/20 rounded-xl bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                <option value="America/New_York">Nova York (GMT-5)</option>
                <option value="Europe/London">Londres (GMT+0)</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-secondary-700 mb-2 block">
                Moeda
              </label>
              <select
                value={userSettings.currency}
                onChange={(e) => setUserSettings(prev => ({ ...prev, currency: e.target.value }))}
                className="w-full px-3 py-2 border border-white/20 rounded-xl bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="BRL">Real Brasileiro (R$)</option>
                <option value="USD">Dólar Americano ($)</option>
                <option value="EUR">Euro (€)</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-secondary-700 mb-2 block">
                Formato de Data
              </label>
              <select
                value={userSettings.dateFormat}
                onChange={(e) => setUserSettings(prev => ({ ...prev, dateFormat: e.target.value }))}
                className="w-full px-3 py-2 border border-white/20 rounded-xl bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="DD/MM/YYYY">DD/MM/AAAA</option>
                <option value="MM/DD/YYYY">MM/DD/AAAA</option>
                <option value="YYYY-MM-DD">AAAA-MM-DD</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Informações do Sistema */}
        <Card variant="elevated" hover>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-warning-100 rounded-lg">
                <Database className="h-5 w-5 text-warning-600" />
              </div>
              <div>
                <CardTitle>Informações do Sistema</CardTitle>
                <CardDescription>Detalhes da aplicação</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-secondary-600">Versão</span>
                <Badge variant="info">v1.0.0</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-secondary-600">Ambiente</span>
                <Badge variant="success">Desenvolvimento</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-secondary-600">Última Atualização</span>
                <span className="text-sm text-secondary-900">{new Date().toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-secondary-600">Status do Servidor</span>
                <Badge variant="success">Online</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
