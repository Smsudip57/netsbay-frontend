import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import { useState } from "react"
import { useAppContext } from "@/context/context"
import { useNavigate } from "react-router-dom"

interface PricingCardProps {
  title: string
  price: string
  description: string
  features: string[]
  buttonText: string
  popular?: boolean
  isSelected?: boolean
  onSelect?: () => void
}

export default function PricingCard({
  title,
  price,
  description,
  features,
  buttonText,
  popular = false,
  isSelected = false,
  onSelect,
}: PricingCardProps) {
  const { user, loading } = useAppContext()
  const navigate = useNavigate()
  return (
    <Card 
      className={`flex flex-col border-slate-800 bg-slate-900/50 transition-all group ${
        isSelected ? "ring-2 ring-blue-500" : "hover:border-blue-600/50"
      } ${popular ? "" : ""}`}
      onClick={onSelect}
    >
      {popular && (
        <div className="bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-t-lg mx-auto">Most Popular</div>
      )}
      <CardHeader>
        <CardTitle className="text-xl text-white">{title}</CardTitle>
        <CardDescription className="text-slate-400">{description}</CardDescription>
        <div className="mt-4">
          <span className="text-3xl font-bold text-white">{price}</span>
          <span className="text-slate-400 ml-1">/month</span>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
              <span className="text-sm text-slate-300">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
      <Button className={`w-full group-hover:bg-blue-600 group-hover:hover:bg-blue-700 group-hover:text-white bg-blue-400 hover:bg-blue-700`}
      onClick={()=>{
        if(user && !loading){
          navigate("/dashboard")
        }else{
          navigate("/signin")
        }
      }}
      >
  {buttonText}
</Button>
      </CardFooter>
    </Card>
  )
}