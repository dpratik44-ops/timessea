"use client"

import { useState, useEffect } from "react"
import { AppShell } from "@/components/app-shell"
import { ArticleCardCompact } from "@/components/article-card"
import { Bookmark, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
// import { articles } from "@/lib/data" // Deleted import
import type { Article } from "@/lib/data" // Type only

export default function BookmarksPage() {
  const [savedArticles, setSavedArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"all" | "recent">("all")

  useEffect(() => {
    async function fetchBookmarkedArticles() {
      try {
        const res = await fetch("http://localhost:5000/api/articles")
        if (!res.ok) throw new Error("Failed to fetch")
        const allArticles: Article[] = await res.json()
        const bookmarked = allArticles.filter((a) => a.bookmarked)
        setSavedArticles(bookmarked)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchBookmarkedArticles()
  }, [])

  const removeBookmark = async (id: string) => {
    // Optimistic UI update
    setSavedArticles((prev) => prev.filter((a) => a.id !== id))
    
    try {
      await fetch(`http://localhost:5000/api/articles/${id}/bookmark`, {
        method: "POST"
      })
    } catch (err) {
      console.error("Failed to remove bookmark", err)
      // Revert if failed (optional, but good practice)
    }
  }

  const displayedArticles =
    activeTab === "recent" ? savedArticles.slice(0, 2) : savedArticles

  if (isLoading) {
    return (
      <AppShell>
         <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      {/* Header */}
      <header className="mb-5">
        <h1 className="text-xl font-bold text-foreground">Saved</h1>
      </header>

      {/* Tabs */}
      <div className="mb-5 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={cn(
            "rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
            activeTab === "all"
              ? "bg-foreground text-background"
              : "bg-secondary text-muted-foreground"
          )}
        >
          All ({savedArticles.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("recent")}
          className={cn(
            "rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
            activeTab === "recent"
              ? "bg-foreground text-background"
              : "bg-secondary text-muted-foreground"
          )}
        >
          Recent
        </button>
      </div>

      {/* Articles */}
      {displayedArticles.length > 0 ? (
        <div className="space-y-2.5">
          {displayedArticles.map((article) => (
            <div key={article.id} className="relative group">
              <ArticleCardCompact article={article} />
              <button
                type="button"
                className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-card/90 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
                onClick={(e) => {
                  e.preventDefault()
                  removeBookmark(article.id)
                }}
                aria-label="Remove bookmark"
              >
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary mb-3">
            <Bookmark className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-medium text-foreground">
            No saved articles yet
          </p>
          <p className="mt-1 text-xs text-muted-foreground text-center max-w-[240px]">
            Articles you bookmark will appear here for easy access later
          </p>
        </div>
      )}
    </AppShell>
  )
}
