"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { ReelCard } from "@/components/reel-card"
import type { Article } from "@/lib/data"

const reelImages = [
  "/images/reel-web3.jpg",
  "/images/reel-leadership.jpg",
  "/images/reel-design.jpg",
  "/images/reel-quantum.jpg",
  "/images/reel-remote.jpg",
  "/images/reel-ai-art.jpg",
]

export default function ExplorePage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await fetch("http://localhost:5000/api/articles")
        if (!response.ok) throw new Error("Failed to fetch articles")
        const data = await response.json()
        setArticles(data)
      } catch (error) {
        console.error("Error fetching articles:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchArticles()
  }, [])

  const toggleLike = useCallback(async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/articles/${id}/like`, {
        method: "POST",
      })
      if (!response.ok) throw new Error("Failed to like article")
      
      const updatedArticle = await response.json()
      
      setArticles((prev) =>
        prev.map((article) =>
          article.id === id ? updatedArticle : article
        )
      )
    } catch (error) {
      console.error("Error liking article:", error)
    }
  }, [])

  const toggleSave = useCallback(async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/articles/${id}/bookmark`, {
        method: "POST",
      })
      if (!response.ok) throw new Error("Failed to bookmark article")
      
      const updatedArticle = await response.json()
      
      setArticles((prev) =>
        prev.map((article) =>
          article.id === id ? updatedArticle : article
        )
      )
    } catch (error) {
      console.error("Error bookmarking article:", error)
    }
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollTop = container.scrollTop
      const height = container.clientHeight
      const newIndex = Math.round(scrollTop / height)
      if (
        newIndex !== activeIndex &&
        newIndex >= 0 &&
        newIndex < articles.length
      ) {
        setActiveIndex(newIndex)
      }
    }

    container.addEventListener("scroll", handleScroll, { passive: true })
    return () => container.removeEventListener("scroll", handleScroll)
  }, [activeIndex, articles.length])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        Loading...
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg bg-background">
      {/* Reels container */}
      <div
        ref={containerRef}
        className="h-dvh snap-y snap-mandatory overflow-y-auto scrollbar-hide"
        style={{ scrollBehavior: "smooth" }}
      >
        {articles.map((article, index) => {
          // Determine liked/saved locally from article state (which comes from backend)
          // The backend response for toggleLike updates the article.liked field.
          const isLiked = article.liked
          const isSaved = article.bookmarked

          return (
            <ReelCard
              key={article.id}
              article={article}
              index={index}
              totalArticles={articles.length}
              imageSrc={reelImages[index % reelImages.length] || "/placeholder.svg"}
              isLiked={isLiked}
              isSaved={isSaved}
              onToggleLike={toggleLike}
              onToggleSave={toggleSave}
            />
          )
        })}
      </div>

      {/* Progress bar */}
      <div className="fixed top-0 left-1/2 z-50 -translate-x-1/2 w-full max-w-lg">
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <h1 className="text-base font-bold text-foreground">Explore</h1>
          <span className="text-[11px] text-muted-foreground">
            {activeIndex + 1} of {articles.length}
          </span>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
