"use client"

import * as React from "react"
import {Slider} from "@/components/ui/slider";
import {
    DropdownMenu, DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {DropdownMenuCheckboxItemProps} from "@radix-ui/react-dropdown-menu";

type Checked = DropdownMenuCheckboxItemProps["checked"]


export function ListingsFilter() {
    const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true)
    const [showActivityBar, setShowActivityBar] = React.useState<Checked>(false)
    const [showPanel, setShowPanel] = React.useState<Checked>(false)

    return (
        <div className="flex flex-col items-center w-full h-full mb-4 space-y-4">
            <div>
                <h1 className="text-2xl font-bold mb-4">Filters</h1>
            </div>
            <div className="flex flex-col items-start w-full max-w-sm space-y-8">
            <div className="">
                <h1 className="text-muted-foreground">Language</h1>
                <DropdownMenu>
                    <DropdownMenuTrigger className="w-full">
                        <Button className="w-full px-4 py-2 text-left border rounded-md shadow-sm">
                            Languages
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                        <DropdownMenuLabel>Select Language(s)</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuCheckboxItem
                            checked={showStatusBar}
                            onCheckedChange={setShowStatusBar}
                        >
                            Status Bar
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={showActivityBar}
                            onCheckedChange={setShowActivityBar}
                            disabled
                        >
                            Activity Bar
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={showPanel}
                            onCheckedChange={setShowPanel}
                        >
                            Panel
                        </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div>
                <h1 className="text-muted-foreground">Condition</h1>
                <DropdownMenu>
                    <DropdownMenuTrigger className="w-full">
                        <Button className="w-full px-4 py-2 text-left border rounded-md shadow-sm">
                            Languages
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                        <DropdownMenuLabel>Select Language(s)</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuCheckboxItem
                            checked={showStatusBar}
                            onCheckedChange={setShowStatusBar}
                        >
                            Status Bar
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={showActivityBar}
                            onCheckedChange={setShowActivityBar}
                            disabled
                        >
                            Activity Bar
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={showPanel}
                            onCheckedChange={setShowPanel}
                        >
                            Panel
                        </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div>
                <h1 className="text-muted-foreground">Price</h1>
                <p> Value </p>
                <Slider className="w-full"></Slider>
            </div>
            <div>
                <h1 className="text-muted-foreground">Seller Rating</h1>
                <DropdownMenu>
                    <DropdownMenuTrigger className="w-full">
                        <Button className="w-full px-4 py-2 text-left border rounded-md shadow-sm">
                            Languages
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                        <DropdownMenuLabel>Select Language(s)</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuCheckboxItem
                            checked={showStatusBar}
                            onCheckedChange={setShowStatusBar}
                        >
                            Status Bar
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={showActivityBar}
                            onCheckedChange={setShowActivityBar}
                            disabled
                        >
                            Activity Bar
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={showPanel}
                            onCheckedChange={setShowPanel}
                        >
                            Panel
                        </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div>
                <h1 className="text-muted-foreground">Delivery time</h1>
                <DropdownMenu>
                    <DropdownMenuTrigger className="w-full">
                        <Button className="w-full px-4 py-2 text-left border rounded-md shadow-sm">
                            Languages
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                        <DropdownMenuLabel>Select Language(s)</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuCheckboxItem
                            checked={showStatusBar}
                            onCheckedChange={setShowStatusBar}
                        >
                            Status Bar
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={showActivityBar}
                            onCheckedChange={setShowActivityBar}
                            disabled
                        >
                            Activity Bar
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={showPanel}
                            onCheckedChange={setShowPanel}
                        >
                            Panel
                        </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            </div>
        </div>
    )
}
