// "use client"

// import type React from "react"
// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Upload, Loader2, AlertCircle, CheckCircle2, Sparkles } from "lucide-react"
// import Image from "next/image"

// interface DetectionResult {
//   flower: string
//   confidence: number
//   description: string
//   care: string
//   color: string
//   bloomingSeason: string
// }

// const FLOWER_INFO: any = {
//   rose: {
//     description: "Roses are classic ornamental flowers known for their fragrance and beauty.",
//     care: "Water regularly and provide 6 hours of sunlight daily.",
//     color: "Red, pink, white, yellow.",
//     bloomingSeason: "Spring to fall",
//   },
//   sunflower: {
//     description: "Sunflowers are tall, bright flowers that follow the direction of the sun.",
//     care: "Full sunlight and moderate watering.",
//     color: "Yellow with a dark center.",
//     bloomingSeason: "Summer",
//   },
//   tulip: {
//     description: "Tulips are bulbous spring flowers known for their vibrant colors.",
//     care: "Plant in well-drained soil and keep soil lightly moist.",
//     color: "Red, yellow, pink, purple.",
//     bloomingSeason: "Spring",
//   },
//   dandelion: {
//     description: "Dandelions are bright yellow flowers often found in the wild.",
//     care: "Thrives naturally, requires little to no maintenance.",
//     color: "Yellow",
//     bloomingSeason: "Spring to early summer",
//   },
//   daisy: {
//     description: "Daisies are cheerful flowers with white petals and yellow centers.",
//     care: "Provide full sunlight and water moderately.",
//     color: "White with a yellow center.",
//     bloomingSeason: "Spring to autumn",
//   },
//   none: {
//     description: "No flower was detected in the image.",
//     care: "Try uploading a clearer image.",
//     color: "N/A",
//     bloomingSeason: "N/A",
//   },
// };


// export default function DetectPage() {
//   const [image, setImage] = useState<string | null>(null)
//   const [loading, setLoading] = useState(false)
//   const [result, setResult] = useState<DetectionResult | null>(null)
//   const [error, setError] = useState("")

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (!file) return

//     if (!file.type.startsWith("image/")) {
//       setError("Please upload an image file")
//       return
//     }

//     const reader = new FileReader()
//     reader.onload = (event) => {
//       setImage(event.target?.result as string)
//       setError("")
//     }
//     reader.readAsDataURL(file)
//   }

//   const handleDetect = async () => {
//   if (!image) return;

//   setLoading(true);
//   setError("");

//   try {
//     const base64Data = image.split(",")[1];
//     const binaryString = atob(base64Data);
//     const bytes = new Uint8Array(binaryString.length);

//     for (let i = 0; i < binaryString.length; i++) {
//       bytes[i] = binaryString.charCodeAt(i);
//     }

//     const blob = new Blob([bytes], { type: "image/jpeg" });

//     const formData = new FormData();
//     formData.append("file", blob);

//     const response = await fetch("https://floture-api.onrender.com/predict", {
//       method: "POST",
//       body: formData,
//     });

//     if (!response.ok) {
//       throw new Error("Detection API error");
//     }

//     const data = await response.json();
//     console.log("Prediction:", data);

//     const detectedFlower = (data.class || "none").toLowerCase();
//     const info = FLOWER_INFO[detectedFlower] || FLOWER_INFO["none"];



//     // Adjust these fields to match your backend response
//     const flowerData: DetectionResult = {
//       flower: data.class || "Unknown",
//       confidence: Math.round((data.confidence || 0) * 100),
//       description: info.description,
//       care: info.care,
//       color: info.color,
//       bloomingSeason: info.bloomingSeason,
//     };

//     setResult(flowerData);

//     const currentUser = JSON.parse(localStorage.getItem("floture_current_user") || "{}");
//     const histories = JSON.parse(localStorage.getItem("floture_histories") || "{}");

//     if (!histories[currentUser.email]) {
//       histories[currentUser.email] = [];
//     }

