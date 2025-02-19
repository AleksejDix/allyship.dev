"use client"

import { useState } from "react"
import Image from "next/image"
import { ImagePlus, Loader2 } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { generateAltText } from "../actions/generate-alt-text"

interface UploadedImage {
  url: string
  alt: string
}

export function AltTextGenerator() {
  const [isUploading, setIsUploading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0]
      if (!file) {
        console.log("No file selected")
        return
      }

      console.log("File selected:", {
        name: file.name,
        type: file.type,
        size: file.size,
      })

      // Validate file type
      if (!file.type.startsWith("image/")) {
        throw new Error("Please upload an image file")
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Image size should be less than 5MB")
      }

      setIsUploading(true)
      setError(null)

      const supabase = createClient()

      // Generate a unique file name with timestamp to avoid collisions
      const timestamp = new Date().getTime()
      const fileExt = file.name.split(".").pop()
      const fileName = `${timestamp}-${Math.random().toString(36).substring(2)}.${fileExt}`
      console.log("Generated filename:", fileName)

      // Upload to Supabase within space/domain folder structure
      console.log("Starting upload to Supabase...")
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("alt")
        .upload(`${fileName}`, file, {
          cacheControl: "3600",
          upsert: false,
        })

      if (uploadError) {
        console.error("Upload error:", uploadError)
        throw new Error(uploadError.message)
      }

      console.log("Upload successful:", uploadData)

      // Get signed URL
      const signedUrlResponse = await supabase.storage
        .from("alt")
        .createSignedUrl(`${fileName}`, 60 * 60) // 1 hour expiry

      if (!signedUrlResponse.data?.signedUrl) {
        throw new Error("Failed to generate signed URL")
      }

      console.log("Generated signed URL:", signedUrlResponse.data.signedUrl)

      setUploadedImage({ url: signedUrlResponse.data.signedUrl, alt: "" })
    } catch (err) {
      console.error("Full error details:", err)
      setError(err instanceof Error ? err.message : "Failed to upload image")
      setUploadedImage(null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleGenerateAltText = async () => {
    if (!uploadedImage?.url) return

    try {
      setIsGenerating(true)
      setError(null)

      const result = await generateAltText(uploadedImage.url)

      if (!result.success) {
        throw new Error(result.error)
      }

      setUploadedImage((prev) =>
        prev ? { ...prev, alt: result.altText || "" } : null
      )
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate alt text"
      )
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      {!uploadedImage ? (
        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12">
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={handleFileChange}
            className="sr-only"
            aria-label="Upload image"
          />
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center gap-2 cursor-pointer"
          >
            {isUploading ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
              <ImagePlus className="h-8 w-8" />
            )}
            <span className="text-sm font-medium">
              {isUploading ? "Uploading..." : "Click to upload image"}
            </span>
            <span className="text-xs text-muted-foreground">
              Maximum file size: 5MB
            </span>
          </label>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="relative aspect-video rounded-lg overflow-hidden border">
            <Image
              src={uploadedImage.url}
              alt={uploadedImage.alt || "Uploaded image"}
              fill
              className="object-contain"
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="alt-text">Alt Text</Label>
              <Textarea
                id="alt-text"
                value={uploadedImage.alt}
                onChange={(e) =>
                  setUploadedImage((prev) =>
                    prev ? { ...prev, alt: e.target.value } : null
                  )
                }
                placeholder="Enter or generate alt text for this image..."
                className="h-24"
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                onClick={handleGenerateAltText}
                disabled={isGenerating}
                className="flex-1"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Alt Text"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setUploadedImage(null)}
                className="flex-1"
              >
                Upload Another Image
              </Button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500 text-center" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
