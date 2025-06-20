'use client';


import { Badge } from "@/components/ui/badge";

// For the 'X' icon, you can use an SVG, an icon library like lucide-react,
// or a simple HTML entity like '&times;'.
// If using lucide-react, you would uncomment the next line:
// import { X } from "lucide-react";

export function BadgeWithDismiss() {
    const handleDismiss = (event: React.MouseEvent) => {
        // Prevent any default behavior if the button were, for example, inside a form
        event.preventDefault();

        // Replace this with your actual dismiss logic
        // e.g., call a callback prop, update state to hide the badge
        alert("Dismiss action triggered!");
        console.log("Badge dismiss clicked");
    };

    return (
        <Badge
            // The Badge component itself is the container.
            // We'll use className to ensure it behaves like a flex container
            // to position the link text and the button.
            // Most shadcn/ui components accept a className prop.
            variant="secondary"
            className="inline-flex items-center py-1 px-2.5" // Adjust padding as needed, default badge padding might be fine
        >
            <span>
                Test
            </span>

            <button
                type="button"
                onClick={handleDismiss}
                aria-label="Dismiss badge"
                // Style the button to be minimal and blend with the badge
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'inherit', // Inherit text color from the Badge
                    cursor: 'pointer',
                    padding: '0', // Minimal padding
                    marginLeft: '0.25rem', // Space from text if mr-2 on Link is not enough
                    lineHeight: '1', // Helps vertically align the '×'
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                {/* Option 1: Using an icon from a library (e.g., lucide-react) */}
                {/* Make sure to install lucide-react: npm install lucide-react */}
                {/* <X size={14} /> */}

                {/* Option 2: Using an HTML entity for '×' (multiplication sign) */}
                <span style={{ fontSize: '1.2em' }}>&times;</span>
            </button>
        </Badge>
    );
}