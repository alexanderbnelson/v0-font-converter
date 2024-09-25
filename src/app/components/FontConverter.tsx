'use client'

import { useState, FormEvent } from 'react'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function FontConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [formats, setFormats] = useState<string[]>([])
  const [isConverting, setIsConverting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!file || formats.length === 0) return

    setIsConverting(true)

    const formData = new FormData()
    formData.append('font', file)
    formats.forEach(format => formData.append('formats', format))

    try {
      const response = await fetch('/api/convert-font', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = 'converted_fonts.zip'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      } else {
        console.error('Conversion failed')
      }
    } catch (error) {
      console.error('Error during conversion:', error)
    }

    setIsConverting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="font-file">Upload Font File</Label>
        <Input
          id="font-file"
          type="file"
          accept=".ttf,.otf,.woff,.woff2"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Output Formats</Label>
        <div className="flex space-x-4">
          {['ttf', 'woff', 'woff2'].map((format) => (
            <div key={format} className="flex items-center space-x-2">
              <Checkbox
                id={format}
                checked={formats.includes(format)}
                onCheckedChange={(checked) =>
                  setFormats(checked
                    ? [...formats, format]
                    : formats.filter(f => f !== format)
                  )
                }
              />
              <Label htmlFor={format}>{format.toUpperCase()}</Label>
            </div>
          ))}
        </div>
      </div>
      <Button type="submit" disabled={isConverting}>
        {isConverting ? 'Converting...' : 'Convert and Download'}
      </Button>
    </form>
  )
}