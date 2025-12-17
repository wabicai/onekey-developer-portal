'use client'

import { useEffect, useMemo, useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, vs } from 'react-syntax-highlighter/dist/esm/styles/prism'

function useIsDarkMode() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    if (typeof document === 'undefined') return undefined
    const root = document.documentElement
    const update = () => setIsDark(root.classList.contains('dark'))
    update()
    const observer = new MutationObserver(update)
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return isDark
}

function normalizeLineSet(lines) {
  const set = new Set()
  for (const n of Array.isArray(lines) ? lines : []) {
    const v = Number(n)
    if (Number.isFinite(v) && v > 0) set.add(v)
  }
  return set
}

export function EditorCodeBlock({
  code,
  language = 'typescript',
  activeLine,
  breakpoints,
  showBreakpoints = false,
  maxHeight = 560,
  dataTour,
  filename
}) {
  const isDark = useIsDarkMode()
  const bp = useMemo(() => normalizeLineSet(breakpoints), [breakpoints])
  const active = Number.isFinite(Number(activeLine)) ? Number(activeLine) : null

  return (
    <div
      data-tour={dataTour}
      className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-[#3a3f4b] dark:bg-[#1e1e1e]"
    >
      <div className="flex items-center gap-2 border-b border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-700 dark:border-[#2c313c] dark:bg-[#21252b] dark:text-[#d7dae0]">
        <span className="inline-flex items-center rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-[10px] text-zinc-700 dark:bg-[#2c313c] dark:text-[#9da5b4]">
          {language === 'json' ? 'JSON' : 'TS'}
        </span>
        <span className="font-mono text-[11px] text-zinc-500 dark:text-[#9da5b4]">
          {filename ?? (language === 'json' ? 'result.json' : 'demo.ts')}
        </span>
      </div>

      <div className="overflow-auto" style={{ maxHeight }}>
        <SyntaxHighlighter
          language={language}
          style={isDark ? oneDark : vs}
          showLineNumbers
          wrapLines
          customStyle={{
            margin: 0,
            padding: '12px 0',
            // One Dark Pro-ish background
            background: isDark ? '#282c34' : '#ffffff',
            fontSize: 13,
            lineHeight: 1.6,
            fontFamily: 'var(--font-mono)'
          }}
          lineNumberStyle={(lineNumber) => {
            const isBp = bp.has(lineNumber)
            return {
              position: 'relative',
              minWidth: 54,
              paddingRight: 12,
              paddingLeft: 22,
              textAlign: 'right',
              userSelect: 'none',
              opacity: 0.85,
              color: isDark ? '#7f848e' : '#6b7280',
              ...(showBreakpoints && isBp
                ? {
                    backgroundImage: `radial-gradient(circle, ${isDark ? '#ff5f56' : '#dc2626'} 48%, transparent 49%)`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: '10px center',
                    backgroundSize: '14px 14px'
                  }
                : null)
            }
          }}
          lineProps={(lineNumber) => {
            const isActive = active !== null && lineNumber === active
            const isBp = bp.has(lineNumber)
            return {
              style: {
                display: 'block',
                paddingRight: 12,
                borderLeft: isActive ? '2px solid #00B812' : '2px solid transparent',
                background: isActive
                  ? isDark
                    ? '#2c313c'
                    : 'rgba(0, 184, 18, 0.08)'
                  : showBreakpoints && isBp
                    ? isDark
                      ? 'rgba(239, 68, 68, 0.06)'
                      : 'rgba(239, 68, 68, 0.05)'
                    : 'transparent'
              }
            }
          }}
        >
          {String(code ?? '')}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}
