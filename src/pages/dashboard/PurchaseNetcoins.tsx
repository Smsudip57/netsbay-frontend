import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { CreditCard, Smartphone, Bitcoin } from "lucide-react";
import { toast } from "sonner";

const PurchaseNetcoins = () => {
  const packages = [
    { coins: 200, priceINR: 200, priceUSD: Math.ceil(200 / 83) },
    { coins: 500, priceINR: 500, priceUSD: Math.ceil(500 / 83) },
    { coins: 1000, priceINR: 1000, priceUSD: Math.ceil(1000 / 83) },
    { coins: 2000, priceINR: 2000, priceUSD: Math.ceil(2000 / 83) },
  ];

  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("upi");

  const calculateTax = (amount: number) => amount * 0.18; // 18% GST
  const calculateTotal = (amount: number, includeTax: boolean) => 
    includeTax ? amount + calculateTax(amount) : amount;

  const selectedPrice = selectedPackage !== null 
    ? packages.find(pkg => pkg.coins === selectedPackage)?.priceINR || 0 
    : 0;

  const selectedPriceUSD = selectedPackage !== null 
    ? packages.find(pkg => pkg.coins === selectedPackage)?.priceUSD || 0 
    : 0;

  const handlePayment = () => {
    if (!selectedPackage) {
      toast.error("Please select a package first");
      return;
    }

    switch (paymentMethod) {
      case "upi":
        toast.info("Redirecting to PhonePe...");
        break;
      case "card":
        toast.info("Redirecting to Stripe checkout...");
        break;
      case "crypto":
        toast.info("Redirecting to Cryptomus...");
        break;
    }
  };

  const renderPriceDisplay = () => {
    const isCrypto = paymentMethod === 'crypto';
    const baseAmount = isCrypto ? selectedPriceUSD : selectedPrice;
    const tax = isCrypto ? 0 : calculateTax(selectedPrice);
    const total = isCrypto ? baseAmount : baseAmount + tax;

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span>Subtotal</span>
          <div className="text-right">
            {isCrypto ? (
              <div>${baseAmount}</div>
            ) : (
              <div>₹{baseAmount.toFixed(2)}</div>
            )}
          </div>
        </div>
        
        {!isCrypto && (
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>GST (18%)</span>
            <div className="text-right">
              <div>₹{tax.toFixed(2)}</div>
            </div>
          </div>
        )}

        <div className="border-t pt-4">
          <div className="flex justify-between items-center font-bold">
            <span>Total</span>
            <div className="text-right">
              {isCrypto ? (
                <div>${total}</div>
              ) : (
                <div>₹{total.toFixed(2)}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="p-6 flex-1">
      <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-gray-100/50">
        <h2 className="text-3xl font-bold mb-6">Purchase Netcoins</h2>
        
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RadioGroup 
              value={selectedPackage?.toString()} 
              onValueChange={(value) => setSelectedPackage(Number(value))}
              className="grid gap-4 md:grid-cols-2"
            >
              {packages.map((pkg) => (
                <div key={pkg.coins} className="relative">
                  <RadioGroupItem
                    value={pkg.coins.toString()}
                    id={`package-${pkg.coins}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`package-${pkg.coins}`}
                    className="flex flex-col p-4 border rounded-lg cursor-pointer hover:bg-gray-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-primary"
                  >
                    <span className="text-lg font-semibold">{pkg.coins} NC</span>
                    {paymentMethod === 'crypto' ? (
                      <span className="text-sm text-muted-foreground">${pkg.priceUSD}</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">₹{pkg.priceINR.toFixed(2)}</span>
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="upi" onValueChange={setPaymentMethod}>
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="upi">UPI</TabsTrigger>
                    <TabsTrigger value="card">Card</TabsTrigger>
                    <TabsTrigger value="crypto">Crypto</TabsTrigger>
                  </TabsList>
                  <TabsContent value="upi" className="space-y-4">
                    <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                      <Smartphone className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">PhonePe UPI</p>
                        <p className="text-sm text-muted-foreground">Pay using UPI in INR</p>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="card" className="space-y-4">
                    <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Credit/Debit Card</p>
                        <p className="text-sm text-muted-foreground">Pay using Stripe in INR</p>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="crypto" className="space-y-4">
                    <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                      <Bitcoin className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Cryptocurrency</p>
                        <p className="text-sm text-muted-foreground">Pay using Cryptomus in USD</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="border-t pt-4 space-y-2">
                  {renderPriceDisplay()}
                </div>

                <Button 
                  className="w-full mt-4" 
                  disabled={selectedPackage === null}
                  onClick={handlePayment}
                >
                  {selectedPackage ? `Pay Now` : 'Select a package'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PurchaseNetcoins;