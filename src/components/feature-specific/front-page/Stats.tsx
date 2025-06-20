import CountUp from "@/components/feature-specific/front-page/CountUp";

export const Stats = () => {
    return (
        <div>
            <div className="flex flex-row items-center justify-center p-6 md:p-10">
                <div className="flex flex-col items-center justify-center p-6 md:p-10">
                    <h2 className="text-2xl font-bold mb-4">Site Statistics</h2>
                    <CountUp to={1000}/>
                </div>
                <div className="flex flex-col items-center justify-center p-6 md:p-10">
                    <h2 className="text-2xl font-bold mb-4">Site Statistics</h2>
                    <CountUp to={1000}/>
                </div>
                <div className="flex flex-col items-center justify-center p-6 md:p-10">
                    <h2 className="text-2xl font-bold mb-4">Site Statistics</h2>
                    <CountUp to={1000}/>
                </div>
            </div>
        </div>
    )
}