//     histories[currentUser.email].push({
//       flower: flowerData.flower,
//       confidence: flowerData.confidence,
//       image: image,
//       timestamp: new Date().toISOString(),
//     });

//     localStorage.setItem("floture_histories", JSON.stringify(histories));

//   } catch (err) {
//     console.error("Detection error:", err);
//     setError("Detection failed. Please try another image.");
//   } finally {
//     setLoading(false);
//   }
// };


//   const handleReset = () => {
//     setImage(null)
//     setResult(null)
//     setError("")
//   }

//   return (
//     <div className="space-y-8">
//       <div className="space-y-2 mb-12">
//         <div className="flex items-center gap-3">
//           <div className="p-2.5 rounded-lg bg-primary/10">
//             <Sparkles className="w-6 h-6 text-primary" />
//           </div>
//           <h1 className="text-4xl font-bold text-foreground">Detect Flowers</h1>
//         </div>
//         <p className="text-muted-foreground text-base ml-11">Upload a photo to identify flower species with AI</p>
//       </div>

//       {!image ? (
//         <div className="flex justify-center">
//           <Card className="border-2 border-dashed border-primary/30 p-16 text-center hover:border-primary/60 transition-all duration-300 cursor-pointer group bg-gradient-to-br from-primary/5 to-secondary/5 max-w-2xl w-full rounded-2xl">
//             <label className="block cursor-pointer">
//               <Input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
//               <div className="space-y-4">
//                 <div className="flex justify-center">
//                   <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
//                     <Upload className="w-12 h-12 text-primary" />
//                   </div>
//                 </div>
//                 <div>
//                   <p className="text-xl font-bold text-foreground mb-2">Upload a flower photo</p>
//                   <p className="text-sm text-muted-foreground">Click to browse or drag and drop your image</p>
//                 </div>
//                 <p className="text-xs text-muted-foreground/70 font-medium">Supported: JPEG, PNG, WebP (Max 10MB)</p>
//               </div>
//             </label>
//           </Card>
//         </div>
//       ) : (
//         <div className="flex justify-center">
//           <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
//             <div className="space-y-4">
//               <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-secondary border border-border shadow-lg">
//                 <Image src={image || "/placeholder.svg"} alt="Uploaded flower" fill className="object-cover" />
//               </div>
//               <Button
//                 variant="outline"
//                 className="w-full border-border bg-transparent hover:bg-secondary h-11 font-semibold rounded-lg"
//                 onClick={() => setImage(null)}
//               >
//                 Change Image
//               </Button>
//             </div>

//             <div className="space-y-4 flex flex-col justify-center">
//               {!result ? (
//                 <>
//                   <Button
//                     className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 font-semibold rounded-lg transition-all text-base"
//                     onClick={handleDetect}
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <>
//                         <Loader2 className="w-5 h-5 mr-2 animate-spin" />
//                         Analyzing...
//                       </>
//                     ) : (
//                       <>
//                         <Sparkles className="w-5 h-5 mr-2" />
//                         Detect Flower
//                       </>
//                     )}
//                   </Button>
//                   {error && (
//                     <div className="flex gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
//                       <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
//                       <p className="text-sm text-red-700">{error}</p>
//                     </div>
//                   )}
//                 </>
//               ) : (
//                 /* Result card with enhanced visual appeal and professional styling */
//                 <Card className="p-8 border border-border space-y-6 bg-gradient-to-br from-card to-secondary/30 shadow-xl rounded-xl">
//                   {/* Confidence Badge */}
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1">
//                       <h2 className="text-3xl font-bold text-foreground mb-3">{result.flower}</h2>
//                       <div className="flex items-center gap-3">
//                         <div className="flex-1 bg-secondary rounded-full h-2.5 max-w-xs">
//                           <div
//                             className="bg-gradient-to-r from-primary to-primary/70 h-2.5 rounded-full transition-all duration-500"
//                             style={{ width: `${result.confidence}%` }}
//                           />
//                         </div>
//                         <span className="text-sm font-bold text-primary min-w-12 text-right">{result.confidence}%</span>
//                       </div>
//                     </div>
//                     <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 shadow-md">
//                       {result?.flower && result.flower !== "no flower detected" ? (
//                         <CheckCircle2 className="w-7 h-7 text-primary" />
//                       ) : (
//                         <AlertCircle className="w-7 h-7 text-red-500" />
//                       )}
//                     </div>
//                   </div>

