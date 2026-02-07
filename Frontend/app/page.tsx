"use client"

import { useState } from "react"
import Link from "next/link"
import { AppShell } from "@/components/app-shell"
import {
  ArticleCardFeatured,
  ArticleCardHorizontal,
} from "@/components/article-card"
import { Search, Bell } from "lucide-react"
import { articles, categories } from "@/lib/data"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("Trending")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredArticles = articles.filter((a) => {
    const matchesCategory =
      activeCategory === "Trending" || a.category === activeCategory
    const matchesSearch =
      searchQuery === "" ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.author.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Safe check for empty array
  const featured = filteredArticles.length > 0 ? filteredArticles[0] : null
  const rest = filteredArticles.length > 1 ? filteredArticles.slice(1) : []

  return (
    <AppShell>
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-foreground font-serif tracking-tight">Hello Jason</h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">
            Discover today's top stories
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" className="relative p-2 rounded-full hover:bg-secondary transition-colors" aria-label="Notifications">
            <Bell className="h-6 w-6 text-foreground" strokeWidth={2} />
            <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-background" />
          </button>
          <Link href="/profile" className="relative group">
            <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-background shadow-md transition-transform group-hover:scale-105">
                 {/* Replaced Avatar with simple div logic */}
                <div className="h-full w-full bg-foreground text-background flex items-center justify-center text-xs font-bold">
                  JT
                </div>
            </div>
          </Link>
        </div>
      </header>

      {/* Search Bar */}
      <div className="relative mb-8 group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Search for articles, topics..."
          className="w-full h-12 rounded-2xl bg-secondary/50 border border-transparent focus:bg-background focus:border-primary/20 hover:bg-secondary/80 pl-11 pr-4 text-sm font-medium transition-all shadow-sm outline-none placeholder:text-muted-foreground/70"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Category Tabs */}
      <div className="-mx-5 mb-8 flex items-center gap-2 overflow-x-auto px-5 pb-2 scrollbar-none snap-x">
        {categories.map((category) => (
          <motion.button
            whileTap={{ scale: 0.95 }}
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={cn(
              "snap-start shrink-0 rounded-full px-5 py-2.5 text-xs font-bold transition-all shadow-sm border border-transparent",
              activeCategory === category
                ? "bg-foreground text-background shadow-md transform scale-105"
                : "bg-card text-muted-foreground border-border hover:bg-secondary hover:text-foreground"
            )}
          >
            {category}
          </motion.button>
        ))}
      </div>

      {/* Featured Article */}
      {featured && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4 px-1">
             <h2 className="text-xl font-bold font-serif">Featured</h2>
             <Link href="/explore" className="text-xs font-bold text-primary hover:underline">View All</Link>
          </div>
          <ArticleCardFeatured article={featured} />
        </motion.div>
      )}

      {/* Articles List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2 px-1">
             <h2 className="text-lg font-bold font-serif">Latest News</h2>
        </div>
        {rest.length > 0 ? (
           rest.map((article, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.3 }}
              key={article.id}
            >
              <ArticleCardHorizontal article={article} />
            </motion.div>
          ))
        ) : (
             !featured && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-secondary/50 p-4 rounded-full mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-base font-bold text-foreground">
                  No articles found
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try adjusting your search for "{searchQuery}"
                </p>
              </div>
            )
        )}
      </div>
    </AppShell>
  )
}
