import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {Input} from "@/components/ui/input";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";

export const Filters = () => {
    const games = [
        { id: 'game1', label: 'Game 1' },
        { id: 'game2', label: 'Game 2' },
        { id: 'game3', label: 'Game 3' },
        { id: 'game4', label: 'Game 4' },
        { id: 'game5', label: 'Game 5' },
        { id: 'game6', label: 'Game 6' },
        { id: 'game7', label: 'Game 7' },
        { id: 'game8', label: 'Game 8' },
        { id: 'game9', label: 'Game 9' },
        { id: 'game10', label: 'Game 10' },
    ];

    const sets = [
        { id: 'set1', label: 'Set 1' },
        { id: 'set2', label: 'Set 2' },
        { id: 'set3', label: 'Set 3' },
        { id: 'set4', label: 'Set 4' },
        { id: 'set5', label: 'Set 5' },
        { id: 'set6', label: 'Set 6' },
        { id: 'set7', label: 'Set 7' },
        { id: 'set8', label: 'Set 8' },
        { id: 'set9', label: 'Set 9' },
        { id: 'set10', label: 'Set 10' },
    ];

    const categories = [
        { id: 'cat1', label: 'Category 1' },
        { id: 'cat2', label: 'Category 2' },
        { id: 'cat3', label: 'Category 3' },
        { id: 'cat4', label: 'Category 4' },
        { id: 'cat5', label: 'Category 5' },
        { id: 'cat6', label: 'Category 6' },
        { id: 'cat7', label: 'Category 7' },
        { id: 'cat8', label: 'Category 8' },
        { id: 'cat9', label: 'Category 9' },
        { id: 'cat10', label: 'Category 10' },
    ];


    return (
        <div>
            <Accordion
                type="multiple"
                className="w-full px-8"
            >
                <AccordionItem value="item-1">
                    <AccordionTrigger>Game</AccordionTrigger>
                    <AccordionContent className="flex flex-col text-balance">
                        <Input placeholder="Search Game"/>

                        <ScrollArea className="h-48 w-full">
                            <div className="p-4">
                                {games.map(game => (
                                    <div key={game.id} className="flex items-center gap-2 my-3">
                                        <Checkbox id={game.id} />
                                        <Label htmlFor={game.id}>{game.label}</Label>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>Set</AccordionTrigger>
                    <AccordionContent className="flex flex-col text-balance">
                        <Input placeholder="Search Set"/>

                        <ScrollArea className="h-48 w-full">
                            <div className="p-4">
                                {sets.map(set => (
                                    <div key={set.id} className="flex items-center gap-2 my-3">
                                        <Checkbox id={set.id} />
                                        <Label htmlFor={set.id}>{set.label}</Label>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger>Category</AccordionTrigger>
                    <AccordionContent className="flex flex-col text-balance">
                        <Input placeholder="Search Category"/>

                        <ScrollArea className="h-48 w-full">
                            <div className="p-4">
                                {categories.map(category => (
                                    <div key={category.id} className="flex items-center gap-2 my-3">
                                        <Checkbox id={category.id} />
                                        <Label htmlFor={category.id}>{category.label}</Label>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}