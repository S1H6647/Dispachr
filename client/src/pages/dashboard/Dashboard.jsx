import { Button } from "@/components/ui/button";
import React from "react";

export default function Dashboard() {
    const handleCheck = async (e) => {
        const response = await fetch("/api/check");

        const resData = await response.json();
        console.log(resData);
    };
    return (
        <div>
            <button onClick={handleCheck}>Check</button>
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">destructive</Button>
            <Button variant="link">link</Button>
            <Button variant="outline">outline</Button>
        </div>
    );
}
