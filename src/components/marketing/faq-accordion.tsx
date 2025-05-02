"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FaqAccordion() {
  const faqItems = [
    {
      question: "What is VPS hosting?",
      answer:
        "VPS (Virtual Private Server) hosting provides a virtualized server environment that mimics a dedicated server within a shared hosting infrastructure. It gives you dedicated resources and greater control compared to shared hosting, while being more cost-effective than a dedicated server.",
    },
    {
      question: "What are the benefits of VPS hosting over shared hosting?",
      answer:
        "VPS hosting offers dedicated resources (CPU, RAM, storage) that aren't shared with other users, better performance and reliability, root access for complete control, enhanced security through isolation, and the ability to handle higher traffic volumes and resource-intensive applications.",
    },
    {
      question: "Can I upgrade my VPS plan as my website grows?",
      answer:
        "Yes, NETBAY offers seamless scalability. You can easily upgrade your VPS resources (CPU, RAM, storage) as your needs grow, without any downtime or migration hassles. Our control panel makes it simple to scale up with just a few clicks.",
    },
    {
      question: "Do you offer managed VPS hosting?",
      answer:
        "Yes, we offer both managed and unmanaged VPS hosting options. With managed VPS, our technical team handles server setup, security, updates, and monitoring, allowing you to focus on your business. Unmanaged VPS gives you full control if you have the technical expertise.",
    },
    {
      question: "What control panel do you provide with VPS hosting?",
      answer:
        "We provide industry-standard control panels including cPanel/WHM and Plesk. These user-friendly interfaces make it easy to manage your websites, domains, email accounts, databases, and server settings without requiring advanced technical knowledge.",
    },
    {
      question: "What kind of support do you offer?",
      answer:
        "We provide 24/7/365 technical support through multiple channels including live chat, ticket system, email, and phone. Our support team consists of experienced server administrators who can assist with any hosting-related issues you may encounter.",
    },
  ]

  return (
    <Accordion type="single" collapsible className="w-full">
      {faqItems.map((item, index) => (
        <AccordionItem key={index} value={`item-${index}`} className="border-slate-800">
          <AccordionTrigger className="text-left text-white hover:text-blue-400">{item.question}</AccordionTrigger>
          <AccordionContent className="text-slate-400">{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
