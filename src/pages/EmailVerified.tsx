import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketingNavbar } from "@/components/marketing/Navbar";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const EmailVerified = () => {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNavbar />
      <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Email Verified</CardTitle>
            <CardDescription>Your email has been successfully verified</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Thank you for verifying your email address. You can now access all features of your account.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link to="/signin">Continue to Sign In</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default EmailVerified;