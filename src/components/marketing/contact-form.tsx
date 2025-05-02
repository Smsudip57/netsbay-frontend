"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle } from "lucide-react"

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 1500)
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
        <div className="h-12 w-12 rounded-full bg-blue-600/20 flex items-center justify-center">
          <CheckCircle className="h-6 w-6 text-blue-500" />
        </div>
        <h3 className="text-xl font-medium text-white">Message Sent!</h3>
        <p className="text-slate-400">Thank you for contacting us. Our team will get back to you shortly.</p>
        <Button
          variant="outline"
          className="mt-4 border-blue-600/50 text-blue-400 hover:bg-blue-600/10"
          onClick={() => setIsSubmitted(false)}
        >
          Send Another Message
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white">
            Name
          </Label>
          <Input
            id="name"
            placeholder="Your name"
            required
            className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Your email"
            required
            className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject" className="text-white">
          Subject
        </Label>
        <Select>
          <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white focus:ring-blue-500">
            <SelectValue placeholder="Select a subject" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-700">
            <SelectItem value="general">General Inquiry</SelectItem>
            <SelectItem value="sales">Sales Question</SelectItem>
            <SelectItem value="support">Technical Support</SelectItem>
            <SelectItem value="billing">Billing Issue</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message" className="text-white">
          Message
        </Label>
        <Textarea
          id="message"
          placeholder="Your message"
          required
          className="min-h-[120px] bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500"
        />
      </div>
      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  )
}
