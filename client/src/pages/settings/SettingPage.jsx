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
    AlertTriangle,
    Trash2,
    Loader2,
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
    const [deleteAccountDialog, setDeleteAccountDialog] = useState(false);
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");
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

        if (resData.status) {
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
        <div className="min-h-screen w-full bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-900 flex flex-col">
            {/* Header */}
            <Header
                title="Settings"
                icon={<SettingsIcon />}
                subHeader="Manage your account preferences"
            />
            {/* Main Content */}
            <main className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-2xl mx-auto space-y-6">
                    <Card className="w-full shadow-lg">
                        <CardHeader className="text-center pb-2">
                            <CardTitle className="text-3xl font-bold">
                                User Details
                            </CardTitle>
                            <CardDescription className="text-base">
                                Update your profile and connect your social
                                accounts
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
                                                setEditNameDialog(
                                                    (prev) => !prev
                                                );
                                                setTimeout(
                                                    () =>
                                                        nameRef.current?.focus(),
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
                                        <DialogDescription className="text-muted-foreground">
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
                                                        <FormLabel className="text-sm font-semibold">
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
                                                        <FormLabel className="text-sm font-semibold">
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
                                                        <FormLabel className="text-sm font-semibold">
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
                </div>
            </main>

            {/* Danger Zone Section */}
            <div className="max-w-2xl mx-auto px-6 pb-10">
                <Card className="border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-500" />
                            <CardTitle className="text-red-600 dark:text-red-500">
                                Danger Zone
                            </CardTitle>
                        </div>
                        <CardDescription className="text-red-600/70 dark:text-red-400/70">
                            Irreversible and destructive actions
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-10 items-center justify-between p-4 border border-red-200 dark:border-red-900/50 rounded-lg bg-white dark:bg-card">
                            <div>
                                <h3 className="font-semibold text-red-600 dark:text-red-500">
                                    Delete Account
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Permanently delete your account and all of
                                    your data.
                                </p>
                            </div>
                            <Button
                                variant="destructive"
                                className="cursor-pointer gap-2"
                                onClick={() => setDeleteAccountDialog(true)}
                            >
                                <Trash2 className="h-4 w-4" />
                                Delete Account
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Delete Account Confirmation Dialog */}
            <Dialog
                open={deleteAccountDialog}
                onOpenChange={(open) => {
                    setDeleteAccountDialog(open);
                    if (!open) {
                        setDeleteConfirmText("");
                    }
                }}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30">
                                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-500" />
                            </div>
                            <DialogTitle className="text-xl font-semibold text-red-600 dark:text-red-500">
                                Delete Account
                            </DialogTitle>
                        </div>
                        <DialogDescription className="text-muted-foreground pt-2">
                            This action is irreversible. All your data, posts,
                            and settings will be permanently deleted.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg">
                            <p className="text-sm text-red-600 dark:text-red-400">
                                <strong>Warning:</strong> This will permanently
                                delete:
                            </p>
                            <ul className="text-sm text-red-600/80 dark:text-red-400/80 mt-2 list-disc list-inside space-y-1">
                                <li>Your profile and account settings</li>
                                <li>All your website posts</li>
                                <li>All your connected social media posts</li>
                            </ul>
                        </div>

                        <div>
                            <label className="text-sm font-semibold">
                                Type{" "}
                                <span className="text-red-600 dark:text-red-500 font-mono">
                                    DELETE
                                </span>{" "}
                                to confirm
                            </label>
                            <Input
                                type="text"
                                placeholder="Type DELETE to confirm"
                                className="mt-2 h-12"
                                value={deleteConfirmText}
                                onChange={(e) =>
                                    setDeleteConfirmText(e.target.value)
                                }
                            />
                        </div>
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
                            variant="destructive"
                            disabled={
                                deleteConfirmText !== "DELETE" ||
                                isDeletingAccount
                            }
                            className="cursor-pointer gap-2"
                            onClick={async () => {
                                try {
                                    setIsDeletingAccount(true);
                                    const response = await fetch(
                                        `/api/users/${user.id}`,
                                        {
                                            method: "DELETE",
                                        }
                                    );
                                    const data = await response.json();

                                    if (response.ok && data.status) {
                                        toast.success(
                                            data.message ||
                                                "Account deleted successfully"
                                        );
                                        // Redirect to login or home page
                                        window.location.href = "/auth/login";
                                    } else {
                                        toast.error(
                                            data.message ||
                                                "Failed to delete account"
                                        );
                                    }
                                } catch (error) {
                                    console.error(
                                        "Error deleting account:",
                                        error
                                    );
                                    toast.error(
                                        "Something went wrong while deleting your account."
                                    );
                                } finally {
                                    setIsDeletingAccount(false);
                                }
                            }}
                        >
                            {isDeletingAccount ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="h-4 w-4" />
                                    Delete Account
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
