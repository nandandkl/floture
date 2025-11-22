"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Calendar, Percent, History} from "lucide-react"
import Image from "next/image"

interface HistoryItem {
  flower: string
  confidence: number
  image: string
  timestamp: string
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load user's detection history
    const currentUser = JSON.parse(localStorage.getItem("floture_current_user") || "{}")
    const histories = JSON.parse(localStorage.getItem("floture_histories") || "{}")

    if (histories[currentUser.email]) {
      setHistory(histories[currentUser.email].reverse())
    }
    setLoading(false)
  }, [])

  const handleDelete = (index: number) => {
    const currentUser = JSON.parse(localStorage.getItem("floture_current_user") || "{}")
    const histories = JSON.parse(localStorage.getItem("floture_histories") || "{}")

    if (histories[currentUser.email]) {
      histories[currentUser.email].splice(history.length - 1 - index, 1)
      localStorage.setItem("floture_histories", JSON.stringify(histories))
      setHistory(history.filter((_, i) => i !== index))
    }
  }

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to delete all detection history? This cannot be undone.")) {
      const currentUser = JSON.parse(localStorage.getItem("floture_current_user") || "{}")
      const histories = JSON.parse(localStorage.getItem("floture_histories") || "{}")
      histories[currentUser.email] = []
      localStorage.setItem("floture_histories", JSON.stringify(histories))
      setHistory([])
    }
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2 mb-12">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10">
              <History className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Detection History</h1>
          </div>
          <p className="text-muted-foreground ml-11">
              {history.length} flower{history.length !== 1 ? "s" : ""} detected
            </p>
        </div>
        {history.length > 0 && (
          <Button
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-300 bg-transparent transition-all duration-300"
            onClick={handleClearAll}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {loading ? (
        <Card className="p-12 text-center border border-border">
          <p className="text-muted-foreground">Loading history...</p>
        </Card>
      ) : history.length === 0 ? (
        <Card className="p-12 text-center border border-border hover:border-primary/60 transition-all duration-300 cursor-pointer group bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl">
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground mb-1">No detections yet</p>
              <p className="text-muted-foreground">
                Start by uploading a flower photo to create your detection history
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item, idx) => (
            <Card key={idx} className="overflow-hidden p-0 border border-border hover:shadow-lg transition-shadow">
              {/* Image */}
              <div className="relative w-full aspect-square bg-secondary overflow-hidden">
                <Image src={item.image || "/placeholder.svg"} alt={item.flower} fill className="object-cover" />
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{item.flower}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Percent className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{item.confidence}% confidence</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {formatDate(item.timestamp)}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-red-200 text-red-600 hover:bg-red-300 bg-transparent transition-all duration-300"
                  onClick={() => handleDelete(idx)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
