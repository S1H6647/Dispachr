import { Header } from "@/components/sidebar/Header";
import { Skeleton } from "@/components/ui/skeleton";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { AreaChart, Area, CartesianGrid, XAxis } from "recharts";
import { HouseIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { ChartSkeleton } from "@/components/ui/chart-skeleton";

export default function Dashboard() {
    const [weeklyCounts, setWeeklyCounts] = useState([]);
    const [recentWebsitePosts, setRecentWebsitePosts] = useState([]);
    const [recentFacebookPosts, setRecentFacebookPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [postsLoading, setPostsLoading] = useState(true);

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const res = await fetch("/api/posts/chart");
                if (!res.ok) throw new Error("Failed to fetch chart data");
                const response = await res.json();

                // response.data contains array like: [{ day: "2026-01-06", website: 2, facebook: 1 }, ...]
                const chartData = response?.data || [];

                // Format the data for display
                const formattedData = chartData.map((item) => ({
                    day: new Date(item.day).toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                    }),
                    website: item.website,
                    facebook: item.facebook,
                }));

                setWeeklyCounts(formattedData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const fetchRecentPosts = async () => {
            try {
                // Fetch website posts
                const websiteRes = await fetch("/api/posts");
                if (websiteRes.ok) {
                    const websiteData = await websiteRes.json();
                    const posts = websiteData?.data || [];
                    // Get the 5 most recent posts
                    setRecentWebsitePosts(posts.slice(0, 3));
                }

                // Fetch Facebook posts
                const facebookRes = await fetch("/api/posts/facebook");
                if (facebookRes.ok) {
                    const facebookData = await facebookRes.json();
                    const posts = facebookData?.data || [];
                    // Get the 5 most recent posts
                    setRecentFacebookPosts(posts.slice(0, 3));
                }
            } catch (err) {
                console.error(err);
            } finally {
                setPostsLoading(false);
            }
        };

        fetchChartData();
        fetchRecentPosts();
    }, []);

    return (
        <>
            <div className="h-full flex flex-col w-full bg-linear-to-br from-slate-50 via-purple-50 to-slate-100">
                <Header
                    title="Dashboard"
                    icon={<HouseIcon />}
                    subHeader = "Welcome back. Here's your post overview."
                    profilePicture
                />

                <section className="mt-6 px-10">
                    <h3 className="text-lg font-semibold">Weekly activity</h3>

                    {loading ? (
                        <ChartSkeleton />
                    ) : (
                        // <div className="mt-4 grid grid-cols-1 md:grid-cols-1 gap-4">
                        <div className="pt-5">
                            {/* <div className="p-4 border rounded">
                                <p className="text-sm text-muted-foreground">
                                    Total posts this week
                                </p>
                                <p className="text-2xl font-bold">
                                    {totalThisWeek}
                                </p>
                            </div> */}

                            <div className="p-4 border rounded-lg bg-white">
                                <p className="font-bold text-2xl">
                                    Posts Chart
                                </p>
                                <p className="text-sm text-muted-foreground pb-3.5">
                                    Chart showing website and Facebook posts per
                                    day
                                </p>
                                <div className="mt-2">
                                    {/* Area chart showing posts per day for last 7 days */}
                                    <ChartContainer
                                        className="h-100 w-full"
                                        config={{
                                            website: {
                                                label: "Website Posts",
                                                color: "var(--chart-1)",
                                            },
                                            facebook: {
                                                label: "Facebook Posts",
                                                color: "var(--chart-2)",
                                            },
                                        }}
                                    >
                                        <AreaChart
                                            data={weeklyCounts}
                                            margin={{ left: 0, right: 0 }}
                                        >
                                            <CartesianGrid
                                                vertical={false}
                                                strokeDasharray="3 3"
                                            />
                                            <XAxis
                                                dataKey="day"
                                                tickLine={false}
                                                axisLine={false}
                                            />
                                            <ChartTooltip
                                                content={
                                                    <ChartTooltipContent />
                                                }
                                            />
                                            <defs>
                                                <linearGradient
                                                    id="gradWebsite"
                                                    x1="0"
                                                    y1="0"
                                                    x2="0"
                                                    y2="1"
                                                >
                                                    <stop
                                                        offset="5%"
                                                        stopColor="var(--color-website)"
                                                        stopOpacity={0.8}
                                                    />
                                                    <stop
                                                        offset="95%"
                                                        stopColor="var(--color-website)"
                                                        stopOpacity={0.1}
                                                    />
                                                </linearGradient>
                                                <linearGradient
                                                    id="gradFacebook"
                                                    x1="0"
                                                    y1="0"
                                                    x2="0"
                                                    y2="1"
                                                >
                                                    <stop
                                                        offset="5%"
                                                        stopColor="var(--color-facebook)"
                                                        stopOpacity={0.8}
                                                    />
                                                    <stop
                                                        offset="95%"
                                                        stopColor="var(--color-facebook)"
                                                        stopOpacity={0.1}
                                                    />
                                                </linearGradient>
                                            </defs>
                                            <Area
                                                type="monotone"
                                                dataKey="website"
                                                stroke="var(--color-website)"
                                                fill="url(#gradWebsite)"
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="facebook"
                                                stroke="var(--color-facebook)"
                                                fill="url(#gradFacebook)"
                                            />
                                        </AreaChart>
                                    </ChartContainer>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* Recent Posts Section */}
                <section className="mt-8 px-10 pb-10 ">
                    <h3 className="text-lg font-semibold mb-5">Recent Posts</h3>

                    {postsLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Skeleton className="h-64 w-full" />
                            <Skeleton className="h-64 w-full" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Website Posts */}
                            <div className="bg-white border rounded-lg p-5">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-3 h-3 rounded-full bg-chart-1"></div>
                                    <h4 className="font-bold text-xl">
                                        Website Posts
                                    </h4>
                                </div>

                                <div className="space-y-3">
                                    {recentWebsitePosts.length > 0 ? (
                                        recentWebsitePosts.map((post) => (
                                            <div
                                                key={post.id}
                                                className="p-3 border rounded-md hover:bg-slate-50 transition-colors"
                                            >
                                                <h5 className="font-semibold text-sm mb-1">
                                                    {post.title}
                                                </h5>
                                                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                                    {post.description}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(
                                                        post.createdAt
                                                    ).toLocaleDateString(
                                                        undefined,
                                                        {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        }
                                                    )}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground text-center py-8">
                                            No website posts yet
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Facebook Posts */}
                            <div className="bg-white border rounded-lg p-5">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-3 h-3 rounded-full bg-chart-2"></div>
                                    <h4 className="font-bold text-xl">
                                        Facebook Posts
                                    </h4>
                                </div>

                                <div className="space-y-3">
                                    {recentFacebookPosts.length > 0 ? (
                                        recentFacebookPosts.map((post) => (
                                            <div
                                                key={post.id}
                                                className="p-3 border rounded-md hover:bg-slate-50 transition-colors"
                                            >
                                                <h5 className="font-semibold text-sm mb-1">
                                                    {post.message.split(
                                                        "\n\n"
                                                    )[0] || ""}
                                                </h5>
                                                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                                    {post.message.split(
                                                        "\n\n"
                                                    )[1] || ""}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(
                                                        post.created_time
                                                    ).toLocaleDateString(
                                                        undefined,
                                                        {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        }
                                                    )}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground text-center py-8">
                                            No Facebook posts yet
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}
