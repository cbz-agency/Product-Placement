"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, Download, Sparkles, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ProductPlacementTool() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [mockupImage, setMockupImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const [modelConfig, setModelConfig] = useState({
    gender: "",
    age: "",
    nationality: "",
    action: "",
    background: "",
  })

  const handleFileUpload = useCallback((file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
        setMockupImage(null)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      handleFileUpload(file)
    },
    [handleFileUpload],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFileUpload(file)
    },
    [handleFileUpload],
  )

  const generateMockup = useCallback(() => {
    if (!uploadedImage) return

    setIsGenerating(true)
    setTimeout(() => {
      // TODO: Call API with modelConfig and uploadedImage
      // const response = await fetch('/api/generate', {
      //   method: 'POST',
      //   body: JSON.stringify({ image: uploadedImage, config: modelConfig })
      // })
      setMockupImage(uploadedImage)
      setIsGenerating(false)
    }, 2000)
  }, [uploadedImage, modelConfig])

  const downloadMockup = useCallback(() => {
    if (!mockupImage) return

    const link = document.createElement("a")
    link.href = mockupImage
    link.download = "nano-banana-mockup.png"
    link.click()
  }, [mockupImage])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-balance bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] bg-clip-text text-transparent">
            AI Product Placement
          </h1>
          <p className="text-muted-foreground text-lg">Upload your product and customize your model</p>
        </motion.div>

        {/* Upload Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="glass p-8 border-2 border-dashed hover:border-primary/70 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`space-y-4 ${isDragging ? "opacity-50" : ""}`}
            >
              <div className="flex flex-col items-center justify-center space-y-4">
                {uploadedImage ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative w-full max-w-xs aspect-square rounded-lg overflow-hidden border-2 border-primary/30 shadow-lg shadow-primary/10"
                  >
                    <img
                      src={uploadedImage || "/placeholder.svg"}
                      alt="Uploaded product"
                      className="w-full h-full object-contain bg-secondary"
                    />
                  </motion.div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center">
                    <Upload className="w-12 h-12 text-primary" />
                  </div>
                )}

                <div className="text-center space-y-2">
                  <p className="text-lg font-medium text-foreground">
                    {uploadedImage ? "Product uploaded!" : "Drop your product image here"}
                  </p>
                  <p className="text-sm text-muted-foreground">PNG format preferred • Max 10MB</p>
                </div>

                <label htmlFor="file-upload">
                  <Button
                    variant="outline"
                    className="cursor-pointer hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-primary-foreground transition-all duration-300 bg-transparent border-primary/30"
                    asChild
                  >
                    <span>
                      <ImageIcon className="w-4 h-4 mr-2" />
                      {uploadedImage ? "Change Image" : "Browse Files"}
                    </span>
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Model Customization Form */}
        <AnimatePresence>
          {uploadedImage && !mockupImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="glass p-6 space-y-4 shadow-lg shadow-primary/10">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">Customize Your Model</h3>
                  <p className="text-sm text-muted-foreground">Describe the model you want to hold your product</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-sm font-medium">
                      Gender
                    </Label>
                    <Input
                      id="gender"
                      placeholder="e.g., Male, Female, Non-binary"
                      value={modelConfig.gender}
                      onChange={(e) => setModelConfig({ ...modelConfig, gender: e.target.value })}
                      className="bg-background/50 border-primary/20 focus:border-primary focus:ring-primary/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-sm font-medium">
                      Age
                    </Label>
                    <Input
                      id="age"
                      placeholder="e.g., 25-30, Young adult"
                      value={modelConfig.age}
                      onChange={(e) => setModelConfig({ ...modelConfig, age: e.target.value })}
                      className="bg-background/50 border-primary/20 focus:border-primary focus:ring-primary/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nationality" className="text-sm font-medium">
                      Nationality/Ethnicity
                    </Label>
                    <Input
                      id="nationality"
                      placeholder="e.g., Asian, European, African"
                      value={modelConfig.nationality}
                      onChange={(e) => setModelConfig({ ...modelConfig, nationality: e.target.value })}
                      className="bg-background/50 border-primary/20 focus:border-primary focus:ring-primary/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="action" className="text-sm font-medium">
                      Action
                    </Label>
                    <Input
                      id="action"
                      placeholder="e.g., Smiling, Holding up, Using"
                      value={modelConfig.action}
                      onChange={(e) => setModelConfig({ ...modelConfig, action: e.target.value })}
                      className="bg-background/50 border-primary/20 focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="background" className="text-sm font-medium">
                    Background
                  </Label>
                  <Textarea
                    id="background"
                    placeholder="e.g., Modern office, Outdoor park, Studio with soft lighting"
                    value={modelConfig.background}
                    onChange={(e) => setModelConfig({ ...modelConfig, background: e.target.value })}
                    className="bg-background/50 border-primary/20 focus:border-primary focus:ring-primary/20 min-h-[80px] resize-none"
                  />
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Generate Button */}
        <AnimatePresence>
          {uploadedImage && !mockupImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                onClick={generateMockup}
                disabled={isGenerating}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] hover:opacity-90 transition-all duration-300 shadow-xl shadow-primary/30 text-white border-0"
              >
                {isGenerating ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                    </motion.div>
                    Generating Magic...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Mockup
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preview Card with Glassmorphism */}
        <AnimatePresence>
          {mockupImage && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Card className="glass p-8 space-y-6 shadow-2xl shadow-primary/20 border-2 border-primary/20">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    Your Mockup is Ready!
                  </h2>
                  <p className="text-muted-foreground">Your custom model is showcasing your product</p>
                </div>

                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-2 border-primary/30 shadow-lg"
                >
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={mockupImage || "/placeholder.svg"}
                      alt="Generated mockup"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </motion.div>

                <Button
                  onClick={downloadMockup}
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 text-white shadow-lg shadow-primary/30"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Mockup
                </Button>

                <Button
                  onClick={() => {
                    setUploadedImage(null)
                    setMockupImage(null)
                    setModelConfig({
                      gender: "",
                      age: "",
                      nationality: "",
                      action: "",
                      background: "",
                    })
                  }}
                  variant="ghost"
                  className="w-full hover:bg-primary/10 transition-colors"
                >
                  Create Another Mockup
                </Button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
