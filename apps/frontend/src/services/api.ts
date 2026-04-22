type ApiConfig = { params?: Record<string, any> }

type ApiResponse<T = any> = {
  data: T
  status: number
  headers: Record<string, string>
}

type LocalUser = {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  password: string
  companyId: string
}

type LocalDb = {
  users: LocalUser[]
  partners: any[]
  products: any[]
  stocks: any[]
  stockMoves: any[]
  orders: any[]
  financialNotifications: any[]
  payments: any[]
  warehouses: any[]
}

const DB_KEY = 'gestus-local-db-v1'

const nowIso = () => new Date().toISOString()
const randomId = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 10)}`

const parseUrl = (url: string) => {
  const [pathname, queryString] = url.split('?')
  const query = new URLSearchParams(queryString || '')
  return { pathname, query }
}

const createError = (status: number, message: string) => {
  throw {
    message,
    response: {
      status,
      data: { message },
    },
  }
}

const seedDb = (): LocalDb => {
  const companyId = 'company_local'
  const userId = 'user_local_admin'
  const warehouseId = 'warehouse_local_default'
  const partnerCustomerId = randomId('partner')
  const partnerSupplierId = randomId('partner')
  const productId = randomId('product')
  const stockId = randomId('stock')
  const paymentId = randomId('payment')

  return {
    users: [
      {
        id: userId,
        email: 'admin@gestus.local',
        firstName: 'Admin',
        lastName: 'Local',
        password: '123456',
        companyId,
      },
    ],
    partners: [
      {
        id: partnerCustomerId,
        name: 'Cliente Exemplo',
        type: 'CUSTOMER',
        document: '000.000.000-00',
        email: 'cliente@exemplo.com',
        phone: '(11) 99999-0000',
        address: {},
        isActive: true,
        companyId,
        createdAt: nowIso(),
      },
      {
        id: partnerSupplierId,
        name: 'Fornecedor Exemplo',
        type: 'SUPPLIER',
        document: '00.000.000/0001-00',
        email: 'fornecedor@exemplo.com',
        phone: '(11) 98888-0000',
        address: {},
        isActive: true,
        companyId,
        createdAt: nowIso(),
      },
    ],
    products: [
      {
        id: productId,
        sku: 'PROD-LOCAL-001',
        name: 'Produto Demo',
        description: 'Produto inicial local',
        category: 'Geral',
        brand: 'Gestus',
        model: 'Demo',
        unit: 'UN',
        ncm: '',
        cest: '',
        weight: 0,
        dimensions: { length: 0, width: 0, height: 0 },
        isActive: true,
        isService: false,
        companyId,
        createdAt: nowIso(),
        updatedAt: nowIso(),
        prices: [{ costPrice: 50, markup: 50, salePrice: 75, createdAt: nowIso() }],
      },
    ],
    stocks: [
      {
        id: stockId,
        productId,
        warehouseId,
        quantity: 20,
        reserved: 0,
        location: 'A-01',
      },
    ],
    stockMoves: [],
    orders: [],
    financialNotifications: [],
    payments: [
      {
        id: paymentId,
        type: 'INBOUND',
        method: 'PIX',
        description: 'Saldo inicial',
        amount: 1500,
        dueDate: nowIso(),
        paidAt: nowIso(),
        createdAt: nowIso(),
      },
    ],
    warehouses: [
      {
        id: warehouseId,
        name: 'Depósito Principal',
        code: 'MAIN',
        address: {},
        isActive: true,
        isDefault: true,
        companyId,
      },
    ],
  }
}

const getDb = (): LocalDb => {
  const raw = localStorage.getItem(DB_KEY)
  if (!raw) {
    const initial = seedDb()
    localStorage.setItem(DB_KEY, JSON.stringify(initial))
    return initial
  }
  return JSON.parse(raw)
}

const saveDb = (db: LocalDb) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db))
}

const withRelations = (db: LocalDb, product: any) => ({
  ...product,
  stocks: db.stocks.filter((s) => s.productId === product.id),
})

const withOrderRelations = (db: LocalDb, order: any) => ({
  ...order,
  partner: db.partners.find((p) => p.id === order.partnerId) || null,
})

const ok = <T>(data: T): ApiResponse<T> => ({ data, status: 200, headers: {} })

const api = {
  defaults: { headers: {} as Record<string, string> },

  async get(url: string, config?: ApiConfig) {
    const db = getDb()
    const { pathname, query } = parseUrl(url)
    const params = config?.params || {}
    const read = (name: string) => params[name] ?? query.get(name) ?? ''

    if (pathname === '/auth/profile') return ok({ message: 'Use dados da sessao local' })
    if (pathname === '/warehouses/default') return ok(db.warehouses.find((w) => w.isDefault) || db.warehouses[0])
    if (pathname === '/warehouses') return ok(db.warehouses)

    if (pathname === '/products') {
      const search = String(read('search')).toLowerCase().trim()
      const data = db.products
        .filter((p) => !search || p.name.toLowerCase().includes(search) || p.sku.toLowerCase().includes(search))
        .map((p) => withRelations(db, p))
      return ok(data)
    }

    if (pathname === '/partners') {
      const search = String(read('search')).toLowerCase().trim()
      const type = String(read('type')).trim()
      const data = db.partners.filter((p) => {
        if (type && p.type !== type) return false
        if (!search) return true
        return p.name.toLowerCase().includes(search) || (p.document || '').toLowerCase().includes(search)
      })
      return ok(data)
    }

    if (pathname === '/orders') {
      const search = String(read('search')).toLowerCase().trim()
      const status = String(read('status')).trim()
      const data = db.orders
        .filter((o) => {
          if (status && o.status !== status) return false
          if (!search) return true
          return o.number.toLowerCase().includes(search)
        })
        .map((o) => withOrderRelations(db, o))
      return ok(data)
    }

    if (pathname === '/inventory/summary') {
      const data = db.stocks.map((stock) => {
        const product = db.products.find((p) => p.id === stock.productId)
        const warehouse = db.warehouses.find((w) => w.id === stock.warehouseId)
        return { ...stock, product, warehouse }
      })
      return ok(data)
    }

    if (pathname === '/financial/payments') {
      const search = String(read('search')).toLowerCase().trim()
      const type = String(read('type')).trim()
      const data = db.payments.filter((p) => {
        if (type && p.type !== type) return false
        if (!search) return true
        return (p.description || '').toLowerCase().includes(search)
      })
      return ok(data)
    }

    if (pathname === '/financial/notifications') return ok(db.financialNotifications)
    if (pathname === '/financial/balance') {
      const totalInbound = db.payments.filter((p) => p.type === 'INBOUND').reduce((sum, p) => sum + (p.amount || 0), 0)
      const totalOutbound = db.payments.filter((p) => p.type === 'OUTBOUND').reduce((sum, p) => sum + (p.amount || 0), 0)
      return ok({ totalInbound, totalOutbound, balance: totalInbound - totalOutbound })
    }

    if (pathname === '/reports/dashboard') {
      const inventorySummary = db.stocks.map((stock) => ({
        ...stock,
        product: db.products.find((p) => p.id === stock.productId),
      }))
      const lowStockProducts = inventorySummary.filter((s) => (s.quantity || 0) <= 5)
      const recentOrders = db.orders
        .slice()
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
        .slice(0, 5)
        .map((o) => withOrderRelations(db, o))
      return ok({
        totals: {
          products: db.products.length,
          partners: db.partners.length,
          orders: db.orders.length,
        },
        recentOrders,
        lowStockProducts,
      })
    }

    if (pathname === '/reports/sales') {
      const startDate = String(read('startDate'))
      const endDate = String(read('endDate'))
      const data = db.orders
        .filter((o) => o.type === 'SALE')
        .filter((o) => (!startDate || o.createdAt >= startDate) && (!endDate || o.createdAt <= `${endDate}T23:59:59.999Z`))
        .map((o) => withOrderRelations(db, o))
      return ok(data)
    }

    if (pathname === '/reports/purchases') {
      const startDate = String(read('startDate'))
      const endDate = String(read('endDate'))
      const data = db.orders
        .filter((o) => o.type === 'PURCHASE')
        .filter((o) => (!startDate || o.createdAt >= startDate) && (!endDate || o.createdAt <= `${endDate}T23:59:59.999Z`))
        .map((o) => withOrderRelations(db, o))
      return ok(data)
    }

    if (pathname === '/reports/inventory') {
      const data = db.stocks.map((stock) => ({
        ...stock,
        id: stock.id,
        product: db.products.find((p) => p.id === stock.productId),
        warehouse: db.warehouses.find((w) => w.id === stock.warehouseId),
      }))
      return ok(data)
    }

    if (pathname === '/reports/financial') {
      const grouped = new Map<string, { type: string; method: string; _sum: { amount: number }; _count: { id: number } }>()
      db.payments.forEach((p) => {
        const key = `${p.type}:${p.method}`
        if (!grouped.has(key)) {
          grouped.set(key, { type: p.type, method: p.method, _sum: { amount: 0 }, _count: { id: 0 } })
        }
        const item = grouped.get(key)!
        item._sum.amount += p.amount || 0
        item._count.id += 1
      })
      return ok(Array.from(grouped.values()))
    }

    return createError(404, `Endpoint local não implementado: ${pathname}`)
  },

  async post(url: string, body?: any) {
    const db = getDb()
    const { pathname } = parseUrl(url)

    if (pathname === '/auth/login') {
      const user = db.users.find((u) => u.email.toLowerCase() === String(body?.email || '').toLowerCase())
      if (!user || user.password !== body?.password) createError(401, 'Email ou senha inválidos')
      if (!user) throw new Error('User not found')
      return ok({
        accessToken: `local_access_${user.id}`,
        refreshToken: `local_refresh_${user.id}`,
        user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, companyId: user.companyId },
      })
    }

    if (pathname === '/auth/register') {
      const exists = db.users.some((u) => u.email.toLowerCase() === String(body?.email || '').toLowerCase())
      if (exists) createError(400, 'Email já cadastrado')
      const newUser: LocalUser = {
        id: randomId('user'),
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phone,
        password: body.password,
        companyId: 'company_local',
      }
      db.users.push(newUser)
      saveDb(db)
      return ok({ message: 'Usuário cadastrado com sucesso' })
    }

    if (pathname === '/auth/refresh') {
      return ok({ accessToken: `local_access_refresh_${Date.now()}`, refreshToken: `local_refresh_${Date.now()}` })
    }

    if (pathname === '/products') {
      const existsSku = db.products.some((p) => p.sku === body?.sku)
      if (existsSku) createError(400, 'SKU já cadastrado')
      const item = {
        id: randomId('product'),
        ...body,
        prices: [],
        createdAt: nowIso(),
        updatedAt: nowIso(),
      }
      db.products.push(item)
      saveDb(db)
      return ok(item)
    }

    if (pathname.startsWith('/products/') && pathname.endsWith('/prices')) {
      const productId = pathname.split('/')[2]
      const product = db.products.find((p) => p.id === productId)
      if (!product) createError(404, 'Produto não encontrado')
      product.prices = [
        {
          costPrice: Number(body?.costPrice || 0),
          markup: Number(body?.markup || 0),
          salePrice: Number(body?.salePrice || 0),
          createdAt: nowIso(),
        },
        ...(product.prices || []),
      ]
      product.updatedAt = nowIso()
      saveDb(db)
      return ok(product.prices[0])
    }

    if (pathname === '/inventory/stock-moves') {
      const { productId, warehouseId, type, quantity, reason } = body || {}
      if (!productId || !warehouseId) createError(400, 'Produto e depósito são obrigatórios')
      const qty = Number(quantity || 0)
      if (qty <= 0) createError(400, 'Quantidade inválida')

      let stock = db.stocks.find((s) => s.productId === productId && s.warehouseId === warehouseId)
      if (!stock) {
        stock = { id: randomId('stock'), productId, warehouseId, quantity: 0, reserved: 0, location: '' }
        db.stocks.push(stock)
      }

      if (type === 'OUT' && stock.quantity < qty) createError(400, 'Estoque insuficiente')
      stock.quantity = type === 'OUT' ? stock.quantity - qty : stock.quantity + qty

      const move = { id: randomId('move'), productId, warehouseId, type, quantity: qty, reason, createdAt: nowIso() }
      db.stockMoves.push(move)
      saveDb(db)
      return ok(move)
    }

    if (pathname === '/partners') {
      const item = { id: randomId('partner'), ...body, createdAt: nowIso() }
      db.partners.push(item)
      saveDb(db)
      return ok(item)
    }

    if (pathname === '/orders') {
      const item = {
        id: randomId('order'),
        ...body,
        number: body?.number || `PED-${Date.now().toString().slice(-6)}`,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      }
      db.orders.push(item)
      if (item.status === 'PENDING') {
        db.financialNotifications.push({
          id: randomId('notification'),
          type: item.type === 'SALE' ? 'INBOUND' : 'OUTBOUND',
          status: 'PENDING',
          amount: Number(item.total || 0),
          description: `Pedido ${item.number}`,
          order: { id: item.id, number: item.number },
          partner: db.partners.find((p) => p.id === item.partnerId) || null,
          createdAt: nowIso(),
        })
      }
      saveDb(db)
      return ok(item)
    }

    if (pathname.includes('/financial/notifications/') && pathname.endsWith('/approve')) {
      const id = pathname.split('/')[3]
      const notification = db.financialNotifications.find((n) => n.id === id)
      if (!notification) createError(404, 'Notificação não encontrada')
      notification.status = 'APPROVED'
      db.payments.push({
        id: randomId('payment'),
        type: notification.type,
        method: 'PIX',
        description: notification.description,
        amount: notification.amount,
        dueDate: nowIso(),
        paidAt: nowIso(),
        createdAt: nowIso(),
      })
      saveDb(db)
      return ok({ message: 'Notificação aprovada' })
    }

    if (pathname.includes('/financial/notifications/') && pathname.endsWith('/reject')) {
      const id = pathname.split('/')[3]
      const notification = db.financialNotifications.find((n) => n.id === id)
      if (!notification) createError(404, 'Notificação não encontrada')
      notification.status = 'REJECTED'
      saveDb(db)
      return ok({ message: 'Notificação rejeitada' })
    }

    if (pathname === '/financial/payments') {
      const { type, method, description, amount, dueDate, paidAt } = body || {}
      if (!type || !method || !description || !amount) {
        createError(400, 'Tipo, método, descrição e valor são obrigatórios')
      }
      const item = {
        id: randomId('payment'),
        type,
        method,
        description,
        amount: Number(amount),
        dueDate: dueDate || nowIso(),
        paidAt: paidAt || null,
        createdAt: nowIso(),
      }
      db.payments.push(item)
      saveDb(db)
      return ok(item)
    }

    return createError(404, `Endpoint local não implementado: ${pathname}`)
  },

  async patch(url: string, body?: any) {
    const db = getDb()
    const { pathname } = parseUrl(url)
    const id = pathname.split('/')[2]

    if (pathname.startsWith('/products/')) {
      const product = db.products.find((p) => p.id === id)
      if (!product) createError(404, 'Produto não encontrado')
      Object.assign(product, body, { updatedAt: nowIso() })
      saveDb(db)
      return ok(product)
    }

    if (pathname.startsWith('/partners/')) {
      const partner = db.partners.find((p) => p.id === id)
      if (!partner) createError(404, 'Parceiro não encontrado')
      Object.assign(partner, body)
      saveDb(db)
      return ok(partner)
    }

    if (pathname.startsWith('/orders/')) {
      const order = db.orders.find((o) => o.id === id)
      if (!order) createError(404, 'Pedido não encontrado')
      
      const oldStatus = order.status
      const newStatus = body.status
      const statusesForPayment = ['APPROVED', 'IN_SEPARATION', 'IN_DELIVERY', 'COMPLETED']
      
      // Atualizar pedido
      Object.assign(order, body, { updatedAt: nowIso() })
      
      // Criar pagamento automaticamente se status mudou para um dos status desejados
      if (newStatus && statusesForPayment.includes(newStatus) && oldStatus !== newStatus) {
        // Verificar se já existe um pagamento para este pedido
        const paymentExists = db.payments.some((p) => p.description && p.description.includes(`Pedido ${order.number}`))
        
        if (!paymentExists) {
          const paymentType = order.type === 'SALE' ? 'INBOUND' : 'OUTBOUND'
          const payment = {
            id: randomId('payment'),
            type: paymentType,
            method: 'PEDIDO',
            description: `Pedido ${order.number} - ${order.type === 'SALE' ? 'Venda' : 'Compra'}`,
            amount: Number(order.total || 0),
            dueDate: nowIso(),
            paidAt: null,
            createdAt: nowIso(),
          }
          db.payments.push(payment)
        }
      }
      
      saveDb(db)
      return ok(order)
    }

    return createError(404, `Endpoint local não implementado: ${pathname}`)
  },

  async delete(url: string) {
    const db = getDb()
    const { pathname } = parseUrl(url)
    const id = pathname.split('/')[2]

    if (pathname.startsWith('/products/')) {
      db.products = db.products.filter((p) => p.id !== id)
      db.stocks = db.stocks.filter((s) => s.productId !== id)
      saveDb(db)
      return ok({ message: 'Produto removido' })
    }

    if (pathname.startsWith('/partners/')) {
      db.partners = db.partners.filter((p) => p.id !== id)
      saveDb(db)
      return ok({ message: 'Parceiro removido' })
    }

    if (pathname.startsWith('/orders/')) {
      db.orders = db.orders.filter((o) => o.id !== id)
      saveDb(db)
      return ok({ message: 'Pedido removido' })
    }

    if (pathname.startsWith('/financial/payments/')) {
      const paymentId = pathname.split('/')[3]
      db.payments = db.payments.filter((p) => p.id !== paymentId)
      saveDb(db)
      return ok({ message: 'Pagamento removido' })
    }

    return createError(404, `Endpoint local não implementado: ${pathname}`)
  },

  async put(url: string, body?: any) {
    const db = getDb()
    const { pathname } = parseUrl(url)

    if (pathname.startsWith('/financial/payments/')) {
      const paymentId = pathname.split('/')[3]
      const payment = db.payments.find((p) => p.id === paymentId)
      if (!payment) createError(404, 'Pagamento não encontrado')
      
      const { type, method, description, amount, dueDate, paidAt } = body || {}
      if (!type || !method || !description || !amount) {
        createError(400, 'Tipo, método, descrição e valor são obrigatórios')
      }
      
      payment.type = type
      payment.method = method
      payment.description = description
      payment.amount = Number(amount)
      payment.dueDate = dueDate || payment.dueDate
      payment.paidAt = paidAt || null
      
      saveDb(db)
      return ok(payment)
    }

    return createError(404, `Endpoint local não implementado: ${pathname}`)
  },
}

export default api

