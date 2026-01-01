import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
    Globe,
    Calendar,
    Trash2Icon,
    PencilIcon,
    FacebookIcon,
} from "lucide-react";
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
import toast, { Toaster } from "react-hot-toast";
import { Input } from "@/components/ui/input";

export function FacebookPosts() {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editDialog, setEditDialog] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [deletingPostId, setDeletingPostId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

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

    const handleSaveEdit = async (postId) => {
        try {
            if (!editTitle || !editDescription) {
                toast.error("Both title and description are required");
                return;
            }

            if (!selectedPost) {
                toast.error("No post selected");
                return;
            }

            setIsUpdating(true); // Set to true at the start

            const response = await fetch(`/api/posts/facebook/${postId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    newTitle: editTitle,
                    newDescription: editDescription,
                }),
            });

            // Handle response parsing safely
            let data;
            try {
                const text = await response.text();
                data = text ? JSON.parse(text) : {};
            } catch (parseError) {
                console.error("JSON parse error:", parseError);
                toast.error("Invalid response from server");
                return;
            }

            if (response.ok && data.status) {
                toast.success(data.message || "Post updated successfully");
                // Update the post in the state
                setPosts(
                    posts.map((p) =>
                        p.id === selectedPost.id
                            ? {
                                  ...p,
                                  message: `${editTitle}\n\n${editDescription}`,
                              }
                            : p
                    )
                );
                setEditDialog(false);
                setSelectedPost(null);
                setEditTitle("");
                setEditDescription("");
            } else {
                toast.error(data.message || "Failed to update post");
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error(error.message || "Something went wrong");
        } finally {
            setIsUpdating(false); // Always set to false when done
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            setDeletingPostId(postId);
            const response = await fetch(`/api/posts/facebook/${postId}`, {
                method: "DELETE",
            });
            const data = await response.json();
            console.log(data);

            // Send Toast on Delete
            if (response.ok && data.status) {
                toast.success(data.message || "Post deleted successfully");
                // Remove the post from the list
                setPosts(posts.filter((p) => p.id !== postId));
            } else {
                toast.error(data.message || "Failed to delete post");
            }

            // Close the dialog
            setDeletingPostId(null);
        } catch (error) {
            console.error(error);
            toast.error(
                error.message || "Something went wrong while deleting the post"
            );
            setDeletingPostId(null);
        }
    };

    return (
        <div className="min-h-screen flex flex-col w-full bg-linear-to-br from-slate-50 via-blue-50 to-slate-100">
            {/* Header */}
            <Header title="Facebook Posts" icon={<FacebookIcon />} />
            <Toaster />

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
                            You can edit your facebook post here.
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
                            onClick={() => handleSaveEdit(selectedPost.id)}
                            disabled={isUpdating || !selectedPost}
                            className="cursor-pointer"
                        >
                            {isUpdating ? "Updating..." : "Save Changes"}
                        </Button>
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
                            {posts.map((post) => {
                                const messageParts = post.message
                                    ? post.message.split("\n\n")
                                    : ["", ""];
                                const title = messageParts[0] || "";
                                const description =
                                    messageParts.slice(1).join("\n\n") || "";
                                return (
                                    <Card
                                        key={post.id}
                                        className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:border-purple-300"
                                    >
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between gap-2">
                                                <span className="line-clamp-2 text-lg font-semibold text-slate-800 flex-1">
                                                    {title}
                                                </span>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 hover:bg-blue-100 hover:text-blue-600"
                                                        onClick={() => {
                                                            setSelectedPost(
                                                                post
                                                            );
                                                            const messageParts =
                                                                post.message
                                                                    ? post.message.split(
                                                                          "\n\n"
                                                                      )
                                                                    : ["", ""];
                                                            setEditTitle(
                                                                messageParts[0] ||
                                                                    ""
                                                            );
                                                            setEditDescription(
                                                                messageParts
                                                                    .slice(1)
                                                                    .join(
                                                                        "\n\n"
                                                                    ) || ""
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
                                                            setDeletingPostId(
                                                                null
                                                            )
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
                                                                    absolutely
                                                                    sure? This
                                                                    action
                                                                    cannot be
                                                                    undone. This
                                                                    will
                                                                    permanently
                                                                    delete this
                                                                    post from
                                                                    our servers.
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
                                            <CardDescription className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                                                <Calendar className="size-4.5 text-purple-500" />
                                                {new Date(
                                                    post.created_time
                                                ).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-3 pt-0 pb-4">
                                            <p className="text-sm text-slate-600 line-clamp-4 leading-relaxed">
                                                {description}
                                            </p>
                                            {post.platforms &&
                                                post.platforms.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100">
                                                        {post.platforms.map(
                                                            (platform) => (
                                                                <span
                                                                    key={
                                                                        platform
                                                                    }
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
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