//                   {/* Description */}
//                   <div className="pt-4 border-t border-border/50">
//                     <p className="text-xs font-semibold text-muted-foreground mb-2.5 uppercase tracking-wide">
//                       Description
//                     </p>
//                     <p className="text-base text-foreground leading-relaxed">{result.description}</p>
//                   </div>

//                   {/* Info Grid */}
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="p-4 rounded-lg bg-background/50 border border-border/50 hover:border-primary/30 transition">
//                       <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Color</p>
//                       <p className="text-sm font-semibold text-foreground">{result.color}</p>
//                     </div>
//                     <div className="p-4 rounded-lg bg-background/50 border border-border/50 hover:border-primary/30 transition">
//                       <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
//                         Blooming
//                       </p>
//                       <p className="text-sm font-semibold text-foreground">{result.bloomingSeason}</p>
//                     </div>
//                   </div>

//                   {/* Care Tips */}
//                   <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
//                     <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
//                       Care Tips
//                     </p>
//                     <p className="text-sm text-foreground leading-relaxed">{result.care}</p>
//                   </div>

//                   <Button
//                     className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 font-semibold rounded-lg transition-all"
//                     onClick={handleReset}
//                   >
//                     Detect Another Flower
//                   </Button>
//                 </Card>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }


"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Upload, Loader2, AlertCircle, CheckCircle2, Sparkles } from "lucide-react"
import Image from "next/image"

interface DetectionResult {
  flower: string
  confidence: number
  description: string
  care: string
  color: string
  bloomingSeason: string
}

const FLOWER_INFO: any = {
  rose: {
    description: "Roses are classic ornamental flowers known for their fragrance and beauty.",
    care: "Water regularly and provide 6 hours of sunlight daily.",
    color: "Red, pink, white, yellow.",
    bloomingSeason: "Spring to fall",
  },
  sunflower: {
    description: "Sunflowers are tall, bright flowers that follow the direction of the sun.",
    care: "Full sunlight and moderate watering.",
    color: "Yellow with a dark center.",
    bloomingSeason: "Summer",
  },
  tulip: {
    description: "Tulips are bulbous spring flowers known for their vibrant colors.",
    care: "Plant in well-drained soil and keep soil lightly moist.",
    color: "Red, yellow, pink, purple.",
    bloomingSeason: "Spring",
  },
  dandelion: {
    description: "Dandelions are bright yellow flowers often found in the wild.",
    care: "Thrives naturally, requires little to no maintenance.",
    color: "Yellow",
    bloomingSeason: "Spring to early summer",
  },
  daisy: {
    description: "Daisies are cheerful flowers with white petals and yellow centers.",
    care: "Provide full sunlight and water moderately.",
    color: "White with a yellow center.",
    bloomingSeason: "Spring to autumn",
  },
  none: {
    description: "No flower was detected in the image.",
    care: "Try uploading a clearer image.",
    color: "N/A",
    bloomingSeason: "N/A",
  },
}

