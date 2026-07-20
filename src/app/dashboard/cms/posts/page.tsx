import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Plus, Newspaper, Edit, Trash2 } from 'lucide-react'

export default async function PostsDashboard() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Blog & News</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage articles, press releases, and news.</p>
        </div>
        <Link 
          href="/dashboard/cms/posts/new"
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={18} />
          <span>Add Post</span>
        </Link>
      </div>

      <div className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
            <thead className="bg-neutral-50 dark:bg-neutral-900/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Post</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Featured</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="relative px-6 py-4 text-right">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-neutral-950 divide-y divide-neutral-200 dark:divide-neutral-800">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-neutral-500">
                    No posts found. Click "Add Post" to write one.
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-neutral-100 dark:bg-neutral-900 rounded-lg flex items-center justify-center overflow-hidden">
                          {post.featuredImg ? (
                            <img src={post.featuredImg} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <Newspaper className="h-5 w-5 text-neutral-400" />
                          )}
                        </div>
                        <div className="ml-4 max-w-sm">
                          <div className="text-sm font-medium text-neutral-900 dark:text-white truncate">{post.title}</div>
                          <div className="text-xs text-neutral-500 truncate">{post.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        post.status === 'PUBLISHED' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : post.status === 'ARCHIVED'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-400'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {post.isFeatured ? (
                        <span className="text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-950 px-2 py-1 rounded">Yes</span>
                      ) : (
                        <span className="text-neutral-400 text-xs">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                      {post.createdAt.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <Link href={`/dashboard/cms/posts/${post.id}`} className="text-blue-600 hover:text-blue-900 dark:text-blue-500 dark:hover:text-blue-400">
                          <Edit size={16} />
                        </Link>
                        <button className="text-red-600 hover:text-red-900 dark:text-red-500 dark:hover:text-red-400">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
