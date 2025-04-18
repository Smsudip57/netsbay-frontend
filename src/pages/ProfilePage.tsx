import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Eye, EyeOff, Upload, Trash2, Pencil, Save } from "lucide-react";
import { useAppContext } from "@/context/context";
import axios from "axios";

// Form schemas
const profileSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    whatsapp: z
        .string()
        .min(10, "Phone number must be at least 10 digits")
        .optional(),
    organizationName: z.string().optional(),
    gstNumber: z.string().optional(),
});

const addressSchema = z.object({
    country: z.string().min(2, "Country must be at least 2 characters"),
    state: z.string().min(2, "State must be at least 2 characters"),
    city: z.string().min(2, "City must be at least 2 characters"),
    street: z.string().min(2, "Street name must be at least 2 characters"),
    pincode: z.string().min(4, "Pincode must be at least 4 characters"),
});

const passwordSchema = z
    .object({
        currentPassword: z
            .string()
            .min(8, "Password must be at least 8 characters"),
        newPassword: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

const ProfilePage = () => {
    const { toast } = useToast();
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [passwordVerificationOpen, setPasswordVerificationOpen] = useState(false);
    const [currentVerificationAction, setCurrentVerificationAction] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { user, setUser } = useAppContext();

    // Forms
    const profileForm = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            email: user?.email || "",
            whatsapp: user?.whatsapp || "",
            organizationName: user?.organizationName || "",
            gstNumber: user?.gstNumber || "",
        },
    });

    const addressForm = useForm({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            country: user?.address?.country || "",
            state: user?.address?.state || "",
            city: user?.address?.city || "",
            street: user?.address?.street || "",
            pincode: user?.address?.pincode || "",
        },
    });

    const passwordForm = useForm({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const verificationForm = useForm({
        defaultValues: {
            password: "",
        },
    });

    // Update form values when user data changes
    useEffect(() => {
        if (user) {
            profileForm.reset({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                whatsapp: user.whatsapp || "",
                organizationName: user.organizationName || "",
                gstNumber: user.gstNumber || "",
            });

            addressForm.reset({
                country: user.address?.country || "",
                state: user.address?.state || "",
                city: user.address?.city || "",
                street: user.address?.street || "",
                pincode: user.address?.pincode || "",
            });
        }
    }, [user]);

    const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsLoading(true);
            // Create FormData for image upload
            const formData = new FormData();
            formData.append('profileImage', file);

            // Send image to server
            const response = await axios.post('/api/user/profileedit', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,  // Include credentials for session management
            });

            if (response.status === 200) {
                if (response?.data?.user) setUser(response?.data?.user);

                toast({
                    title: "Profile image updated",
                    description: "Your profile image has been successfully updated.",
                });
            }
        } catch (error) {
            console.error('Error uploading profile image:', error);
            toast({
                title: "Error",
                description: "Failed to update profile image. Please try again later.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteProfileImage = async () => {
        try {
            setIsLoading(true);

            const response = await axios.post('/api/user/profileedit', {
                deleteProfileImage: true
            }, {
                withCredentials: true,  // Include credentials for session management
            });

            if (response.status === 200) {
                if (response?.data?.user) setUser(response?.data?.user);
                toast({
                    title: "Profile image removed",
                    description: "Your profile image has been removed.",
                });
            }
        } catch (error) {
            console.error('Error removing profile image:', error);
            toast({
                title: "Error",
                description: "Failed to remove profile image. Please try again later.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const onUpdateProfile = async (data: any) => {
        // Verify password first
        setCurrentVerificationAction("profile");
        setPasswordVerificationOpen(true);
    };

    const onUpdateAddress = async (data: any) => {
        // Verify password first
        setCurrentVerificationAction("address");
        setPasswordVerificationOpen(true);
    };

    const onChangePassword = async (data: any) => {
        try {
            setIsLoading(true);

            const response = await axios.post('/api/user/profileedit', {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
                type: 'passwordChange'
            }, {
                withCredentials: true
            });

            if (response.status === 200) {
                if (response?.data?.user) setUser(response?.data?.user);
                toast({
                    title: "Password updated",
                    description: "Your password has been successfully updated.",
                });
                passwordForm.reset();
            }
        } catch (error: any) {
            console.error('Error updating password:', error);
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to update password. Please check your current password and try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerification = async (verificationData: any) => {
        try {
            setIsLoading(true);

            if (currentVerificationAction === "profile") {
                const formData = profileForm.getValues();

                const response = await axios.post('/api/user/profileedit', {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    whatsapp: formData.whatsapp,
                    organizationName: formData.organizationName,
                    gstNumber: formData.gstNumber,
                    password: verificationData.password,
                    type: 'profileUpdate'
                }, {
                    withCredentials: true,
                });

                if (response.status === 200) {
                if (response?.data?.user) setUser(response?.data?.user);
                    setIsEditingProfile(false);
                    toast({
                        title: "Profile updated",
                        description: "Your profile has been successfully updated.",
                    });
                }
            } else if (currentVerificationAction === "address") {
                const formData = addressForm.getValues();

                const response = await axios.post('/api/user/profileedit', {
                    address: {
                        country: formData.country,
                        state: formData.state,
                        city: formData.city,
                        street: formData.street,
                        pincode: formData.pincode,
                    },
                    password: verificationData.password,
                    type: 'addressUpdate'
                }, {
                    withCredentials: true
                });

                if (response.status === 200) {
                if (response?.data?.user) setUser(response?.data?.user);
                    setIsEditingAddress(false);
                    toast({
                        title: "Address updated",
                        description: "Your address has been successfully updated.",
                    });
                }
            }

            setPasswordVerificationOpen(false);
            setCurrentVerificationAction(null);
            verificationForm.reset();

        } catch (error: any) {
            console.error('Error updating profile:', error);
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to update. Please check your password and try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full mx-auto py-8 px-4 md:px-6">
            <div className=" mx-auto">
                <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

                {/* Profile Image Section */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Profile Picture</CardTitle>
                        <CardDescription>
                            Update your profile picture. It will be visible to other users.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                        <div className="relative mb-4">
                            <Avatar className="h-32 w-32">
                                <AvatarImage src={user?.profile?.avatarUrl || ""} alt="Profile" />
                                <AvatarFallback className="text-4xl">
                                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                                </AvatarFallback>
                            </Avatar>
                            {user?.profile?.avatarUrl && (
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute bottom-0 right-0 rounded-full"
                                    onClick={handleDeleteProfileImage}
                                    disabled={isLoading}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        <div className="flex gap-4">
                            <Button asChild className="cursor-pointer" disabled={isLoading}>
                                <label>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload Image
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={handleProfileImageUpload}
                                        accept="image/*"
                                    />
                                </label>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Tabs */}
                <Tabs defaultValue="account" className="w-full">
                    <TabsList className="grid grid-cols-3 mb-8">
                        <TabsTrigger value="account">Account</TabsTrigger>
                        <TabsTrigger value="address">Address</TabsTrigger>
                        <TabsTrigger value="security">Security</TabsTrigger>
                    </TabsList>

                    {/* Account Tab */}
                    <TabsContent value="account">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Account Information</CardTitle>
                                    <CardDescription>
                                        Manage your account details
                                    </CardDescription>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                                >
                                    {isEditingProfile ? (
                                        <>Cancel</>
                                    ) : (
                                        <>
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Edit
                                        </>
                                    )}
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <Form {...profileForm}>
                                    <form
                                        onSubmit={profileForm.handleSubmit(onUpdateProfile)}
                                        className="space-y-6"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                                control={profileForm.control}
                                                name="firstName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>First Name</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                disabled={!isEditingProfile || isLoading}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={profileForm.control}
                                                name="lastName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Last Name</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                disabled={!isEditingProfile || isLoading}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={profileForm.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Email Address</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                disabled={true} // Email is not editable
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Your email cannot be changed
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={profileForm.control}
                                                name="whatsapp"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>WhatsApp Number</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                disabled={!isEditingProfile || isLoading}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={profileForm.control}
                                                name="organizationName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Organization Name</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                disabled={!isEditingProfile || isLoading}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={profileForm.control}
                                                name="gstNumber"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>GST Number</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                disabled={!isEditingProfile || isLoading}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        {isEditingProfile && (
                                            <Button
                                                type="submit"
                                                className="w-full md:w-auto"
                                                disabled={isLoading}
                                            >
                                                <Save className="mr-2 h-4 w-4" />
                                                Save Changes
                                            </Button>
                                        )}
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Address Tab */}
                    <TabsContent value="address">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Address Information</CardTitle>
                                    <CardDescription>
                                        Manage your address details
                                    </CardDescription>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsEditingAddress(!isEditingAddress)}
                                >
                                    {isEditingAddress ? (
                                        <>Cancel</>
                                    ) : (
                                        <>
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Edit
                                        </>
                                    )}
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <Form {...addressForm}>
                                    <form
                                        onSubmit={addressForm.handleSubmit(onUpdateAddress)}
                                        className="space-y-6"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                                control={addressForm.control}
                                                name="country"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Country</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                disabled={!isEditingAddress || isLoading}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={addressForm.control}
                                                name="state"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>State</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                disabled={!isEditingAddress || isLoading}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={addressForm.control}
                                                name="city"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>City</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                disabled={!isEditingAddress || isLoading}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={addressForm.control}
                                                name="street"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Street Name</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                disabled={!isEditingAddress || isLoading}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={addressForm.control}
                                                name="pincode"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Pincode</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                disabled={!isEditingAddress || isLoading}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        {isEditingAddress && (
                                            <Button
                                                type="submit"
                                                className="w-full md:w-auto"
                                                disabled={isLoading}
                                            >
                                                <Save className="mr-2 h-4 w-4" />
                                                Save Changes
                                            </Button>
                                        )}
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Security Tab */}
                    <TabsContent value="security">
                        <Card>
                            <CardHeader>
                                <CardTitle>Change Password</CardTitle>
                                <CardDescription>
                                    Update your password to keep your account secure
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...passwordForm}>
                                    <form
                                        onSubmit={passwordForm.handleSubmit(onChangePassword)}
                                        className="space-y-6"
                                    >
                                        <FormField
                                            control={passwordForm.control}
                                            name="currentPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Current Password</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                {...field}
                                                                type={showCurrentPassword ? "text" : "password"}
                                                                className="pr-10"
                                                                disabled={isLoading}
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="absolute right-0 top-0"
                                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                                disabled={isLoading}
                                                            >
                                                                {showCurrentPassword ? (
                                                                    <EyeOff className="h-4 w-4" />
                                                                ) : (
                                                                    <Eye className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={passwordForm.control}
                                            name="newPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>New Password</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                {...field}
                                                                type={showNewPassword ? "text" : "password"}
                                                                className="pr-10"
                                                                disabled={isLoading}
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="absolute right-0 top-0"
                                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                                disabled={isLoading}
                                                            >
                                                                {showNewPassword ? (
                                                                    <EyeOff className="h-4 w-4" />
                                                                ) : (
                                                                    <Eye className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={passwordForm.control}
                                            name="confirmPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Confirm New Password</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                {...field}
                                                                type={showConfirmPassword ? "text" : "password"}
                                                                className="pr-10"
                                                                disabled={isLoading}
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="absolute right-0 top-0"
                                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                disabled={isLoading}
                                                            >
                                                                {showConfirmPassword ? (
                                                                    <EyeOff className="h-4 w-4" />
                                                                ) : (
                                                                    <Eye className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button
                                            type="submit"
                                            className="w-full md:w-auto"
                                            disabled={isLoading}
                                        >
                                            Update Password
                                        </Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Password Verification Dialog */}
                <Dialog open={passwordVerificationOpen} onOpenChange={setPasswordVerificationOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Verify Password</DialogTitle>
                            <DialogDescription>
                                Please enter your current password to continue.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={verificationForm.handleSubmit(handleVerification)}>
                            <div className="space-y-4">
                                <div className="relative">
                                    <Label htmlFor="verify-password">Current Password</Label>
                                    <Input
                                        id="verify-password"
                                        type="password"
                                        {...verificationForm.register("password")}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                            <DialogFooter className="mt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setPasswordVerificationOpen(false)}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    Verify & Continue
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default ProfilePage;