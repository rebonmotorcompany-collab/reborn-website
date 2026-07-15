import { prisma } from '@/lib/db'
import { Users, Building2, Store, Package } from 'lucide-react'

export default async function DashboardPage() {
  // Fetch high-level statistics
  const [userCount, companyCount, dealerCount, productCount] = await Promise.all([
    prisma.user.count(),
    prisma.company.count(),
    prisma.dealer.count(),
    prisma.product.count(),
  ])

  const stats = [
    { name: 'Total Users', value: userCount, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { name: 'Companies', value: companyCount, icon: Building2, color: 'text-indigo-600', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
    { name: 'Dealers', value: dealerCount, icon: Store, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30' },
    { name: 'Products', value: productCount, icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  ]

  // Fetch recent activity
  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { userRoles: { include: { role: true } } },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Dashboard Overview</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="bg-white dark:bg-neutral-950 overflow-hidden shadow-sm rounded-xl border border-neutral-200 dark:border-neutral-800 p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`p-3 rounded-xl ${item.bg}`}>
                  <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400 truncate">{item.name}</dt>
                  <dd className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">{item.value}</dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white dark:bg-neutral-950 shadow-sm rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="px-6 py-5 border-b border-neutral-200 dark:border-neutral-800">
          <h3 className="text-base font-semibold leading-6 text-neutral-900 dark:text-white">Recent Users Added</h3>
        </div>
        <ul role="list" className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {recentUsers.map((user) => (
            <li key={user.id} className="px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">{user.name}</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{user.email}</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.status === 'ACTIVE' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {user.status}
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400 capitalize">
                  {user.userRoles[0]?.role.slug.replace('-', ' ')}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
