import { Button } from "../../components/ui/button";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { postValidator } from "@/lib/post.validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Globe,
    Twitter,
    Facebook,
    Send,
    Loader2,
    FileTextIcon,
    Eye,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import toast from "react-hot-toast";
import { Header } from "@/components/sidebar/Header";
import { PostPreview } from "@/components/ui/post-preview";
import { useAuth } from "@/hooks/useAuth";

export default function CreatePosts() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();
    const maxLength = 255;

    const form = useForm({
        resolver: zodResolver(postValidator),
        defaultValues: {
            title: "",
            description: "",
            platforms: ["website"],
        },
    });

    const platforms = [
        {
            id: "website",
            icon: <Globe className="h-5 w-5" />,
            name: "Website",
        },
        {
            id: "twitter",
            icon: <Twitter className="h-5 w-5" />,
            name: "Twitter",
        },
        {
            id: "facebook",
            icon: <Facebook className="h-5 w-5" />,
            name: "Facebook",
        },
    ];

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            console.log(data);

            const response = await fetch("/api/posts/", {
                body: JSON.stringify(data),
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            const resData = await response.json();
            console.log(resData);

            if (response.ok) {
                form.reset();
                toast.success(resData.message, {});
            } else {
                toast.error(resData.message || "Failed to create post");
            }
        } catch (error) {
            console.error(error.message);
            toast.error("Something went wrong", {});
        } finally {
            setIsSubmitting(false);
        }
    };

    const descriptionValue = form.watch("description") || "";
    const titleValue = form.watch("title") || "";
    const platformsValue = form.watch("platforms") || [];
    const characterCount = descriptionValue.length;
    const isNearLimit = characterCount > maxLength * 0.8;
    const isAtLimit = characterCount >= maxLength;

    return (
        <div className="h-screen w-full bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-900 overflow-hidden flex flex-col">
            {/* Header */}
            <Header
                title="Create Post"
                icon={<FileTextIcon />}
                subHeader="Share your thoughts with the community"
            />

            {/* Main Content */}
            <main className="flex-1 p-6 overflow-auto">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column - Form */}
                    <Card className="shadow-lg h-fit">
                        <CardHeader className="text-center pb-2">
                            <CardTitle className="text-3xl font-bold">
                                What's on your mind?
                            </CardTitle>
                            <CardDescription className="text-base">
                                Share your content across multiple platforms
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                            {/* Form */}
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-6"
                                >
                                    {/* Title Field */}
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base">
                                                    Title
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Give your post a catchy title..."
                                                        className="h-12 text-base"
                                                        {...field}
                                                        value={titleValue}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Description Field */}
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base">
                                                    Content
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Write your post content here..."
                                                        className="min-h-[200px] text-base resize-none"
                                                        maxLength={maxLength}
                                                        {...field}
                                                        value={descriptionValue}
                                                    />
                                                </FormControl>
                                                <div className="flex justify-end">
                                                    <span
                                                        className={`text-sm ${
                                                            isAtLimit
                                                                ? "text-red-500 font-medium"
                                                                : isNearLimit
                                                                ? "text-amber-500"
                                                                : "text-muted-foreground"
                                                        }`}
                                                    >
                                                        {characterCount} /{" "}
                                                        {maxLength}
                                                    </span>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Platforms Selection */}
                                    <FormField
                                        control={form.control}
                                        name="platforms"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base">
                                                    Publish to
                                                </FormLabel>
                                                <div className="grid grid-cols-3 gap-4 pt-2">
                                                    {platforms.map(
                                                        (platform) => {
                                                            const isChecked =
                                                                field.value?.includes(
                                                                    platform.id
                                                                );
                                                            return (
                                                                <Label
                                                                    key={
                                                                        platform.id
                                                                    }
                                                                    className={`
                                                                    flex flex-col items-center gap-3 p-5 rounded-2xl border-2 cursor-pointer transition-all
                                                                    ${
                                                                        isChecked
                                                                            ? "border-primary bg-primary/5 shadow-md"
                                                                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                                                                    }
                                                                `}
                                                                >
                                                                    <Checkbox
                                                                        checked={
                                                                            isChecked
                                                                        }
                                                                        onCheckedChange={(
                                                                            checked
                                                                        ) => {
                                                                            if (
                                                                                checked
                                                                            ) {
                                                                                field.onChange(
                                                                                    [
                                                                                        ...field.value,
                                                                                        platform.id,
                                                                                    ]
                                                                                );
                                                                            } else {
                                                                                field.onChange(
                                                                                    field.value.filter(
                                                                                        (
                                                                                            v
                                                                                        ) =>
                                                                                            v !==
                                                                                            platform.id
                                                                                    )
                                                                                );
                                                                            }
                                                                        }}
                                                                        className="sr-only"
                                                                    />
                                                                    <div
                                                                        className={`p-3 rounded-full ${
                                                                            isChecked
                                                                                ? "bg-primary/10 text-primary"
                                                                                : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                                                                        }`}
                                                                    >
                                                                        {
                                                                            platform.icon
                                                                        }
                                                                    </div>
                                                                    <span
                                                                        className={`font-medium ${
                                                                            isChecked
                                                                                ? "text-primary"
                                                                                : "text-gray-600 dark:text-gray-400"
                                                                        }`}
                                                                    >
                                                                        {
                                                                            platform.name
                                                                        }
                                                                    </span>
                                                                </Label>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        size="lg"
                                        disabled={isSubmitting}
                                        className="w-full h-12 text-base gap-2 cursor-pointer"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                Publishing...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-5 w-5" />
                                                Publish Post
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>

                    {/* Right Column - Preview */}
                    <div className="lg:sticky h-fit">
                        <Card className="shadow-lg">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <Eye className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">
                                            Live Preview
                                        </CardTitle>
                                        <CardDescription>
                                            See how your post will look on each
                                            platform
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <PostPreview
                                    title={titleValue}
                                    description={descriptionValue}
                                    selectedPlatforms={platformsValue}
                                    userName={user?.fullName}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
