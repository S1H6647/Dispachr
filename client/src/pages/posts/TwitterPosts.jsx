import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { GlobeIcon, Loader2, SearchIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { Header } from "@/components/sidebar/Header";
import { Link } from "react-router-dom";

export function TwitterPosts() {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const [filteredPosts, setFilteredPosts] = useState([]);

    useEffect(() => {
        if (!debouncedSearchTerm.trim()) {
            setFilteredPosts(posts);
            return;
        }

        const lowercasedSearch = debouncedSearchTerm.toLowerCase();
        const filtered = posts.filter(
            (post) =>
                post.title?.toLowerCase().includes(lowercasedSearch) ||
                post.description?.toLowerCase().includes(lowercasedSearch) ||
                post.text?.toLowerCase().includes(lowercasedSearch) // Twitter text field
        );
        setFilteredPosts(filtered);
    }, [debouncedSearchTerm, posts]);

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
                <Link to="/posts/" className="text-muted-foreground">
                    No posts yet. Create your first post!
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-900">
            {/* Header */}
            <Header title="Twitter Posts" icon={<GlobeIcon />} />

            {/* Search Bar */}
            <div className="px-6 pt-4 max-w-7xl mx-auto w-full">
                <div className="relative group">
                    <div className="absolute z-999 inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sky-500 transition-colors">
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

            <div className="max-w-7xl mx-auto px-6 py-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                    {searchTerm.trim() ? (
                        <>
                            Found {filteredPosts.length}{" "}
                            {filteredPosts.length === 1 ? "result" : "results"}{" "}
                            for "{searchTerm}"
                        </>
                    ) : (
                        <>
                            Showing {posts.length}{" "}
                            {posts.length === 1 ? "tweet" : "tweets"}
                        </>
                    )}
                </p>
            </div>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-6 max-w-7xl mx-auto">
                {filteredPosts.map((post) => (
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
