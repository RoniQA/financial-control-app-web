import React, { useRef } from 'react'
import { Download, Upload, AlertTriangle } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { backupService } from '../services/backupService'

export function BackupComponent() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isExporting, setIsExporting] = React.useState(false)
  const [isImporting, setIsImporting] = React.useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      backupService.downloadBackup('gestus-backup')
      toast.success('Backup exportado com sucesso! Arquivo preparado para download.')
    } catch (error: any) {
      toast.error(error.message || 'Erro ao exportar backup')
    } finally {
      setIsExporting(false)
    }
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    try {
      // Mostrar confirmação
      const confirmed = window.confirm(
        '⚠️ Importar um backup vai SUBSTITUIR todos os dados atuais.\n\n' +
        'Tem certeza que deseja continuar?\n\n' +
        'Arquivo: ' + file.name
      )

      if (!confirmed) {
        toast.error('Importação cancelada')
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        return
      }

      toast.loading('Importando backup...')
      await backupService.importBackup(file)
      // A página será recarregada automaticamente
    } catch (error: any) {
      toast.dismiss()
      toast.error(error.message || 'Erro ao importar backup')
    } finally {
      setIsImporting(false)
      // Limpar input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Backup de Dados</h3>

        {/* Aviso Important */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
          <AlertTriangle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Informação Importante:</p>
            <p>
              Todos os seus dados são armazenados no navegador. Se você limpar o cache do navegador, os dados serão perdidos.
              Por isso, recomendamos fazer backups regulares.
            </p>
          </div>
        </div>

        {/* Exportar */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Exportar Dados</h4>
              <p className="text-sm text-gray-600 mb-4">
                Baixe um backup com todos os seus dados em formato JSON. Você pode importar este arquivo depois para restaurar os dados.
              </p>
            </div>
          </div>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Download className="h-4 w-4" />
            {isExporting ? 'Exportando...' : 'Exportar Backup'}
          </button>

          <div className="mt-4 text-xs text-gray-500 bg-gray-50 p-3 rounded font-mono">
            Arquivo: gestus-backup-[timestamp].json
          </div>
        </div>

        {/* Importar */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Importar Dados</h4>
              <p className="text-sm text-gray-600 mb-4">
                Restaure dados de um backup previamente exportado. Isso vai substituir todos os dados atuais.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleImportClick}
              disabled={isImporting}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <Upload className="h-4 w-4" />
              {isImporting ? 'Importando...' : 'Selecionar Arquivo'}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelected}
              style={{ display: 'none' }}
              disabled={isImporting}
            />
          </div>

          <div className="mt-4 text-xs text-gray-500 bg-amber-50 p-3 rounded border border-amber-200">
            <p className="font-medium text-amber-900 mb-1">⚠️ Aviso:</p>
            <p>
              Selecione apenas arquivos de backup exportados por esta aplicação. Durante a importação, todos os dados atuais serão perdidos.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
