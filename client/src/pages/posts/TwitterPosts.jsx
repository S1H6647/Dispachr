import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { GlobeIcon, Loader2 } from "lucide-react";
import { Header } from "@/components/sidebar/Header";

export function TwitterPosts() {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllPosts = async () => {
            try {
                const response = await fetch("/api/posts/twitter");
                const data = await response.json();

                console.log(data);

                if (response.ok) {
                    setPosts(data.data || []);
                } else {
                    setError(data.message || "Failed to fetch posts");
                }
            } catch (err) {
                setError("Something went wrong");
            }
        };
        fetchAllPosts();
    }, []);

    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="flex items-center justify-center h-full w-full">
                <p className="text-muted-foreground">
                    No posts yet. Create your first post!
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-linear-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <Header title="All Web Posts" icon={<GlobeIcon />} />

            <div className="grid gap-10 grid-cols-6 p-6">
                {posts.map((post) => (
                    <Card
                        key={post.id}
                        className="hover:shadow-md transition-shadow"
                    >
                        <CardHeader>
                            <CardTitle className="line-clamp-2">
                                {post.title}
                            </CardTitle>
                            <CardDescription>
                                {new Date(post.publishedAt).toLocaleDateString(
                                    "en-US",
                                    {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    }
                                )}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground line-clamp-3">
                                {post.description}
                            </p>
                            {post.platforms && post.platforms.length > 0 && (
                                <div className="flex gap-2 mt-3">
                                    {post.platforms.map((platform) => (
                                        <span
                                            key={platform}
                                            className="text-xs bg-secondary px-2 py-1 rounded-full capitalize"
                                        >
                                            {platform}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
