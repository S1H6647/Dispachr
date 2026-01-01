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

function getLast7Days() {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        days.push(d);
    }
    return days;
}

function formatDay(d) {
    return d.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
    });
}

export default function Dashboard() {
    const [posts, setPosts] = useState([]);
    const [weeklyCounts, setWeeklyCounts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch("/api/posts");
                if (!res.ok) throw new Error("Failed to fetch posts");
                const data = await res.json();
                // `data` shape from server: { data: posts, message }
                const all = data?.data || [];
                setPosts(all);

                // compute last 7 days counts
                const days = getLast7Days();
                const counts = days.map((day) => {
                    const start = new Date(day);
                    start.setHours(0, 0, 0, 0);
                    const end = new Date(day);
                    end.setHours(23, 59, 59, 999);

                    const count = all.filter((p) => {
                        const created = p.createdAt
                            ? new Date(p.createdAt)
                            : null;
                        return created && created >= start && created <= end;
                    }).length;

                    return { day: formatDay(day), count };
                });

                setWeeklyCounts(counts);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const totalThisWeek = weeklyCounts.reduce((s, d) => s + d.count, 0);

    return (
        <>
            <div className="w-full">
                <Header
                    title="Dashboard"
                    icon={<HouseIcon />}
                    isSubheader
                    isDashboard
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

                            <div className="p-4 border rounded">
                                <p className="font-bold text-2xl">Post Chart</p>
                                <p className="text-sm text-muted-foreground pb-3.5">
                                    Chart showing posts per day for last 7 days
                                </p>
                                <div className="mt-2">
                                    {/* Area chart showing posts per day for last 7 days */}
                                    <ChartContainer
                                        className="h-100 w-full"
                                        config={{
                                            posts: {
                                                label: "Posts",
                                                color: "var(--chart-1)",
                                            },
                                        }}
                                    >
                                        <AreaChart
                                            data={weeklyCounts.map((d) => ({
                                                day: d.day,
                                                posts: d.count,
                                            }))}
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
                                                    id="gradPosts"
                                                    x1="0"
                                                    y1="0"
                                                    x2="0"
                                                    y2="1"
                                                >
                                                    <stop
                                                        offset="5%"
                                                        stopColor="var(--color-posts)"
                                                        stopOpacity={0.8}
                                                    />
                                                    <stop
                                                        offset="95%"
                                                        stopColor="var(--color-posts)"
                                                        stopOpacity={0.1}
                                                    />
                                                </linearGradient>
                                            </defs>
                                            <Area
                                                type="monotone"
                                                dataKey="posts"
                                                stroke="var(--color-posts)"
                                                fill="url(#gradPosts)"
                                            />
                                        </AreaChart>
                                    </ChartContainer>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}
