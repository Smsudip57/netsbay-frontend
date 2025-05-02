"use client"

import { useState, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle } from "lucide-react"

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  
  // Form field states
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")

  // Email validation function
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError("")
    
    // Validate all fields are filled
    if (!name || !email || !subject || !message) {
      setError("Please fill in all fields")
      return
    }
    
    // Validate email format
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address")
      return
    }
    
    setIsSubmitting(true)
    
    // Construct the Google Form URL with form data
    const googleFormUrl = `https://docs.google.com/forms/d/e/1FAIpQLSe90fYkEEagX78m4jncbn5cpyFirK7vzXo1ZFzwvcnJlWBTzA/formResponse?submit=Submit&usp=pp_url&entry.2005620554=${encodeURIComponent(name)}&entry.1045781291=${encodeURIComponent(email)}&entry.886736531=${encodeURIComponent(subject)}&entry.1375943708=${encodeURIComponent(message)}`
    
    // Simulate form submission (can be removed in production)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      
      // Navigate to Google Form
      window.open(googleFormUrl, "_blank")
    }, 1000)
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
          onClick={() => {
            setIsSubmitted(false)
            setName("")
            setEmail("")
            setSubject("")
            setMessage("")
          }}
        >
          Send Another Message
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded text-red-200 text-sm">
          {error}
        </div>
      )}
      
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white">
            Name
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <Select value={subject} onValueChange={setSubject}>
          <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white focus:ring-blue-500">
            <SelectValue placeholder="Select a subject" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-700">
            <SelectItem value="General Inquiry">General Inquiry</SelectItem>
            <SelectItem value="Sales Question">Sales Question</SelectItem>
            <SelectItem value="Technical Support">Technical Support</SelectItem>
            <SelectItem value="Billing Issue">Billing Issue</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message" className="text-white">
          Message
        </Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Your message"
          required
          className="min-h-[120px] bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500"
        />
      </div>
      <Button 
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  )
}