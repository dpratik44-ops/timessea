"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/app-shell"
import {
  ArrowLeft,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading2,
  Link2,
  ImagePlus,
  Eye,
  Send,
  Loader2,
  Settings2,
} from "lucide-react"
import { categories } from "@/lib/data"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export default function EditorPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [isPreview, setIsPreview] = useState(false)
  const [published, setPublished] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)

  const wordCount = content
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length
  const readTime = Math.max(1, Math.ceil(wordCount / 200))

  const handlePublish = async () => {
    setIsPublishing(true)
    
    try {
      const response = await fetch('http://localhost:5000/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          category: selectedCategory || "General",
          readTime,
          author: {
            name: "Jason Todd",
            avatar: "JT",
            email: "jason@civicnews.com"
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to publish article');
      }

      setPublished(true)
      // Show success state briefly then redirect
      setTimeout(() => {
        setPublished(false)
        router.push('/explore')
      }, 1500)
    } catch (error) {
      console.error('Error publishing:', error);
      // Optional: Show error toast here
    } finally {
      setIsPublishing(false)
    }
  }

  const toolbarButtons = [
    { icon: Bold, label: "Bold", action: "**" },
    { icon: Italic, label: "Italic", action: "_" },
    { icon: Heading2, label: "Heading", action: "## " },
    { icon: Quote, label: "Quote", action: "> " },
    { icon: List, label: "List", action: "- " },
    { icon: ListOrdered, label: "Ordered list", action: "1. " },
    { icon: Link2, label: "Link", action: "[](url)" },
    { icon: ImagePlus, label: "Image", action: "![](url)" },
  ]

  return (
    <AppShell>
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="rounded-full bg-secondary/50 p-2 text-foreground transition-colors hover:bg-secondary"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2} />
          </motion.button>
          <span className="text-lg font-bold tracking-tight text-foreground">
            New Article
          </span>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground shadow-sm transition-colors hover:bg-secondary/50"
          >
            <Eye className="h-3.5 w-3.5" />
            {isPreview ? "Edit" : "Preview"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            disabled={!title.trim() || !content.trim() || published || isPublishing}
            onClick={handlePublish}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-background shadow-md transition-all",
              !title.trim() || !content.trim() || published || isPublishing
                ? "bg-muted text-muted-foreground shadow-none cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {isPublishing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            {published ? "Published!" : "Publish"}
          </motion.button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {published && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-center"
          >
            <p className="text-sm font-semibold text-green-500">
              Your article has been published successfully! Redirecting...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative min-h-[calc(100vh-12rem)]">
        <AnimatePresence mode="wait">
          {isPreview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6 rounded-3xl bg-card p-6 shadow-sm border border-border/50"
            >
              <h1 className="text-3xl font-black leading-tight tracking-tight text-foreground font-serif text-balance">
                {title || "Untitled Article"}
              </h1>
              
              <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">JT</div>
                  <span className="text-foreground">Jason Todd</span>
                </div>
                <span className="text-border">|</span>
                <span>Just now</span>
                <span className="text-border">|</span>
                <span className="flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                  {readTime} min read
                </span>
              </div>

              {selectedCategory && (
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary ring-1 ring-inset ring-primary/20">
                  {selectedCategory}
                </span>
              )}

              <div className="h-px w-full bg-border/50" />

              <article className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
                {content ? (
                  content.split("\n\n").map((paragraph, index) => (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      key={index}
                      className="leading-relaxed text-base"
                    >
                      {paragraph}
                    </motion.p>
                  ))
                ) : (
                  <p className="italic text-muted-foreground/50">No content to preview...</p>
                )}
              </article>
            </motion.div>
          ) : (
            <motion.div
              key="editor"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Title Input */}
              <div className="relative group">
                 <input
                  type="text"
                  placeholder="Article Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-transparent text-4xl font-black placeholder:text-muted-foreground/20 focus:outline-none font-serif tracking-tight py-2 border-b-2 border-transparent focus:border-primary/20 transition-colors"
                />
              </div>

              {/* Category Selector */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Settings2 className="w-3 h-3" /> Category
                </label>
                <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 scrollbar-none snap-x">
                  {categories
                    .filter((c) => c !== "Trending")
                    .map((category) => (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        key={category}
                        type="button"
                        onClick={() =>
                          setSelectedCategory(
                            selectedCategory === category ? "" : category
                          )
                        }
                        className={cn(
                          "snap-start shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all shadow-sm border border-transparent",
                          selectedCategory === category
                            ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20 ring-offset-2 ring-offset-background"
                            : "bg-secondary/50 text-muted-foreground border-border hover:bg-secondary hover:text-foreground"
                        )}
                      >
                        {category}
                      </motion.button>
                    ))}
                </div>
              </div>

              {/* Editor Container */}
              <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all duration-300">
                {/* Toolbar */}
                <div className="flex items-center gap-1 overflow-x-auto border-b border-border bg-muted/30 px-4 py-2 scrollbar-none">
                  {toolbarButtons.map((btn) => (
                    <motion.button
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.05)" }}
                      whileTap={{ scale: 0.9 }}
                      key={btn.label}
                      type="button"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors"
                      title={btn.label}
                      onClick={() => setContent((prev) => prev + btn.action)}
                    >
                      <btn.icon className="h-4 w-4" strokeWidth={2} />
                      <span className="sr-only">{btn.label}</span>
                    </motion.button>
                  ))}
                  <div className="ml-auto text-[10px] font-medium text-muted-foreground bg-background/50 px-2 py-1 rounded-md border border-border">
                    {wordCount} words
                  </div>
                </div>

                {/* Content Editor */}
                <textarea
                  placeholder="Start writing your story..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full min-h-[400px] resize-y bg-transparent p-6 text-base leading-relaxed placeholder:text-muted-foreground/30 focus:outline-none font-medium text-foreground"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  )
}