export default function DetectPage() {
  const [image, setImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DetectionResult | null>(null)
  const [error, setError] = useState("")

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      formData.append("file", blob)

      const response = await fetch("https://floture-api.onrender.com/predict", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      const detectedFlower = (data.class || "none").toLowerCase()
      const info = FLOWER_INFO[detectedFlower] || FLOWER_INFO["none"]

      const flowerData: DetectionResult = {
        flower: data.class || "Unknown",
        confidence: Math.round((data.confidence || 0) * 100),
        description: info.description,
        care: info.care,
        color: info.color,
        bloomingSeason: info.bloomingSeason,
      }

      setResult(flowerData)

      const currentUser = JSON.parse(localStorage.getItem("floture_current_user") || "{}")
      const histories = JSON.parse(localStorage.getItem("floture_histories") || "{}")

      if (!histories[currentUser.email]) histories[currentUser.email] = []

      histories[currentUser.email].push({
        flower: flowerData.flower,
        confidence: flowerData.confidence,
        image: image,
        timestamp: new Date().toISOString(),
      })

      localStorage.setItem("floture_histories", JSON.stringify(histories))
    } catch (err) {
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
    <div className="space-y-8">
      <div className="space-y-2 mb-12">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-primary/10">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">Detect Flowers</h1>
        </div>
        <p className="text-muted-foreground text-base ml-11">
          Upload a photo to identify flower species with AI
        </p>
      </div>

      {!image ? (
        <div className="flex justify-center">
          <Card className="border-2 border-dashed border-primary/30 p-16 text-center hover:border-primary/60 transition-all duration-300 cursor-pointer group bg-gradient-to-br from-primary/5 to-secondary/5 max-w-2xl w-full rounded-2xl">
            <label className="block cursor-pointer">
              <Input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <Upload className="w-12 h-12 text-primary" />
                  </div>
                </div>
                <p className="text-xl font-bold text-foreground mb-2">Upload a flower photo</p>
                <p className="text-sm text-muted-foreground">Click to browse or drag & drop</p>
              </div>
            </label>
          </Card>
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
            
            {/* IMAGE + BUTTON */}
            <div className="space-y-4">
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-secondary border border-border shadow-lg">
                <Image src={image || "/placeholder.svg"} alt="Uploaded flower" fill className="object-cover" />
              </div>

              {!result && (
                <Button
                  variant="outline"
                  className="w-full border-border bg-transparent hover:bg-secondary h-11 font-semibold rounded-lg"
                  onClick={() => setImage(null)}
                >
                  Change Image
                </Button>
              )}
              {result && (
                <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 font-semibold rounded-lg transition-all"
                    onClick={handleReset}
                  >
                    Detect Another Flower
                  </Button>
              )}
            </div>

            {/* RESULTS / ACTIONS */}
            <div className="space-y-4 flex flex-col justify-center">
              {!result ? (
                <>
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 font-semibold rounded-lg transition-all text-base"
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
                        <Sparkles className="w-5 h-5 mr-2" />
                        Detect Flower
                      </>
                    )}
                  </Button>

                  {error && (
                    <div className="flex gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}
                </>
              ) : (
                <Card className="p-8 border border-border space-y-6 bg-gradient-to-br from-card to-secondary/30 shadow-xl rounded-xl">
                  
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold text-foreground mb-3">{result.flower}</h2>

                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-secondary rounded-full h-2.5 max-w-xs">
                          <div
                            className="bg-gradient-to-r from-primary to-primary/70 h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${result.confidence}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-primary min-w-12 text-right">
                          {result.confidence}%
                        </span>
                      </div>
                    </div>

                    {/* 👇 Icon based on detection */}
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 shadow-md">
                      {result.flower.toLowerCase() !== "no flower detected" ? (
                        <CheckCircle2 className="w-7 h-7 text-primary" />
                      ) : (
                        <AlertCircle className="w-7 h-7 text-red-500" />
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/50">
                    <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                      Description
                    </p>
                    <p className="text-base text-foreground leading-relaxed">{result.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-background/50 border border-border/50 hover:border-primary/30 transition">
                      <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Color</p>
                      <p className="text-sm font-semibold text-foreground">{result.color}</p>
                    </div>

                    <div className="p-4 rounded-lg bg-background/50 border border-border/50 hover:border-primary/30 transition">
                      <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                        Blooming
                      </p>
                      <p className="text-sm font-semibold text-foreground">{result.bloomingSeason}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                    <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                      Care Tips
                    </p>
                    <p className="text-sm text-foreground leading-relaxed">{result.care}</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
