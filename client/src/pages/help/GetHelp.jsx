import { Header } from "@/components/sidebar/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    HelpCircleIcon,
    MailIcon,
    PhoneIcon,
    SendIcon,
    CheckCircle2,
    Loader2,
} from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { helpValidator } from "@/utlis/post.validator";
import toast, { Toaster } from "react-hot-toast";

export default function GetHelp() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const form = useForm({
        resolver: zodResolver(helpValidator),
        defaultValues: {
            email: "",
            contact: "",
            description: "",
        },
    });

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);

            await new Promise((resolve) => setTimeout(resolve, 1500));

            console.log("Form submitted:", data);

            toast.success(
                "Message sent successfully! We'll get back to you soon."
            );
            setIsSubmitted(true);
            form.reset();

            setTimeout(() => {
                setIsSubmitted(false);
            }, 3000);
        } catch (error) {
            console.error(error);
            toast.error("Failed to send message. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const descriptionValue = form.watch("description") || "";
    const maxLength = 500;
    const characterCount = descriptionValue.length;
    const isNearLimit = characterCount > maxLength * 0.8;
    const isAtLimit = characterCount >= maxLength;

    return (
        <>
            <div className="h-full min-h-dvh max-h-dvh flex flex-col w-full bg-linear-to-br from-slate-50 via-purple-50 to-slate-100 overflow-y-auto">
                <Header
                    title="Get Help"
                    icon={<HelpCircleIcon />}
                    subHeader="Support, guides, and FAQs"
                    profilePicture
                />

                <section className="mt-6 px-10 pb-10 flex-1 flex items-start justify-center">
                    <div className="w-full max-w-2xl">
                        {/* Header Card */}
                        <div className="bg-white border rounded-lg p-6 mb-6 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                                    <HelpCircleIcon className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">
                                        How can we help you?
                                    </h2>
                                    <p className="text-muted-foreground">
                                        Fill out the form below and our support
                                        team will get back to you as soon as
                                        possible.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Form Card */}
                        <div className="bg-white border rounded-lg p-8 shadow-sm">
                            {isSubmitted ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">
                                        Message Sent Successfully!
                                    </h3>
                                    <p className="text-muted-foreground text-center">
                                        Thank you for reaching out. We'll
                                        respond to your inquiry shortly.
                                    </p>
                                </div>
                            ) : (
                                <Form {...form}>
                                    <form
                                        onSubmit={form.handleSubmit(onSubmit)}
                                        className="space-y-6"
                                    >
                                        {/* Email Field */}
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-semibold flex items-center gap-2">
                                                        <MailIcon className="w-4 h-4 text-purple-600" />
                                                        Email Address
                                                        <span className="text-red-500">
                                                            *
                                                        </span>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="email"
                                                            placeholder="your.email@example.com"
                                                            className="h-11"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <p className="text-xs text-muted-foreground">
                                                        We'll use this to
                                                        respond to your inquiry
                                                    </p>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Contact Number Field */}
                                        <FormField
                                            control={form.control}
                                            name="contact"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-semibold flex items-center gap-2">
                                                        <PhoneIcon className="w-4 h-4 text-purple-600" />
                                                        Contact Number
                                                        <span className="text-red-500">
                                                            *
                                                        </span>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="tel"
                                                            placeholder="+977 9800000000"
                                                            className="h-11"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <p className="text-xs text-muted-foreground">
                                                        Optional: For urgent
                                                        matters
                                                    </p>
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
                                                    <FormLabel className="text-sm font-semibold flex items-center gap-2">
                                                        <HelpCircleIcon className="w-4 h-4 text-purple-600" />
                                                        How can we help?
                                                        <span className="text-red-500">
                                                            *
                                                        </span>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Please describe your issue or question in detail..."
                                                            rows={6}
                                                            maxLength={
                                                                maxLength
                                                            }
                                                            className="resize-none"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <div className="flex justify-end">
                                                        <span
                                                            className={`text-xs ${
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

                                        {/* Submit Button */}
                                        <div className="pt-4">
                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold h-12 text-base transition-all duration-200 cursor-pointer"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                        Sending...
                                                    </>
                                                ) : (
                                                    <>
                                                        <SendIcon className="w-5 h-5 mr-2" />
                                                        Send Message
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            )}
                        </div>

                        {/* Additional Help Card */}
                        <div className="mt-6 bg-linear-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
                            <h3 className="font-semibold mb-3 text-purple-900">
                                Need immediate assistance?
                            </h3>
                            <div className="space-y-2 text-sm text-purple-800">
                                <p className="flex items-center gap-2">
                                    <MailIcon className="w-4 h-4" />
                                    Email us at:{" "}
                                    <a
                                        href="mailto:support@dispachr.com"
                                        className="font-semibold hover:underline"
                                    >
                                        support@dispachr.com
                                    </a>
                                </p>
                                <p className="flex items-center gap-2">
                                    <PhoneIcon className="w-4 h-4" />
                                    Call us at:{" "}
                                    <a
                                        href="#"
                                        className="font-semibold hover:underline"
                                    >
                                        +977 9865321478
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
