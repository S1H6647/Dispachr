import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
    Calendar,
    PencilIcon,
    SearchIcon,
    Trash2Icon,
    TwitterIcon,
    X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { Header } from "@/components/sidebar/Header";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { NoPost } from "@/components/ui/NoPost";
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
import toast from "react-hot-toast";

export function TwitterPosts() {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editDialog, setEditDialog] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [deletingPostId, setDeletingPostId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const [filteredPosts, setFilteredPosts] = useState([]);

    useEffect(() => {
        if (!debouncedSearchTerm.trim()) {
            setFilteredPosts(posts);
            return;
        }

        const lowercasedSearch = debouncedSearchTerm.toLowerCase();
        const filtered = posts.filter((post) =>
            post.text?.toLowerCase().includes(lowercasedSearch)
        );
        setFilteredPosts(filtered);
    }, [debouncedSearchTerm, posts]);

    useEffect(() => {
        const fetchAllPosts = async () => {
            try {
                setLoading(true);
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
            } finally {
                setLoading(false);
            }
        };
        fetchAllPosts();
    }, []);

    if (error) {
        return (
            <div className="min-h-screen flex flex-col w-full bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-900">
                <Header title="Twitter Posts" icon={<TwitterIcon />} />
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

            setIsUpdating(true);

            const response = await fetch(`/api/posts/twitter/${postId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    newTitle: editTitle,
                    newDescription: editDescription,
                }),
            });

            let data;
            try {
                const text = await response.text();
                data = text ? JSON.parse(text) : {};
            } catch (parseError) {
                // console.error("JSON parse error:", parseError);
                toast.error("Invalid response from server");
                return;
            }

            if (response.ok && data.status) {
                toast.success(data.message || "Tweet updated successfully");
                // Update the post in the state
                setPosts(
                    posts.map((p) =>
                        p.id === selectedPost.id
                            ? {
                                  ...p,
                                  text: `${editTitle}\n\n${editDescription}`,
                              }
                            : p
                    )
                );
                setEditDialog(false);
                setSelectedPost(null);
                setEditTitle("");
                setEditDescription("");
            } else {
                toast.error(data.message || "Failed to update tweet");
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error(error.message || "Something went wrong");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            setDeletingPostId(postId);
            const response = await fetch(`/api/posts/twitter/${postId}`, {
                method: "DELETE",
            });
            const data = await response.json();
            console.log(data);

            if (response.ok && data.status) {
                toast.success(data.message || "Tweet deleted successfully");
                // Remove the post from the list
                setPosts(posts.filter((p) => p.id !== postId));
            } else {
                toast.error(data.message || "Failed to delete tweet");
            }

            setDeletingPostId(null);
        } catch (error) {
            console.error(error);
            toast.error(
                error.message || "Something went wrong while deleting the tweet"
            );
            setDeletingPostId(null);
        }
    };

    return (
        <div className="min-h-screen flex flex-col w-full bg-linear-to-br from-slate-50 via-sky-50 to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
            {/* Header */}
            <Header title="Twitter Posts" icon={<TwitterIcon />} />

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
                            Edit Tweet
                        </DialogTitle>
                        <DialogDescription className="text-slate-600 dark:text-slate-400">
                            You can edit your tweet here.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Title:
                            </p>
                            <Input
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="text-sm dark:text-slate-200 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-800"
                            />
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Description:
                            </p>
                            <Input
                                value={editDescription}
                                onChange={(e) =>
                                    setEditDescription(e.target.value)
                                }
                                className="text-sm dark:text-slate-200 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-800 max-h-40 overflow-y-auto"
                            />
                        </div>
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
                        Fetching all tweets...
                    </p>
                </div>
            )}

            {/* Search Bar */}
            <div className="px-6 pt-4 max-w-7xl mx-auto w-full">
                <div className="relative group">
                    <div className="absolute inset-y-0 z-999 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sky-500 transition-colors">
                        <SearchIcon className="h-4 w-4" />
                    </div>

                    <Input
                        type="text"
                        placeholder="Search tweets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-11 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-sky-500/20 transition-all text-sm rounded-xl"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* No posts */}
            <NoPost posts={filteredPosts} loading={loading} />

            {!loading && posts.length > 0 && (
                <div className="flex-1 p-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                                {searchTerm.trim() ? (
                                    <>
                                        Found {filteredPosts.length}{" "}
                                        {filteredPosts.length === 1
                                            ? "result"
                                            : "results"}{" "}
                                        for "{searchTerm}"
                                    </>
                                ) : (
                                    <>
                                        Showing {posts.length}{" "}
                                        {posts.length === 1
                                            ? "tweet"
                                            : "tweets"}
                                    </>
                                )}
                            </p>
                        </div>
                        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {filteredPosts.map((post) => {
                                // Split text into title and description
                                const textParts = post.text
                                    ? post.text.split("\n\n")
                                    : ["", ""];
                                const title = textParts[0] || "";
                                const description =
                                    textParts.slice(1).join("\n\n") || "";
                                return (
                                    <Card
                                        key={post.id}
                                        className="group relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-card/90 backdrop-blur-sm shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:border-purple-300 dark:hover:border-purple-600"
                                    >
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between gap-2">
                                                <span className="line-clamp-2 text-lg font-semibold text-slate-800 dark:text-slate-100 flex-1">
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
                                                            const textParts =
                                                                post.text
                                                                    ? post.text.split(
                                                                          "\n\n"
                                                                      )
                                                                    : ["", ""];
                                                            setEditTitle(
                                                                textParts[0] ||
                                                                    ""
                                                            );
                                                            setEditDescription(
                                                                textParts
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
                                                                    Delete Tweet
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
                                                                    tweet from
                                                                    Twitter.
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
                                                    post.created_at
                                                ).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-3 pt-0 pb-4">
                                            <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-4 leading-relaxed">
                                                {description}
                                            </p>
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
