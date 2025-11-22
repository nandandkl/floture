"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Upload, Loader2, AlertCircle, Lock, Leaf, Droplets, Sun } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface DetectionResult {
  flower: string
  confidence: number
  description: string
  care: string
  color: string
  bloomingSeason: string
}

interface FlowerDetectorProps {
  isLoggedIn: boolean
}

export default function FlowerDetector({ isLoggedIn }: FlowerDetectorProps) {
  const [image, setImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DetectionResult | null>(null)
  const [error, setError] = useState("")

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isLoggedIn) {
      setError("Please log in to upload images")
      return
    }

    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setImage(event.target?.result as string)
      setError("")
    }
    reader.readAsDataURL(file)
  }

  const handleDetect = async () => {
    if (!image) return

    setLoading(true)
    setError("")

    try {
      const base64Data = image.split(",")[1]
      const binaryString = atob(base64Data)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      const blob = new Blob([bytes], { type: "image/jpeg" })

      const formData = new FormData()
      formData.append("images", blob)
      formData.append("organs", "auto")

      const response = await fetch("https://api.plant.id/v2/identify", {
        method: "POST",
        headers: {
          "Api-Key": "Yjc1YzA0OTUtZTEwZC00YTMyLTg1MmQtNzAxYTI1ZmMwMDk2",
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Detection API error")
      }

      const data = await response.json()

      if (data.results && data.results.length > 0) {
        const topResult = data.results[0]
        const commonNames = topResult.plant_details?.common_names || ["Unknown Flower"]

        const flowerData: DetectionResult = {
          flower: commonNames[0] || topResult.species?.common_names?.[0] || "Unknown",
          confidence: Math.round((topResult.probability || 0) * 100),
          description: topResult.plant_details?.description || "A beautiful flower species",
          care: topResult.plant_details?.watering?.text || "Water regularly",
          color: topResult.plant_details?.image_url ? "As shown" : "Varies",
          bloomingSeason: topResult.plant_details?.taxonomy?.genus || "Year-round",
        }

        setResult(flowerData)

        if (isLoggedIn) {
          const currentUser = JSON.parse(localStorage.getItem("floture_current_user") || "{}")
          const histories = JSON.parse(localStorage.getItem("floture_histories") || "{}")

          if (!histories[currentUser.email]) {
            histories[currentUser.email] = []
          }

          histories[currentUser.email].push({
            flower: flowerData.flower,
            confidence: flowerData.confidence,
            image: image,
            timestamp: new Date().toISOString(),
          })

          localStorage.setItem("floture_histories", JSON.stringify(histories))
        }
      } else {
        setError("No flowers detected in the image. Please try another photo.")
      }
    } catch (err) {
      console.error("Detection error:", err)
      setError("Detection failed. Please try another image.")
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setImage(null)
    setResult(null)
    setError("")
  }

  return (
    <div className="space-y-6">
      {!isLoggedIn && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
          <Card className="p-8 border border-border bg-card space-y-4 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Sign in to detect flowers</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create an account or log in to start identifying flowers
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/auth/login" className="flex-1">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup" className="flex-1">
                <Button variant="outline" className="w-full border-border bg-transparent font-semibold">
                  Sign Up
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      )}

      <div className={`space-y-6 ${!isLoggedIn ? "relative opacity-60 pointer-events-none" : ""}`}>
        {!image ? (
          <Card className="border-2 border-dashed border-border p-12 text-center hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 cursor-pointer group">
            <label className="block cursor-pointer">
              <Input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition">
                    <Upload className="w-10 h-10 text-primary" />
                  </div>
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground mb-1">Upload a flower photo</p>
                  <p className="text-sm text-muted-foreground">Click to browse or drag and drop your image here</p>
                </div>
                <p className="text-xs text-muted-foreground font-medium">JPEG, PNG, or WebP (max 10MB)</p>
              </div>
            </label>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 border border-border shadow-lg">
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-secondary border border-border">
                <Image src={image || "/placeholder.svg"} alt="Uploaded flower" fill className="object-cover" />
              </div>
              <Button
                variant="outline"
                className="w-full mt-4 border-border bg-transparent hover:bg-secondary font-semibold"
                onClick={() => setImage(null)}
              >
                Change Image
              </Button>
            </Card>

            <div className="space-y-4">
              {!result ? (
                <>
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 font-semibold text-base"
                    onClick={handleDetect}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Leaf className="w-5 h-5 mr-2" />
                        Detect Flower
                      </>
                    )}
                  </Button>
                  {error && (
                    <div className="flex gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700 font-medium">{error}</p>
                    </div>
                  )}
                </>
              ) : (
                <Card className="p-6 border border-border shadow-lg space-y-4">
                  <div>
                    <h2 className="text-3xl font-bold text-foreground mb-3">{result.flower}</h2>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-muted-foreground">Confidence</span>
                        <span className="text-sm font-bold text-primary">{result.confidence}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-primary to-accent h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${result.confidence}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-border">
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-2">About this flower</p>
                      <p className="text-sm text-foreground leading-relaxed">{result.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="bg-secondary rounded-lg p-3 space-y-1">
                        <div className="flex items-center gap-2">
                          <Droplets className="w-4 h-4 text-primary" />
                          <p className="text-xs font-semibold text-muted-foreground">Watering</p>
                        </div>
                        <p className="text-sm text-foreground font-medium">{result.care}</p>
                      </div>
                      <div className="bg-secondary rounded-lg p-3 space-y-1">
                        <div className="flex items-center gap-2">
                          <Sun className="w-4 h-4 text-primary" />
                          <p className="text-xs font-semibold text-muted-foreground">Season</p>
                        </div>
                        <p className="text-sm text-foreground font-medium">{result.bloomingSeason}</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 font-semibold"
                    onClick={handleReset}
                  >
                    Identify Another Flower
                  </Button>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
