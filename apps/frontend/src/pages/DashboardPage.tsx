// Dashboard simplificado para debug

export function DashboardPage() {
  // Versão simplificada para debug
  console.log('DashboardPage renderizando...')
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral do sistema Nova Agro</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Sistema Funcionando!</h2>
        <p className="text-gray-600">
          Se você está vendo esta mensagem, o frontend está carregando corretamente.
        </p>
      </div>
    </div>
  )
}

