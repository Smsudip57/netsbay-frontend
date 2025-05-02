"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FaqAccordion() {
  const faqItems = [
    {
      question: "What is VPS hosting?",
      answer: "VPS hosting gives you dedicated resources in a virtual environment, offering more control than shared hosting.",
    },
    {
      question: "Do you offer Linux and Windows VPS options?",
      answer: "Yes, you can choose either Linux or Windows OS for your VPS.",
    },
    {
      question: "Can I host proxies on your VPS or servers?",
      answer: "Yes, our infrastructure supports proxy hosting, including HTTP/HTTPS and SOCKS.",
    },
    {
      question: "Can I upgrade my VPS plan later?",
      answer: "Yes, you can scale your VPS anytime with no downtime.",
    },
    {
      question: "Do you offer managed VPS hosting?",
      answer: "Yes, we offer both managed and unmanaged VPS plans.",
    },
    {
      question: "What kind of support do you provide?",
      answer: "24/7 expert support via live chat, tickets, email, and phone.",
    },
  ];

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
