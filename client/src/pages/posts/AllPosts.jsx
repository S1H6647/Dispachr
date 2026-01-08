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
    Calendar,
    MessageSquare,
    Pencil,
    Trash2,
    PencilIcon,
    Trash2Icon,
} from "lucide-react";
import { Header } from "@/components/sidebar/Header";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { NoPost } from "@/components/ui/NoPost";
import toast, { Toaster } from "react-hot-toast";
import { Input } from "@/components/ui/input";

export function AllPosts() {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editDialog, setEditDialog] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [deletingPostId, setDeletingPostId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");

    useEffect(() => {
        const fetchAllPosts = async () => {
            try {
                setLoading(true);
                const response = await fetch("/api/posts/");
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
            <div className="min-h-screen flex flex-col w-full bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-900">
                <Header title="All Web Posts" icon={<Globe />} />
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

    const handleDeletePost = async (id) => {
        try {
            setDeletingPostId(id);
            const response = await fetch(`/api/posts/${id}`, {
                method: "DELETE",
            });
            const data = await response.json();
            if (data.status) {
                toast.success(data.message);
                const filteredPosts = posts.filter((p) => p.id !== id);
                setPosts(filteredPosts);
            } else {
                toast.error(error.message);
            }
            setDeletingPostId(null);
        } catch (error) {
            setDeletingPostId(null);
            console.log(error);
        }
    };

    const handleSaveEdit = async () => {
        try {
            const response = await fetch(`/api/posts/${selectedPost.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: editTitle,
                    description: editDescription,
                }),
            });
            const data = await response.json();
            if (data.status) {
                toast.success(data.message);
                setPosts(
                    posts.map((p) =>
                        p.id === selectedPost.id
                            ? {
                                  ...p,
                                  title: editTitle,
                                  description: editDescription,
                              }
                            : p
                    )
                );
                setEditDialog(false);
                setSelectedPost(null);
                setEditTitle("");
                setEditDescription("");
            } else {
                toast.error("Failed to update post");
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="min-h-screen flex flex-col w-full bg-linear-to-br from-slate-50 via-purple-50 to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
            {/* Header */}
            <Header title="All Web Posts" icon={<Globe />} />

            {/* Edit Dialog */}
            <Dialog
                open={editDialog}
                onOpenChange={(open) => {
                    setEditDialog(open);
                    if (!open) {
                        setSelectedPost(null);
                        setEditTitle("");
                        setEditDescription("");
                    }
                }}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">
                            Edit Post
                        </DialogTitle>
                        <DialogDescription className="text-slate-600">
                            You can edit your website post here.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-slate-700">
                                Title:
                            </p>
                            <Input
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200"
                            />
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-slate-700">
                                Description:
                            </p>
                            <Input
                                value={editDescription}
                                onChange={(e) =>
                                    setEditDescription(e.target.value)
                                }
                                className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 max-h-40 overflow-y-auto"
                            />
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
                            <Button
                                variant="outline"
                                className="cursor-pointer"
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            onClick={handleSaveEdit}
                            className="cursor-pointer"
                        >
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {loading && (
                <div className="flex items-center justify-center flex-1 flex-col gap-4 w-full">
                    <LoadingSpinner size="lg" />
                    <p className="text-slate-600 font-medium">
                        Loading posts...
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
                                    className="group relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-card/90 backdrop-blur-sm shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:border-purple-300 dark:hover:border-purple-600"
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <span className="line-clamp-2 text-lg font-semibold text-slate-800 dark:text-slate-100 flex-1">
                                                {post.title}
                                            </span>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 hover:bg-blue-100 hover:text-blue-600"
                                                    onClick={() => {
                                                        setSelectedPost(post);
                                                        setEditTitle(
                                                            post.title
                                                        );
                                                        setEditDescription(
                                                            post.description
                                                        );
                                                        setEditDialog(true);
                                                    }}
                                                >
                                                    <PencilIcon className="h-4 w-4" />
                                                </Button>
                                                <Dialog
                                                    open={
                                                        deletingPostId ===
                                                        post.id
                                                    }
                                                    onOpenChange={(open) =>
                                                        !open &&
                                                        setDeletingPostId(null)
                                                    }
                                                >
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 hover:bg-red-100 hover:text-red-600"
                                                            onClick={() =>
                                                                setDeletingPostId(
                                                                    post.id
                                                                )
                                                            }
                                                        >
                                                            <Trash2Icon className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-md">
                                                        <DialogHeader>
                                                            <DialogTitle className="text-xl font-semibold">
                                                                Delete Post
                                                            </DialogTitle>
                                                            <DialogDescription>
                                                                Are you
                                                                absolutely sure?
                                                                This action
                                                                cannot be
                                                                undone. This
                                                                will permanently
                                                                delete this post
                                                                from our
                                                                servers.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <DialogFooter>
                                                            <DialogClose
                                                                asChild
                                                            >
                                                                <Button
                                                                    variant="outline"
                                                                    className="cursor-pointer"
                                                                >
                                                                    No
                                                                </Button>
                                                            </DialogClose>
                                                            <Button
                                                                onClick={() =>
                                                                    handleDeletePost(
                                                                        post.id
                                                                    )
                                                                }
                                                                className="cursor-pointer"
                                                            >
                                                                Yes
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </div>
                                        <CardDescription className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-2">
                                            <Calendar className="size-4.5 text-purple-500" />
                                            {new Date(
                                                post.publishedAt
                                            ).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3 pt-0 pb-4">
                                        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-4 leading-relaxed">
                                            {post.description}
                                        </p>
                                        {post.platforms &&
                                            post.platforms.length > 0 && (
                                                <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                                                    {post.platforms.map(
                                                        (platform) => (
                                                            <span
                                                                key={platform}
                                                                className="text-xs font-medium bg-linear-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full capitalize shadow-sm"
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
