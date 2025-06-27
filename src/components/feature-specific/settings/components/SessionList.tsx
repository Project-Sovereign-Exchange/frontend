import {ScrollArea} from "@/components/ui/scroll-area";
import {Button} from "@/components/ui/button";


export const SessionList = () => {
    const sessions = [
        { id: 'session1', device: 'Web Browser - Chrome', status: 'Active' },
        { id: 'session2', device: 'Mobile App - iOS', status: 'Active' },
        { id: 'session3', device: 'Web Browser - Firefox', status: 'Inactive' },
    ];

    return(
        <ScrollArea className="h-32 w-full">
            <div className="w-full flex flex-col space-y-4">
                {sessions.map((session) => (
                    <div key={session.id} className="flex justify-between items-center p-4 border-b last:border-0">
                        <div className="flex flex-col">
                            <span className="font-semibold">{session.device}</span>
                            <span className="text-sm text-muted-foreground">{session.status}</span>
                        </div>
                        <Button variant="outline" className="text-red-500 hover:text-red-700">Log Out</Button>
                    </div>
                ))}
            </div>
        </ScrollArea>
    )
}