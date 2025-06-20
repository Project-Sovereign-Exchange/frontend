"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react"; // Assuming 'motion/react' is the correct import
import { cn } from "@/lib/utils";


export const PinContainer = ({
                                 children,
                                 href,
                                 className,
                                 containerClassName,
                                 image,
                                 imageWidth,
                                 imageHeight,
                             }: {
    children: React.ReactNode;
    href?: string;
    className?: string;
    containerClassName?: string;
    image?: string;
    imageWidth?: number;
    imageHeight?: number;
}) => {
    const [transform, setTransform] = useState(
        "translate(-50%,-50%) rotateX(0deg)"
    );

    const onMouseEnter = () => {
        setTransform("translate(-50%,-50%) rotateX(40deg) scale(0.8)");
    };
    const onMouseLeave = () => {
        setTransform("translate(-50%,-50%) rotateX(0deg) scale(1)");
    };

    return (
        <a
            className={cn(
                "relative group/pin z-50  cursor-pointer",
                containerClassName
            )}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            href={href || "/"}
        >
            <div
                style={{
                    perspective: "1000px",
                    transform: "rotateX(70deg) translateZ(0deg)",
                }}
                className="absolute left-1/2 top-1/2 ml-[0.09375rem] mt-4 -translate-x-1/2 -translate-y-1/2"
            >
                <div
                    style={{
                        transform: transform,
                    }}
                    className="absolute left-1/2 top-1/2 flex justify-start items-start  rounded-2xl transition duration-700 overflow-hidden shadow-xl"
                >
                    <div className={cn(" relative z-50 ", className)}>{children}</div>
                </div>
            </div>
            <PinPerspective
                imageSrc={image}
                alt="Popup image preview"
                popupImageWidth={imageWidth}
                popupImageHeight={imageHeight}
            />
        </a>
    );
};

export const PinPerspective = ({
                                   imageSrc,
                                   alt,
                                   popupImageWidth,
                                   popupImageHeight,
                               }: {
    imageSrc?: string;
    alt?: string;
    popupImageWidth?: number;
    popupImageHeight?: number;
}) => {

    return (
        <motion.div className="pointer-events-none w-96 h-80 flex items-center justify-center opacity-0 group-hover/pin:opacity-100 z-[60] transition duration-500">
            <div className=" w-full h-full -mt-7 flex-none  inset-0">
                <div className="absolute top-0 inset-x-0 flex justify-center pt-2">
                    {imageSrc ? (
                        <Image
                            src={imageSrc}
                            alt={alt || "Preview image"}
                            width={popupImageWidth}
                            height={popupImageHeight}
                            className="relative z-20 object-contain rounded"
                        />
                    ) : (
                        <span className="relative z-20 text-white text-xs font-bold inline-block py-0.5 px-2 bg-black/50 rounded">
                             No Preview
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};