import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
    Globe,
    Loader2,
    Calendar,
    MessageSquare,
    DeleteIcon,
    Trash2Icon,
    PencilIcon,
    FacebookIcon,
    Pencil,
    Trash2,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Header } from "@/components/sidebar/Header";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { NoPost } from "@/components/ui/NoPost";

export function FacebookPosts() {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editDialog, setEditDialog] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    useEffect(() => {
        const fetchAllPosts = async () => {
            try {
                setLoading(true);
                const response = await fetch("/api/posts/facebook");
                const data = await response.json();

                console.log(data);

                if (response.ok) {
                    setPosts(data.data || []);
                } else {
                    setError(data.message || "Failed to fetch posts");
                }
            } catch (err) {
                setError("Something went wrong");
            } finally {
                setLoading(false);
            }
        };
        fetchAllPosts();
    }, []);

    if (error) {
        return (
            <div className="min-h-screen flex flex-col w-full bg-linear-to-br from-slate-50 to-slate-100">
                <Header title="Facebook Posts" icon={<Globe />} />
                <div className="flex items-center justify-center flex-1">
                    <Card className="max-w-md border-red-200 bg-red-50">
                        <CardContent className="pt-6">
                            <p className="text-red-600 text-center">{error}</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col w-full bg-linear-to-br from-slate-50 via-blue-50 to-slate-100">
            {/* Header */}
            <Header title="Facebook Posts" icon={<FacebookIcon />} />

            {/* Edit Dialog */}
            <Dialog open={editDialog} onOpenChange={setEditDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">
                            Edit Post
                        </DialogTitle>
                        <DialogDescription className="text-slate-600">
                            You can edit your facebook post here.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-slate-700">
                                Title:
                            </p>
                            <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                                {selectedPost?.title}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-slate-700">
                                Description:
                            </p>
                            <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 max-h-40 overflow-y-auto">
                                {selectedPost?.description}
                            </p>
                        </div>
                        {selectedPost?.platforms &&
                            selectedPost.platforms.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-sm font-semibold text-slate-700">
                                        Platforms:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedPost.platforms.map(
                                            (platform) => (
                                                <span
                                                    key={platform}
                                                    className="text-xs font-medium bg-linear-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full capitalize"
                                                >
                                                    {platform}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                        </DialogClose>
                        <Button>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {loading && (
                <div className="flex items-center justify-center flex-1 flex-col gap-4 w-full">
                    <LoadingSpinner size="lg" />
                    <p className="text-slate-600 font-medium">
                        Fetching all posts...
                    </p>
                </div>
            )}

            {/* No posts */}
            <NoPost posts={posts} loading={loading} />

            {!loading && posts.length > 0 && (
                <div className="flex-1 p-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-6">
                            <p className="text-sm text-slate-600 mt-1">
                                {posts.length}{" "}
                                {posts.length === 1 ? "post" : "posts"} found
                            </p>
                        </div>

                        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {posts.map((post) => (
                                <Card
                                    key={post.id}
                                    className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:border-purple-300"
                                >
                                    <CardHeader className="space-y-3">
                                        <CardTitle className="line-clamp-2 text-lg leading-tight">
                                            {post.title}
                                        </CardTitle>
                                        <CardDescription className="flex items-center justify-between gap-2 text-xs">
                                            <div className="flex gap-2 min-h-9">
                                                <Calendar className="size-4.5" />
                                                {new Date(
                                                    post.created_time
                                                ).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </div>

                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 hover:bg-blue-100 hover:text-blue-600"
                                                    onClick={() => {
                                                        setSelectedPost(post);
                                                        setEditDialog(true);
                                                    }}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 hover:bg-red-100 hover:text-red-600"
                                                    // onClick={...} // Add delete logic here
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <p className="text-sm text-gray-900 line-clamp-4 leading-relaxed">
                                            {post.message}
                                        </p>
                                        {post.platforms &&
                                            post.platforms.length > 0 && (
                                                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                                                    {post.platforms.map(
                                                        (platform) => (
                                                            <span
                                                                key={platform}
                                                                className="text-xs font-medium bg-linear-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full capitalize shadow-sm"
                                                            >
                                                                {platform}
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
