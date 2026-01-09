import {
    Twitter,
    Facebook,
    Globe,
    Heart,
    MessageCircle,
    Repeat2,
    Share,
    ThumbsUp,
    MessageSquare,
    Send as SendIcon,
    MoreHorizontal,
} from "lucide-react";
import { useState } from "react";

// Twitter Preview Component
const TwitterPreview = ({ title, description, userName }) => {
    const displayText =
        title && description
            ? `${title}\n\n${description}`
            : title || description || "Your tweet will appear here...";
    const characterCount = displayText.length;
    const isOverLimit = characterCount > 280;

    return (
        <div className="bg-black rounded-2xl overflow-hidden border border-gray-800">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-800 flex items-center gap-2">
                <Twitter className="h-5 w-5 text-[#1DA1F2]" />
                <span className="text-white font-semibold text-sm">
                    Twitter Preview
                </span>
                {isOverLimit && (
                    <span className="ml-auto text-xs text-red-500 font-medium">
                        {characterCount}/280 - Over limit!
                    </span>
                )}
            </div>

            {/* Tweet Content */}
            <div className="p-4">
                <div className="flex gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center shrink-0">
                        <span className="text-white font-bold text-sm">
                            {userName ? userName.charAt(0).toUpperCase() : "Y"}
                        </span>
                    </div>

                    {/* Tweet Body */}
                    <div className="flex-1 min-w-0">
                        {/* User Info */}
                        <div className="flex items-center gap-1 mb-1">
                            <span className="text-white font-bold text-sm">
                                {userName || "Your Name"}
                            </span>
                            <span className="text-gray-500 text-sm">
                                @yourhandle
                            </span>
                            <span className="text-gray-500 text-sm">· now</span>
                        </div>

                        {/* Tweet Text */}
                        <p
                            className={`text-[15px] leading-relaxed whitespace-pre-wrap wrap-break-words ${
                                displayText === "Your tweet will appear here..."
                                    ? "text-gray-500 italic"
                                    : isOverLimit
                                    ? "text-red-400"
                                    : "text-white"
                            }`}
                        >
                            {displayText}
                        </p>

                        {/* Engagement Stats */}
                        <div className="flex items-center justify-between mt-4 max-w-md">
                            <button className="flex items-center gap-2 text-gray-500 hover:text-blue-400 transition-colors group">
                                <div className="p-2 rounded-full group-hover:bg-blue-400/10 transition-colors">
                                    <MessageCircle className="h-4 w-4" />
                                </div>
                                <span className="text-xs">0</span>
                            </button>
                            <button className="flex items-center gap-2 text-gray-500 hover:text-green-400 transition-colors group">
                                <div className="p-2 rounded-full group-hover:bg-green-400/10 transition-colors">
                                    <Repeat2 className="h-4 w-4" />
                                </div>
                                <span className="text-xs">0</span>
                            </button>
                            <button className="flex items-center gap-2 text-gray-500 hover:text-pink-400 transition-colors group">
                                <div className="p-2 rounded-full group-hover:bg-pink-400/10 transition-colors">
                                    <Heart className="h-4 w-4" />
                                </div>
                                <span className="text-xs">0</span>
                            </button>
                            <button className="flex items-center gap-2 text-gray-500 hover:text-blue-400 transition-colors group">
                                <div className="p-2 rounded-full group-hover:bg-blue-400/10 transition-colors">
                                    <Share className="h-4 w-4" />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Facebook Preview Component
const FacebookPreview = ({ title, description, userName }) => {
    const displayTitle = title || "Post Title";
    const displayDescription =
        description || "Your post content will appear here...";
    const isEmpty = !title && !description;

    return (
        <div className="bg-white dark:bg-[#242526] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                <Facebook className="h-5 w-5 text-[#1877F2]" />
                <span className="text-gray-900 dark:text-white font-semibold text-sm">
                    Facebook Preview
                </span>
            </div>

            {/* Post Content */}
            <div className="p-4">
                {/* User Header */}
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0">
                        <span className="text-white font-bold text-sm">
                            {userName ? userName.charAt(0).toUpperCase() : "Y"}
                        </span>
                    </div>
                    <div>
                        <p className="text-gray-900 dark:text-white font-semibold text-sm">
                            {userName || "Your Page"}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <span>Just now</span>
                            <span>·</span>
                            <Globe className="h-3 w-3" />
                        </div>
                    </div>
                    <button className="ml-auto text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition-colors">
                        <MoreHorizontal className="h-5 w-5" />
                    </button>
                </div>

                {/* Post Text */}
                <div className="mb-3">
                    <h3
                        className={`font-semibold text-base mb-1 ${
                            isEmpty
                                ? "text-gray-400 dark:text-gray-500 italic"
                                : "text-gray-900 dark:text-white"
                        }`}
                    >
                        {displayTitle}
                    </h3>
                    <p
                        className={`text-[15px] leading-relaxed whitespace-pre-wrap wrap-break-words ${
                            isEmpty
                                ? "text-gray-400 dark:text-gray-500 italic"
                                : "text-gray-700 dark:text-gray-300"
                        }`}
                    >
                        {displayDescription}
                    </p>
                </div>

                {/* Engagement Stats Bar */}
                <div className="flex items-center justify-between py-2 border-t border-b border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                        <div className="flex -space-x-1">
                            <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                                <ThumbsUp className="h-2.5 w-2.5 text-white fill-white" />
                            </div>
                            <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                                <Heart className="h-2.5 w-2.5 text-white fill-white" />
                            </div>
                        </div>
                        <span>0</span>
                    </div>
                    <span>0 comments · 0 shares</span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-around pt-2">
                    <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors flex-1 justify-center">
                        <ThumbsUp className="h-5 w-5" />
                        <span className="font-medium text-sm">Like</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors flex-1 justify-center">
                        <MessageSquare className="h-5 w-5" />
                        <span className="font-medium text-sm">Comment</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors flex-1 justify-center">
                        <SendIcon className="h-5 w-5" />
                        <span className="font-medium text-sm">Share</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

// Website Preview Component
const WebsitePreview = ({ title, description, userName }) => {
    const displayTitle = title || "Post Title";
    const displayDescription =
        description || "Your post content will appear here...";
    const isEmpty = !title && !description;

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 shadow-sm">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700 flex items-center gap-2 bg-linear-to-r from-indigo-500/10 to-purple-500/10">
                <Globe className="h-5 w-5 text-indigo-500" />
                <span className="text-gray-900 dark:text-white font-semibold text-sm">
                    Website Preview
                </span>
            </div>

            {/* Post Content */}
            <div className="p-5">
                {/* Post Card Style */}
                <div className="border border-gray-100 dark:border-slate-700 rounded-lg p-4 bg-linear-to-br from-gray-50/50 to-white dark:from-slate-800/50 dark:to-slate-800">
                    <h2
                        className={`font-bold text-xl mb-3 ${
                            isEmpty
                                ? "text-gray-400 dark:text-gray-500 italic"
                                : "text-gray-900 dark:text-white"
                        }`}
                    >
                        {displayTitle}
                    </h2>
                    <p
                        className={`text-base leading-relaxed whitespace-pre-wrap wrap-break-words ${
                            isEmpty
                                ? "text-gray-400 dark:text-gray-500 italic"
                                : "text-gray-600 dark:text-gray-300"
                        }`}
                    >
                        {displayDescription}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                            <span className="text-white font-bold text-xs">
                                {userName
                                    ? userName.charAt(0).toUpperCase()
                                    : "Y"}
                            </span>
                        </div>
                        <div className="text-sm">
                            <p className="font-medium text-gray-900 dark:text-white">
                                {userName || "Your Name"}
                            </p>
                            <p className="text-gray-500 dark:text-gray-400 text-xs">
                                Just now
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main Post Preview Component with Tabs
export const PostPreview = ({
    title,
    description,
    selectedPlatforms = [],
    userName,
}) => {
    const [activeTab, setActiveTab] = useState("all");

    const tabs = [
        { id: "all", label: "All Previews", icon: null },
        {
            id: "twitter",
            label: "Twitter",
            icon: <Twitter className="h-4 w-4" />,
        },
        {
            id: "facebook",
            label: "Facebook",
            icon: <Facebook className="h-4 w-4" />,
        },
        {
            id: "website",
            label: "Website",
            icon: <Globe className="h-4 w-4" />,
        },
    ];

    const shouldShowPlatform = (platform) => {
        if (activeTab === "all") return selectedPlatforms.includes(platform);
        return activeTab === platform && selectedPlatforms.includes(platform);
    };

    const hasAnySelectedPlatform = selectedPlatforms.length > 0;

    return (
        <div className="space-y-4">
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 p-1 bg-gray-100 dark:bg-slate-800 rounded-lg">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            activeTab === tab.id
                                ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Preview Content */}
            {!hasAnySelectedPlatform ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-slate-700">
                    <Globe className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">No platforms selected</p>
                    <p className="text-sm">
                        Select at least one platform to see the preview
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Twitter Preview */}
                    {shouldShowPlatform("twitter") && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <TwitterPreview
                                title={title}
                                description={description}
                                userName={userName}
                            />
                        </div>
                    )}

                    {/* Facebook Preview */}
                    {shouldShowPlatform("facebook") && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <FacebookPreview
                                title={title}
                                description={description}
                                userName={userName}
                            />
                        </div>
                    )}

                    {/* Website Preview */}
                    {shouldShowPlatform("website") && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <WebsitePreview
                                title={title}
                                description={description}
                                userName={userName}
                            />
                        </div>
                    )}

                    {/* No matching platform message */}
                    {activeTab !== "all" &&
                        !selectedPlatforms.includes(activeTab) && (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                <p className="font-medium">
                                    Platform not selected
                                </p>
                                <p className="text-sm">
                                    Select this platform to see the preview
                                </p>
                            </div>
                        )}
                </div>
            )}
        </div>
    );
};

export { TwitterPreview, FacebookPreview, WebsitePreview };
