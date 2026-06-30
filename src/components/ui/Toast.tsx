import { useToastStore } from '../../store/toast-store'

const TYPE_STYLES: Record<string, string> = {
  info: 'border-l-blush-400 text-blush-600 dark:text-blush-300',
  success: 'border-l-green-400 text-green-700 dark:text-green-300',
  error: 'border-l-red-400 text-red-600 dark:text-red-300',
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore()
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`px-3 py-2 text-[11px] font-mono bg-surface border border-border border-l-4 shadow-sm cursor-pointer transition-opacity hover:opacity-80 ${TYPE_STYLES[t.type] || TYPE_STYLES.info}`}
          onClick={() => removeToast(t.id)}
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}
