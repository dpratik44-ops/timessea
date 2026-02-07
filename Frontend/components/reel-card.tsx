"use client"

import Image from "next/image"
import Link from "next/link"
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  ChevronUp,
  MoreHorizontal,
  Clock,
  Eye,
  ArrowRight,
} from "lucide-react"
import type { Article } from "@/lib/data"
import { cn } from "@/lib/utils"

interface ReelCardProps {
  article: Article
  index: number
  totalArticles: number
  imageSrc: string
  isLiked: boolean
  isSaved: boolean
  onToggleLike: (id: string) => void
  onToggleSave: (id: string) => void
}

function extractKeyPoints(content: string): string[] {
  const boldMatches = content.match(/\*\*([^*]+)\*\*/g)
  if (boldMatches) {
    return boldMatches
      .slice(0, 3)
      .map((m) => m.replace(/\*\*/g, ""))
      .filter((p) => p.length < 60)
  }
  return []
}

export function ReelCard({
  article,
  index,
  totalArticles,
  imageSrc,
  isLiked,
  isSaved,
  onToggleLike,
  onToggleSave,
}: ReelCardProps) {
  const keyPoints = extractKeyPoints(article.content)
  const commentCount = Math.floor(article.likes * 0.3)
  const viewCount = article.likes * 12 + Math.floor(Math.random() * 500)

  return (
    <div className="relative h-dvh w-full snap-start snap-always flex flex-col bg-background">
      {/* Top section: small image with overlay info */}
      <div className="relative mx-4 mt-16 h-56 shrink-0 overflow-hidden rounded-3xl bg-muted shadow-md ring-1 ring-border/20">
        <Image
          src={imageSrc}
          alt={article.title}
          fill
          className="object-cover"
          priority={index < 2}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

        {/* Category + read time on image */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="rounded-full bg-accent px-3 py-1 text-[10px] font-bold text-accent-foreground shadow-sm">
            {article.category}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-black/40 px-3 py-1 text-[10px] font-bold text-white backdrop-blur-md ring-1 ring-white/10">
            <Clock className="h-3 w-3" />
            {article.readTime} min
          </span>
        </div>

        {/* Slide indicator */}
        <div className="absolute top-4 right-4">
          <span className="rounded-full bg-black/40 px-3 py-1 text-[10px] font-bold text-white backdrop-blur-md ring-1 ring-white/10">
            {index + 1}/{totalArticles}
          </span>
        </div>

        {/* Title on image bottom */}
        <div className="absolute inset-x-0 bottom-0 p-5">
           <div className="flex items-center gap-2 mb-2">
             <div className="h-5 w-5 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-[10px] font-bold text-white">
                {article.author.avatar || article.author.name.charAt(0)}
             </div>
             <span className="text-xs font-bold text-white/90 shadow-black/50 drop-shadow-sm">
                {article.author.name}
             </span>
           </div>
          <h2 className="text-2xl font-black leading-tight text-white text-balance drop-shadow-md font-serif">
            {article.title}
          </h2>
        </div>
      </div>

      {/* Details section: takes up the rest of the screen */}
      <div className="flex flex-1 flex-col overflow-hidden px-5 pt-5 pb-5">
        
        {/* Stats row */}
        <div className="flex items-center justify-between rounded-2xl bg-secondary/30 px-4 py-3 border border-border/50">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-bold text-muted-foreground">
              {viewCount.toLocaleString()}
            </span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-muted-foreground" />
             <span className="text-xs font-bold text-muted-foreground">
              {article.likes + (isLiked && !article.liked ? 1 : 0)}
            </span>
          </div>
           <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-bold text-muted-foreground">
              {commentCount}
            </span>
          </div>
        </div>

        {/* Excerpt */}
        <p className="mt-4 text-[15px] font-medium leading-relaxed text-foreground/90 font-serif">
          {article.excerpt}
        </p>

        {/* Key points */}
        {keyPoints.length > 0 && (
          <div className="mt-4 space-y-2">
            {keyPoints.map((point) => (
              <div
                key={point}
                className="flex items-start gap-3 rounded-xl bg-secondary/30 px-3 py-2.5"
              >
                <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span className="text-xs font-medium leading-snug text-foreground/90">
                  {point}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Preview text */}
        <div className="mt-4 relative flex-1 overflow-hidden">
             <p className="text-sm leading-relaxed text-muted-foreground">
              {article.content
                .replace(/\*\*[^*]+\*\*/g, "")
                .replace(/\n+/g, " ")
                .trim()
                .slice(0, 150)}
              <span className="opacity-50">...</span>
            </p>
             <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-background to-transparent" />
        </div>
       

        {/* Read full article CTA */}
        <Link
          href={`/article/${article.id}`}
          className="mt-2 text-center rounded-2xl bg-foreground p-4 font-bold text-sm text-background shadow-lg shadow-foreground/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          Read Full Story
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

       {/* Bottom Floating Action Bar */}
       <div className="absolute bottom-24 right-5 flex flex-col items-center gap-4 z-10 pointer-events-none">
          <div className="pointer-events-auto flex flex-col gap-4">
            <button
              type="button"
              onClick={() => onToggleLike(article.id)}
              className="flex flex-col items-center gap-1 group"
              aria-label={isLiked ? "Unlike" : "Like"}
            >
              <div className={cn(
                  "h-12 w-12 rounded-full flex items-center justify-center shadow-lg transition-all transform group-active:scale-90",
                   isLiked ? "bg-red-500 text-white" : "bg-card text-foreground border border-border/50"
                  )}>
                  <Heart className={cn("h-6 w-6 transition-transform", isLiked && "fill-current")} strokeWidth={2} />
              </div>
              <span className="text-[10px] font-bold text-foreground bg-background/50 backdrop-blur-md px-2 py-0.5 rounded-full shadow-sm">
                {article.likes + (isLiked && !article.liked ? 1 : 0)}
              </span>
            </button>

             <button
              type="button"
               className="flex flex-col items-center gap-1 group"
            >
              <div className="h-12 w-12 rounded-full bg-card text-foreground border border-border/50 flex items-center justify-center shadow-lg transition-all transform group-active:scale-90 group-hover:bg-secondary">
                  <MessageCircle className="h-6 w-6" strokeWidth={2} />
              </div>
               <span className="text-[10px] font-bold text-foreground bg-background/50 backdrop-blur-md px-2 py-0.5 rounded-full shadow-sm">
                {commentCount}
              </span>
            </button>

             <button
              type="button"
               onClick={() => onToggleSave(article.id)}
               className="flex flex-col items-center gap-1 group"
            >
              <div className={cn(
                  "h-12 w-12 rounded-full flex items-center justify-center shadow-lg transition-all transform group-active:scale-90",
                   isSaved ? "bg-primary text-primary-foreground" : "bg-card text-foreground border border-border/50"
                  )}>
                  <Bookmark className={cn("h-6 w-6 transition-transform", isSaved && "fill-current")} strokeWidth={2} />
              </div>
            </button>
             
             <button
              type="button"
               className="flex flex-col items-center gap-1 group"
            >
              <div className="h-12 w-12 rounded-full bg-card text-foreground border border-border/50 flex items-center justify-center shadow-lg transition-all transform group-active:scale-90 group-hover:bg-secondary">
                  <Send className="h-5 w-5 ml-0.5" strokeWidth={2} />
              </div>
            </button>
          </div>
       </div>

      {/* Swipe hint on first reel */}
      {index === 0 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex animate-bounce flex-col items-center gap-1 text-muted-foreground/50 pointer-events-none z-0">
          <ChevronUp className="h-5 w-5" />
          <span className="text-[10px] font-bold tracking-widest uppercase">
            Swipe
          </span>
        </div>
      )}
    </div>
  )
}
