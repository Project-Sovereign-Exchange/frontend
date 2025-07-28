"use client";

import { useState } from "react";
import {Info, Barcode, Tickets, User} from "lucide-react";
import {ProductManager} from "@/components/feature-specific/admin/dashboard/product/ProductManager";

const menu = [
    { label: "Dashboard", icon: Info, component: () => <div>Dashboard</div>},
    { label: "Products", icon: Barcode, component: ProductManager },
    { label: "Users", icon: User, component: () => <div>User Manager</div> },
    { label: "Tickets", icon: Tickets, component: () => <div>Tickets</div> },
];

export default function ProfileSettings() {
    const [selected, setSelected] = useState("Dashboard");

    const selectedMenu = menu.find(item => item.label === selected);
    const SelectedComponent = selectedMenu?.component;

    return (
        <div className="w-full h-screen pt-50">
            <div className="w-full h-full flex flex-row justify-center p-6 md:p-10">
                <div className="flex flex-col items-center w-1/5 px-4 gap-4">
                    {menu.map(({ label, icon: Icon }) => (
                        <div
                            key={label}
                            className={`flex flex-row items-center w-full rounded-lg p-2 cursor-pointer gap-2
                ${selected === label ? "bg-primary text-primary-foreground" : "hover:bg-accent"}
              `}
                            onClick={() => setSelected(label)}
                        >
                            <div
                                className={`bg-card text-secondary-foreground outline-1 outline-border shadow-lg rounded-lg p-1
                                `}
                            >
                                <Icon />
                            </div>
                            <h1>{label}</h1>
                        </div>
                    ))}
                </div>
                <div className="bg-card w-4/5 h-full outline-1 outline-border shadow-lg rounded-lg">
                    {SelectedComponent ? <SelectedComponent /> : null}
                </div>
            </div>
        </div>
    );
}