import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Settings,
    Facebook,
    Twitter,
    Eye,
    EyeOff,
    SettingsIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordValidator } from "@/utlis/post.validator";
import toast from "react-hot-toast";
import { Header } from "@/components/sidebar/Header";

export default function SettingPage() {
    const [user, setUser] = useState({});
    const [originalName, setOriginalName] = useState("");
    const [changePasswordDialog, setChangePasswordDialog] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [editNameDialog, setEditNameDialog] = useState(false);
    const nameRef = useRef(null);

    const form = useForm({
        resolver: zodResolver(passwordValidator),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    useEffect(() => {
        const getUserData = async () => {
            const response = await fetch("/api/users/me");
            const userData = await response.json();
            setUser(userData.user);
            setOriginalName(userData.user.fullName); // Store original name
        };
        getUserData();

        if (editNameDialog) {
            nameRef.current?.focus();
        }
    }, [editNameDialog]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = form.getValues();
        const response = await fetch("/api/users/checkPass", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const resData = await response.json();

        if (resData.success) {
            toast.success(resData.message);
            setChangePasswordDialog(false);
        }

        console.log(resData);
    };

    const [isUpdatingName, setIsUpdatingName] = useState(false);

    const updateFullName = async () => {
        if (!user.fullName?.trim()) {
            toast.error("Name cannot be empty");
            return;
        }

        // Compare with the original name to prevent unnecessary API calls
        if (user.fullName.trim() === originalName.trim()) {
            toast.error("Name unchanged");
            setEditNameDialog(false);
            return;
        }

        try {
            setIsUpdatingName(true);
            const response = await fetch(`/api/users/${user.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fullName: user.fullName,
                }),
            });

            const resData = await response.json();

            if (response.ok) {
                toast.success(resData.message || "Name updated successfully");
                setUser(resData.data);
                setOriginalName(resData.data.fullName); // Update original name after successful save
                setEditNameDialog(false);
            } else {
                toast.error(resData.message || "Failed to update name");
            }
        } catch (error) {
            console.error("Error updating name:", error);
            toast.error("Something went wrong while updating your name.");
        } finally {
            setIsUpdatingName(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-linear-to-br from-slate-50 to-slate-100 flex flex-col">
            {/* Header */}
            <Header
                title="Settings"
                icon={<SettingsIcon />}
                subHeader="Manage your account preferences"
            />
            {/* Main Content */}
            <main className="flex items-center justify-center min-h-[calc(100vh-73px)] p-6">
                <Card className="w-full max-w-2xl shadow-lg">
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-3xl font-bold">
                            User Details
                        </CardTitle>
                        <CardDescription className="text-base">
                            Update your profile and connect your social accounts
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-6">
                        <div className="space-y-4">
                            <div className="relative group">
                                <label className="block text-base font-medium mb-1">
                                    Name
                                </label>
                                <Input
                                    ref={nameRef}
                                    type="text"
                                    value={user.fullName || ""}
                                    readOnly={!editNameDialog}
                                    className="h-12 text-base"
                                    onChange={(e) =>
                                        setUser((prev) => ({
                                            ...prev,
                                            fullName: e.target.value,
                                        }))
                                    }
                                />
                                <div className="flex gap-1.5 absolute top-8.5 right-1.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300">
                                    <Button
                                        variant={
                                            editNameDialog
                                                ? "destructive"
                                                : "default"
                                        }
                                        className="rounded-sm cursor-pointer"
                                        onClick={() => {
                                            setEditNameDialog((prev) => !prev);
                                            setTimeout(
                                                () => nameRef.current?.focus(),
                                                0
                                            );
                                        }}
                                    >
                                        {editNameDialog ? "Cancel" : "Edit"}
                                    </Button>

                                    {editNameDialog && (
                                        <Button
                                            className="cursor-pointer"
                                            disabled={isUpdatingName}
                                            onClick={() => {
                                                updateFullName();
                                            }}
                                        >
                                            {isUpdatingName
                                                ? "Saving..."
                                                : "Save"}
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-base font-medium mb-1">
                                    Email
                                </label>
                                <Input
                                    type="email"
                                    value={user.email || ""}
                                    readOnly
                                    className="h-12 text-base"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 pt-2">
                            <Button
                                type="button"
                                className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                <Facebook className="h-5 w-5" /> Connect to
                                Facebook
                            </Button>
                            <Button
                                type="button"
                                className="w-full sm:w-auto gap-2 bg-blue-400 hover:bg-blue-500 text-white"
                            >
                                <Twitter className="h-5 w-5" /> Connect to
                                Twitter
                            </Button>
                        </div>

                        {/* Change password section */}
                        <h2 className="text-xl font-semibold mb-4">
                            Change Password
                        </h2>
                        <Button
                            type="button"
                            className="w-full h-12 text-base font-semibold mt-2 cursor-pointer"
                            onClick={() => setChangePasswordDialog(true)}
                        >
                            Change Password
                        </Button>

                        <Dialog
                            open={changePasswordDialog}
                            onOpenChange={(open) => {
                                setChangePasswordDialog(open);
                                if (!open) {
                                    form.reset();
                                }
                            }}
                        >
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-semibold">
                                        Change Password
                                    </DialogTitle>
                                    <DialogDescription className="text-slate-600">
                                        You can change your password here.
                                    </DialogDescription>
                                </DialogHeader>

                                <Form {...form}>
                                    <div className="space-y-4 py-4">
                                        {/* Current Password Field */}
                                        <FormField
                                            control={form.control}
                                            name="currentPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-semibold text-slate-700">
                                                        Current Password
                                                    </FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                type={
                                                                    showCurrentPassword
                                                                        ? "text"
                                                                        : "password"
                                                                }
                                                                placeholder="Enter your current password"
                                                                className="h-12 text-base pr-10"
                                                                {...field}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setShowCurrentPassword(
                                                                        !showCurrentPassword
                                                                    )
                                                                }
                                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                            >
                                                                {showCurrentPassword ? (
                                                                    <EyeOff className="h-5 w-5" />
                                                                ) : (
                                                                    <Eye className="h-5 w-5" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* New Password Field */}
                                        <FormField
                                            control={form.control}
                                            name="newPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-semibold text-slate-700">
                                                        New Password
                                                    </FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                type={
                                                                    showNewPassword
                                                                        ? "text"
                                                                        : "password"
                                                                }
                                                                placeholder="Enter your new password"
                                                                className="h-12 text-base pr-10"
                                                                {...field}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setShowNewPassword(
                                                                        !showNewPassword
                                                                    )
                                                                }
                                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                            >
                                                                {showNewPassword ? (
                                                                    <EyeOff className="h-5 w-5" />
                                                                ) : (
                                                                    <Eye className="h-5 w-5" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Confirm Password Field */}
                                        <FormField
                                            control={form.control}
                                            name="confirmPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-semibold text-slate-700">
                                                        Confirm New Password
                                                    </FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                type={
                                                                    showConfirmPassword
                                                                        ? "text"
                                                                        : "password"
                                                                }
                                                                placeholder="Confirm your new password"
                                                                className="h-12 text-base pr-10"
                                                                {...field}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setShowConfirmPassword(
                                                                        !showConfirmPassword
                                                                    )
                                                                }
                                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                            >
                                                                {showConfirmPassword ? (
                                                                    <EyeOff className="h-5 w-5" />
                                                                ) : (
                                                                    <Eye className="h-5 w-5" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="cursor-pointer"
                                            >
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <Button
                                            type="button"
                                            onClick={(e) => handleSubmit(e)}
                                            className="cursor-pointer"
                                        >
                                            Save Changes
                                        </Button>
                                    </DialogFooter>
                                </Form>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
