/**
 * Serviço de Backup e Restauração de Dados
 * Permite exportar todos os dados do localStorage como JSON
 * e importar dados previamente exportados
 */

interface BackupData {
  version: string
  timestamp: string
  data: {
    [key: string]: any
  }
}

const BACKUP_VERSION = '1.0'
const BACKUP_FILE_NAME = 'gestus-backup'

/**
 * Exporta todos os dados do localStorage como JSON
 * @returns BackupData com estrutura validada
 */
export const backupService = {
  /**
   * Exporta os dados e retorna como JSON
   */
  export: (): BackupData => {
    const backupData: BackupData = {
      version: BACKUP_VERSION,
      timestamp: new Date().toISOString(),
      data: {},
    }

    // Copiar todos os dados do localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        const value = localStorage.getItem(key)
        if (value) {
          try {
            // Tentar fazer parse se for JSON
            backupData.data[key] = JSON.parse(value)
          } catch {
            // Se não for JSON válido, manter como string
            backupData.data[key] = value
          }
        }
      }
    }

    return backupData
  },

  /**
   * Faz download do backup como arquivo JSON
   * @param filename - Nome do arquivo (sem extensão)
   */
  downloadBackup: (filename: string = BACKUP_FILE_NAME): void => {
    try {
      const backupData = backupService.export()
      const jsonString = JSON.stringify(backupData, null, 2)
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${filename}-${new Date().getTime()}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      throw new Error('Erro ao fazer download do backup')
    }
  },

  /**
   * Valida se um objeto é um backup válido
   * @param data - Objeto a validar
   * @returns true se é um backup válido
   */
  isValidBackup: (data: unknown): data is BackupData => {
    if (typeof data !== 'object' || data === null) return false

    const backup = data as Record<string, unknown>

    // Verificar estrutura básica
    if (!('version' in backup) || !('timestamp' in backup) || !('data' in backup)) {
      return false
    }

    // Verificar tipos
    if (
      typeof backup.version !== 'string' ||
      typeof backup.timestamp !== 'string' ||
      typeof backup.data !== 'object' ||
      backup.data === null
    ) {
      return false
    }

    return true
  },

  /**
   * Restaura dados de um backup
   * @param backupData - Dados do backup
   * @throws Error se o backup for inválido
   */
  restore: (backupData: BackupData): void => {
    // Validar backup
    if (!backupService.isValidBackup(backupData)) {
      throw new Error('Arquivo de backup inválido. Certifique-se de que é um backup válido da aplicação.')
    }

    try {
      // Limpar localStorage atual
      localStorage.clear()

      // Restaurar dados
      for (const [key, value] of Object.entries(backupData.data)) {
        const jsonString = typeof value === 'string' ? value : JSON.stringify(value)
        localStorage.setItem(key, jsonString)
      }
    } catch (error) {
      // Se falhar, limpar e relançar
      localStorage.clear()
      throw new Error('Erro ao restaurar backup. Tente novamente.')
    }
  },

  /**
   * Processa um arquivo de backup importado
   * @param file - Arquivo selecionado pelo usuário
   * @returns Promise<BackupData>
   */
  processBackupFile: (file: File): Promise<BackupData> => {
    return new Promise((resolve, reject) => {
      // Validar tipo de arquivo
      if (!file.name.endsWith('.json')) {
        reject(new Error('Apenas arquivos .json são aceitos'))
        return
      }

      // Validar tamanho (máximo 10MB)
      const maxSizeBytes = 10 * 1024 * 1024
      if (file.size > maxSizeBytes) {
        reject(new Error('Arquivo muito grande (máximo 10MB)'))
        return
      }

      // Ler arquivo
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string
          const backupData = JSON.parse(content)

          // Validar estrutura
          if (!backupService.isValidBackup(backupData)) {
            reject(new Error('Arquivo não é um backup válido da aplicação Gestus'))
            return
          }

          resolve(backupData)
        } catch (error) {
          reject(new Error('Erro ao ler o arquivo. Certifique-se de que é um arquivo JSON válido.'))
        }
      }

      reader.onerror = () => {
        reject(new Error('Erro ao ler o arquivo'))
      }

      reader.readAsText(file)
    })
  },

  /**
   * Importa backup de um arquivo e restaura dados
   * Recarrega a página após sucesso
   * @param file - Arquivo a importar
   * @throws Error com mensagem amigável
   */
  importBackup: async (file: File): Promise<void> => {
    try {
      const backupData = await backupService.processBackupFile(file)
      backupService.restore(backupData)

      // Recarregar página para aplicar novos dados
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (error) {
      throw error
    }
  },

  /**
   * Retorna informações sobre o backup (tamanho, itens, etc)
   * @param backupData - Dados do backup
   * @returns Informações formatadas
   */
  getBackupInfo: (backupData: BackupData) => {
    const itemCount = Object.keys(backupData.data).length
    const backupSize = new Blob([JSON.stringify(backupData)]).size
    const sizeInKB = (backupSize / 1024).toFixed(2)

    return {
      version: backupData.version,
      timestamp: new Date(backupData.timestamp).toLocaleString('pt-BR'),
      items: itemCount,
      size: `${sizeInKB} KB`,
    }
  },
}
