"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Flower2, Sparkles, Zap, BookOpen, Share2, Mail } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"


export default function Home() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showVideo, setShowVideo] = useState(false)

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");


  useEffect(() => {
    const user = localStorage.getItem("floture_current_user")
    setIsLoggedIn(!!user)
  }, [])

  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 border-b border-border">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Floture Logo"
            width={32}
            height={32}
          />
          <span className="text-xl font-semibold text-primary/50">floture</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition">
            Features
          </Link>
          <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition">
            How it works
          </Link>
          <Link href="#newsletter" className="text-sm text-muted-foreground hover:text-foreground transition">
            Newsletter
          </Link>
        </div>
        {isLoggedIn ? (
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => router.push("/app/detect")}
          >
            Open App
          </Button>
        ) : (
          <Link href="/auth/login">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Get Started</Button>
          </Link>
        )}
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 md:px-12 md:py-32 max-w-6xl mx-auto">
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight text-balance">
            Identify any flower <br className="hidden md:block" />
            <span className="text-primary">in seconds</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Powered by advanced AI technology, Floture instantly recognizes flowers from photos and provides detailed
            botanical information.
          </p>
          <div className="flex sm:flex-row gap-4 justify-center pt-4">
            {isLoggedIn ? (
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => router.push("/app/detect")}
              >
                Start Detecting <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            ) : (
              <Link href="/auth/signup">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Sign Up<ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            )}
              
              <Button
                size="lg"
                variant="outline"
                className="border-border text-foreground hover:bg-secondary bg-transparent transition-all duration-300"
                onClick={() => setShowVideo(true)}
              >
                Watch Demo
              </Button>

          </div>
        </div>

        {/* Hero Image */}
        <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden bg-secondary border border-border">
          <Image
            src="/flo.jpg"
            alt="Flower detection interface"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20 md:px-12 md:py-32 bg-secondary/30 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Powerful features</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to explore and understand the botanical world
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Sparkles,
                title: "AI-Powered Recognition",
                description:
                  "Advanced machine learning models trained on millions of flower images for accurate identification.",
              },
              {
                icon: BookOpen,
                title: "Detailed Information",
                description: "Get comprehensive botanical data including species, care tips, and blooming seasons.",
              },
              {
                icon: Zap,
                title: "Instant Results",
                description: "Get identification results in under one second with our optimized cloud infrastructure.",
              },
              {
                icon: Share2,
                title: "Easy Sharing",
                description: "Share your flower discoveries with friends and build your personal flower collection.",
              },
              {
                icon: Flower2,
                title: "Species Database",
                description: "Access information on over 10,000 flower species from around the world.",
              },
              {
                icon: Zap,
                title: "Always Learning",
                description: "Our AI continuously improves accuracy with each identification made by users.",
              },
            ].map((feature, idx) => {
              const Icon = feature.icon
              return (
                <Card key={idx} className="p-6 border border-border bg-card hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="px-6 py-20 md:px-12 md:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">How it works</h2>
            <p className="text-muted-foreground text-lg">Three simple steps to identify any flower</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Upload Photo",
                description: "Take a photo of any flower or upload from your device",
              },
              {
                step: "02",
                title: "AI Analysis",
                description: "Our neural network analyzes and identifies the flower species",
              },
              {
                step: "03",
                title: "Get Details",
                description: "Receive comprehensive information about the flower and its care",
              },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -top-8 left-0 text-5xl font-bold text-primary/20">{item.step}</div>
                <Card className="p-8 border border-border bg-card h-full">
                  <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section id="newsletter" className="px-6 py-20 md:px-12 md:py-32 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Subscribe to our Newsletter</h2>
            <p className="text-lg opacity-90 text-balance">
              Get updates, new features, and the latest flower insights delivered to your inbox.
            </p>
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setStatus("sending");

              const res = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
              });

              if (res.ok) {
                setStatus("success");
                setEmail("");

                // Make it return to normal button after 3 seconds (optional)
                setTimeout(() => setStatus("idle"), 3000);
              } else {
                setStatus("error");

                setTimeout(() => setStatus("idle"), 3000);
              }
            }}
            className="w-full"
          >
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-xl mx-auto">
              <div className="relative w-72">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50 w-5 h-5" />
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 text-black bg-background/80 border-border w-full h-10 text-sm placeholder:text-muted-foreground/80 transition-all duration-200 focus:ring-2 focus:ring-primary/60"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={status === "sending" || status === "success"}
                className="bg-background/80 text-primary hover:bg-secondary/80 transition-all duration-300"
              >
                {status === "idle" && (
                  <>
                    Subscribe <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}

                {status === "sending" && "Subscribing..."}

                {status === "success" && "Subscribed!"}

                {status === "error" && "Retry ✖"}
              </Button>
            </div>
          </form>




        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 md:px-12 border-t border-border bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                  <img
                    src="/logo.png"
                    alt="Floture Logo"
                    className="w-6 h-6 object-contain drop-shadow-sm"
                  />
                <span className="font-semibold text-foreground">floture</span>
              </div>
              <p className="text-sm text-muted-foreground">AI-powered flower identification</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; 2025 Floture. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="#" className="hover:text-foreground transition">
                Twitter
              </Link>
              <Link href="#" className="hover:text-foreground transition">
                GitHub
              </Link>
              <Link href="#" className="hover:text-foreground transition">
                LinkedIn
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* YouTube Video Modal */}
      {showVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center backdrop-blur-sm transition-all duration-300"
          onClick={() => setShowVideo(false)}
        >
          <div
            className="relative w-[90%] md:w-[60%] aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-border animate-in fade-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside video
          >
            <iframe
              src="https://www.youtube.com/embed/h2BIuhiL4o0?autoplay=1"
              title="Floture Demo Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-none"
            ></iframe>
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-3 right-3 bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/90 transition"
            >
              ✕
            </button>
          </div>
        </div>
      )}


    </main>
    
  )
}

