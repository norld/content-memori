"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import CaptureSection from "@/components/capture-section"
import ContentGrid from "@/components/content-grid"
import DetailModal from "@/components/detail-modal"
import LoginModal from "@/components/login-modal"
import Toast from "@/components/toast"
import { useAuth } from "@/lib/auth-context"
import { supabase, ideasTable, type Idea } from "@/lib/supabase"

export default function Home() {
  const { user, loading: authLoading, signOut } = useAuth()
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [filteredIdeas, setFilteredIdeas] = useState<Idea[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  // Load ideas from Supabase when user is authenticated
  useEffect(() => {
    if (user) {
      setLoading(true)
      loadIdeas()
    } else {
      setIdeas([])
      setLoading(false)
    }
  }, [user])

  // Real-time subscription for ideas
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel(`ideas:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: ideasTable,
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newIdeas = [payload.new as Idea, ...ideas]
            setIdeas(newIdeas)
            filterIdeas(newIdeas, searchQuery)
          } else if (payload.eventType === "UPDATE") {
            const newIdeas = ideas.map((idea) =>
              idea.id === payload.new.id ? (payload.new as Idea) : idea
            )
            setIdeas(newIdeas)
            filterIdeas(newIdeas, searchQuery)
          } else if (payload.eventType === "DELETE") {
            const newIdeas = ideas.filter((idea) => idea.id !== payload.old.id)
            setIdeas(newIdeas)
            filterIdeas(newIdeas, searchQuery)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, ideas, searchQuery])

  const loadIdeas = async () => {
    try {
      const { data, error } = await supabase
        .from(ideasTable)
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      const loadedIdeas = data || []
      setIdeas(loadedIdeas)
      setFilteredIdeas(loadedIdeas)
    } catch (error) {
      console.error("Error loading ideas:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveIdea = async (newIdea: Omit<Idea, "id">): Promise<boolean> => {
    if (!user) {
      setShowLoginModal(true)
      return false
    }

    try {
      const { data, error } = await supabase
        .from(ideasTable)
        .insert({
          type: newIdea.type,
          type_color: newIdea.type_color,
          title: newIdea.title,
          description: newIdea.description,
          category: newIdea.category,
          edited: newIdea.edited,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) throw error

      setShowToast(true)
      setTimeout(() => setShowToast(false), 2000)
      return true
    } catch (error) {
      console.error("Error saving idea:", error)
      return false
    }
  }

  const handleDeleteIdea = async (id: number) => {
    try {
      const { error } = await supabase
        .from(ideasTable)
        .delete()
        .eq("id", id)

      if (error) throw error

      setShowDetailModal(false)

      // Refetch ideas after delete (fallback if realtime doesn't work)
      await loadIdeas()
    } catch (error) {
      console.error("Error deleting idea:", error)
    }
  }

  const handleUpdateIdea = async (updatedIdea: Idea) => {
    try {
      const { error } = await supabase
        .from(ideasTable)
        .update({
          title: updatedIdea.title,
          description: updatedIdea.description,
          type: updatedIdea.type,
          edited: "Yes",
        })
        .eq("id", updatedIdea.id)

      if (error) throw error

      setShowDetailModal(false)

      // Refetch ideas after update (fallback if realtime doesn't work)
      await loadIdeas()
    } catch (error) {
      console.error("Error updating idea:", error)
    }
  }

  const handleOpenDetail = (idea: Idea) => {
    setSelectedIdea(idea)
    setShowDetailModal(true)
  }

  const handleLogout = async () => {
    await signOut()
  }

  // Filter ideas based on search query
  const filterIdeas = (ideasList: Idea[], query: string) => {
    if (!query.trim()) {
      setFilteredIdeas(ideasList)
      return
    }

    const lowercaseQuery = query.toLowerCase()
    const filtered = ideasList.filter(
      (idea) =>
        idea.title.toLowerCase().includes(lowercaseQuery) ||
        idea.description.toLowerCase().includes(lowercaseQuery) ||
        idea.category.toLowerCase().includes(lowercaseQuery) ||
        idea.type.toLowerCase().includes(lowercaseQuery)
    )
    setFilteredIdeas(filtered)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    filterIdeas(ideas, query)
  }

  if (authLoading) {
    return (
      <div className="bg-neutral-900 text-neutral-200 antialiased min-h-screen flex items-center justify-center">
        <div className="text-neutral-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="bg-neutral-900 text-neutral-200 antialiased min-h-screen flex flex-col overflow-hidden relative selection:bg-rose-500/30 selection:text-rose-200">
      {/* Ambient Background */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[120px] opacity-40"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-neutral-800/50 rounded-full blur-[100px] opacity-30"></div>
      </div>

      <Header
        user={user}
        onLogout={handleLogout}
        onLogin={() => setShowLoginModal(true)}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      <main className="relative z-10 flex-1 overflow-y-auto w-full max-w-7xl mx-auto px-6 lg:px-12 py-8 flex flex-col gap-10">
        <CaptureSection onSave={handleSaveIdea} />
        {user && <ContentGrid ideas={filteredIdeas} onOpenDetail={handleOpenDetail} loading={loading} />}

        <div className="h-12"></div>
      </main>

      {showDetailModal && selectedIdea && (
        <DetailModal
          idea={selectedIdea}
          onClose={() => setShowDetailModal(false)}
          onDelete={() => handleDeleteIdea(selectedIdea.id!)}
          onUpdate={handleUpdateIdea}
        />
      )}

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}

      {showToast && <Toast />}
    </div>
  )
}
