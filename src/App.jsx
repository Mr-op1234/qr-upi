
import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

function App() {
  const [identifier, setIdentifier] = useState("");
  const [amount, setAmount] = useState("");
  const [showQR, setShowQR] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!identifier) {
      toast({
        title: "Error",
        description: "Please enter a UPI ID",
        variant: "destructive",
      });
      return;
    }

    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(identifier)) {
      toast({
        title: "Error",
        description: "Please enter a valid UPI ID",
        variant: "destructive",
      });
      return;
    }

    if (amount && (isNaN(amount) || parseFloat(amount) <= 0)) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    setShowQR(true);
  };

  const generateUPILink = () => {
    const amountParam = amount ? `&am=${amount}` : "";
    return `upi://pay?pa=${identifier}&pn=Payment${amountParam}&cu=INR`;
  };

  return (
    <div className="min-h-screen animated-gradient py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 space-y-8"
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Payment QR Generator</h1>
            <p className="mt-2 text-gray-600">Generate a QR code for UPI payments</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="identifier">UPI ID</Label>
              <Input
                id="identifier"
                type="text"
                placeholder="example@upi"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹) - Optional</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount (optional)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <p className="text-sm text-gray-500">Leave empty to let payer decide the amount</p>
            </div>

            <Button type="submit" className="w-full">
              Generate QR Code
            </Button>
          </form>

          {showQR && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="mt-8 flex flex-col items-center space-y-4"
            >
              <div className="bg-white p-4 rounded-lg shadow-md">
                <QRCodeSVG
                  value={generateUPILink()}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="text-sm text-gray-600 text-center">
                Scan this QR code to pay
                {amount ? ` ₹${amount}` : " any amount"} to {identifier}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
