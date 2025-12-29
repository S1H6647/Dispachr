import { MessageSquare } from "lucide-react";

export function NoPost({ posts, loading }) {
    return (
        <>
            {posts.length === 0 && !loading && (
                <div className="flex items-center justify-center flex-1 w-full">
                    <div className="max-w-md">
                        <div className="pt-6 text-center">
                            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                            <p className="text-slate-600 font-medium mb-2">
                                No posts yet
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Create your first post to get started!
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
