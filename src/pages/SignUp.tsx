import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MarketingNavbar } from "@/components/marketing/Navbar";
import { toast as stoast } from "sonner";
import axios from "axios";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithGoogle } from "../firebase/firebase";
import { useAppContext } from "@/context/context";

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const SignUp = () => {
  const schema = z
    .object({
      email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email"),
      password: z
        .string()
        .min(1, "Password is required")
        .min(6, "Password must be at least 6 characters")
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])[^\s]{6,}$/,
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        ),
      confirmPassword: z.string().min(1, "Please confirm your password"),
      code: z
        .string()
        .min(6, "Please enter the 6-digit verification code")
        .max(6, "Code must be 6 characters")
        .regex(/^\d{6}$/, "Code must contain 6 digits"),
      firstName: z.string().min(1, "First name is required"),
      lastName: z.string().min(1, "Last name is required"),
      whatsapp: z.string().min(1, "WhatsApp number is required"),
      street: z.string().min(1, "Street name is required"),
      city: z.string().min(1, "City is required"),
      state: z.string().min(1, "State is required"),
      country: z.string().min(1, "Country is required"),
      pincode: z.string().min(1, "Pincode is required"),
      organizationName: z.string().optional(),
      gstNumber: z.string().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });
  const {
    register,
    handleSubmit: validateSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
    getValues,
    trigger,
    control,
    setError,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      whatsapp: "",
      street: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
      organizationName: "",
      gstNumber: "",
      code: "",
    },
  });
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const [countdown, setCountdown] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [sendCodeLoading, setSendCodeLoading] = useState(false);
  const { setUser, setLoading } = useAppContext();

  const handleNext = async () => {
    let fieldsToValidate = [];

    if (step === 1) {
      fieldsToValidate = [
        "firstName",
        "lastName",
        "email",
        "password",
        "confirmPassword",
        "whatsapp",
      ];
    } else if (step === 2) {
      fieldsToValidate = ["street", "city", "state", "country", "pincode"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid && step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (data: z.infer<typeof schema>) => {
    const Codeisthere = await trigger("code");
    if (step === 4 && !Codeisthere) {
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("/api/register", data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (response.data.success) {
        toast({
          title: "Registration successful!",
          description: response.data.message || "Success!",
          variant: "default",
        });
        if (response?.data?.user?.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
        setUser(response.data.user);
      }
    } catch (error: any) {
      toast({
        title: "Registration failed!",
        description: error.response.data.message || "Something went wrong!",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    if (password.match(/[^A-Za-z0-9]/)) strength += 25;
    return strength;
  };

  const handleSendCode = async () => {
    const isEmailValid = await trigger("email");
    if (!isEmailValid) {
      return;
    }
    const email = getValues("email");
    setSendCodeLoading(true);
    try {
      const response = await axios.post("/api/register_verification", {
        email: email,
      });

      if (response?.data) {
        setStep(4);
        setCountdown(60);

        intervalRef.current = setInterval(() => {
          setCountdown((prevCount) => {
            if (prevCount <= 1) {
              clearInterval(intervalRef.current);
              return 0;
            }
            return prevCount - 1;
          });
        }, 1000);

        stoast.success(response?.data?.message);
      }
    } catch (error) {
      if (error?.response?.data?.message === "Email is already registered.") {
        setError("email", {
          type: "manual",
          message: "This email is already registered",
        });
        setStep(1);
      }
      stoast.error(error?.response?.data?.message);
    } finally {
      setSendCodeLoading(false);
    }
  };
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();

      const { user } = result;
      if (!user) {
        return;
      }
      const { displayName, email, photoURL, uid } = user;

      const res = await axios.post(
        "/api/google-getway",
        {
          name: displayName,
          email,
          photoURL,
          googleId: uid,
        },
        { withCredentials: true }
      );

      setUser(
        res?.data?.user || {
          name: displayName,
          email,
          profilePic: photoURL,
        }
      );

      stoast.success(
        res?.data?.message || "Successfully logged in with Google"
      );

      if (res?.data?.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      stoast.error("Failed to login with Google");
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 relative">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" {...register("firstName")} />
                {errors.firstName && (
                  <p className="text-xs text-red-500 absolute -bottom-5">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2 relative">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" {...register("lastName")} />
                {errors.lastName && (
                  <p className="text-xs text-red-500 absolute -bottom-5">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center space-x-2 relative">
                <Input id="email" type="email" {...register("email")} />

                {errors.email && (
                  <p className="text-xs text-red-500 absolute -bottom-5 left-[-8px]">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2 relative">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register("password")} />
              <Progress
                value={calculatePasswordStrength(getValues("password"))}
                className="h-2"
              />
              <p className="text-sm text-muted-foreground ">
                {errors.password && (
                  <p className="text-xs text-red-500 ">
                    {errors.password.message}
                  </p>
                )}
              </p>
            </div>
            <div className="space-y-2 relative">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 absolute -bottom-5">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <div className="space-y-2 relative">
              <Label htmlFor="whatsapp">WhatsApp Number</Label>
              <Input id="whatsapp" type="tel" {...register("whatsapp")} />
              {errors.whatsapp && (
                <p className="text-xs text-red-500 absolute -bottom-5">
                  {errors.whatsapp.message}
                </p>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2 relative">
              <Label htmlFor="country">Country</Label>
              <Input id="country" {...register("country")} />
              {errors.country && (
                <p className="text-xs text-red-500 absolute -bottom-5">
                  {errors.country.message}
                </p>
              )}
            </div>
            {getValues("country") && (
              <>
                <div className="space-y-2 relative">
                  <Label htmlFor="street">Street Name</Label>
                  <Input id="street" {...register("street")} />
                  {errors.street && (
                    <p className="text-xs text-red-500 absolute -bottom-5">
                      {errors.street.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 relative">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" {...register("city")} />
                    {errors.city && (
                      <p className="text-xs text-red-500 absolute -bottom-5">
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2  relative">
                    <Label htmlFor="state">State</Label>
                    {getValues("country").toLowerCase() === "india" ? (
                      <Controller
                        name="state"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              {indianStates.map((state) => (
                                <SelectItem key={state} value={state}>
                                  {state}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    ) : (
                      <Input id="state" {...register("state")} />
                    )}
                    {errors.state && (
                      <p className="text-xs text-red-500 absolute -bottom-5">
                        {errors.state.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2 relative">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input id="pincode" type="text" {...register("pincode")} />
                  {errors.pincode && (
                    <p className="text-xs text-red-500 absolute -bottom-5">
                      {errors.pincode.message}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2 relative">
              <Label htmlFor="organizationName">
                Organization Name (Optional)
              </Label>
              <Input id="organizationName" {...register("organizationName")} />
              {errors.organizationName && (
                <p className="text-xs text-red-500 absolute -bottom-5">
                  {errors.organizationName.message}
                </p>
              )}
            </div>
            <div className="space-y-2 relative">
              <Label htmlFor="gstNumber">GST Number (Optional)</Label>
              <Input id="gstNumber" {...register("gstNumber")} />
              {errors.gstNumber && (
                <p className="text-xs text-red-500 absolute -bottom-5">
                  {errors.gstNumber.message}
                </p>
              )}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4 pb-4">
            <h1>Please check your email for verification code</h1>
            <div className="space-y-2 relative">
              <VerificationInput
                onComplete={(code) => {
                  setValue("code", code);
                  trigger("code");
                }}
              />
              {errors.code && (
                <p className="text-xs text-red-500 absolute -bottom-5">
                  {errors.code.message}
                </p>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MarketingNavbar />
      <div className="flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Step {step} of 4:{" "}
              {step === 1
                ? "Personal Info"
                : step === 2
                ? "Address"
                : step === 3
                ? "Organization"
                : "Verification"}
            </CardDescription>
            <Progress value={(step / 4) * 100} className="h-2" />
          </CardHeader>
          <form onSubmit={validateSubmit(handleSubmit)}>
            <CardContent>{renderStep()}</CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="flex justify-between w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={step === 1}
                >
                  Back
                </Button>
                {step < 3 ? (
                  <Button type="button" onClick={handleNext}>
                    Next
                  </Button>
                ) : step < 4 ? (
                  <Button type="button" onClick={handleSendCode}>
                    Complete
                  </Button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      onClick={handleSendCode}
                      disabled={countdown > 0 || sendCodeLoading}
                    >
                      {countdown > 0 ? (
                        <span className="text-sm text-white  dark:text-black">
                          {countdown}s Resend
                        </span>
                      ) : (
                        <span className="text-sm text-white dark:text-black">
                          Send Code
                        </span>
                      )}
                    </Button>

                    <Button type="submit" disabled={isSubmitting || step !== 4}>
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin mr-2"></div>
                          <span>Submitting...</span>
                        </div>
                      ) : (
                        "Complete Sign Up"
                      )}
                    </Button>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Already have an account?{" "}
                <Link to="/signin" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>{" "}
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-[9] bg-white dark:bg-[#161616] px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <div className="flex flex-col gap-4">
                <button
                  type="button"
                  className="inline-flex justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 dark:focus-visible:ring-slate-300 text-background shadow hover:bg-primary/90 h-9 px-4 py-2 w-full !flex items-center rounded-full  dark:text-black text-white dark:text-inherit hover:text-white bg-primary"
                  onClick={handleGoogleSignIn}
                >
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    version="1.1"
                    x="0px"
                    y="0px"
                    viewBox="0 0 48 48"
                    enableBackground="new 0 0 48 48"
                    style={{
                      color: "rgba(0, 0, 0, 0.2)",
                      fontSize: "30px",
                      verticalAlign: "middle",
                      cursor: "pointer",
                    }}
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="#FFC107"
                      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
                                c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
                                c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                    ></path>
                    <path
                      fill="#FF3D00"
                      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
                                C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                    ></path>
                    <path
                      fill="#4CAF50"
                      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
                                c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                    ></path>
                    <path
                      fill="#1976D2"
                      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
                                c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                    ></path>
                  </svg>
                  <span className="font- text-center dark:text-black">
                    Sign up with Google
                  </span>
                </button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

interface VerificationInputProps {
  onComplete?: (code: string) => void;
}

const VerificationInput: React.FC<VerificationInputProps> = ({
  onComplete,
}) => {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ): void => {
    const value = e.target.value;
    if (value.length > 1) {
      return;
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every((digit) => digit !== "") && index === 5) {
      if (onComplete) {
        onComplete(newCode.join(""));
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ): void => {
    if (e.key === "Backspace" && index > 0 && code[index] === "") {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();

    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setCode(digits);

      inputRefs.current[5]?.focus();
      if (onComplete) {
        onComplete(pastedData);
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <label className="text-sm font-medium leading-none">
          Verification Code
        </label>
      </div>
      <div className="flex gap-2 justify-between">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            className="flex h-12 w-12 items-center justify-center rounded-md border border-slate-200 bg-transparent text-center text-xl font-semibold shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary dark:border-slate-600 dark:focus-visible:ring-primary"
            type="text"
            inputMode="numeric"
            maxLength={1}
            pattern="\d"
            value={code[index]}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={index === 0 ? handlePaste : null}
            autoComplete="one-time-code"
          />
        ))}
      </div>
    </div>
  );
};
export default SignUp;
