import React from "react";
import { Search, Ticket, Mail } from "lucide-react";
import feature1 from "../assets/feature_1.png";
import feature2 from "../assets/feature_2.png";
import feature3 from "../assets/feature_3.png";
import UpComing from "./UpComing";

const Working = () => {
    const steps = [
        {
            icon: feature1,
            title: "Choose What To Do",
            desc: "Easily find your event via search system with multiple parameters.",
        },
        {
            icon: feature2,
            title: "Booking event that you like",
            desc: "Choose your ticket and add it to the cart. Secure payment supported.",
        },
        {
            icon: feature3,
            title: "Get the ticket to attend",
            desc: "After successful booking, you will receive tickets via email or download.",
        },
    ];

    return (
        <div className="py-6 px-2 md:px-5  space-y-10 h-screen">
            <div>
                <UpComing title="How It Works"
                    subtitle="Simple steps to book and attend your favorite events" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20">
                {steps.map((step, index) => (
                    <div
                        key={index}
                        className="p-6 bg-white  transition"
                    >
                        <div className="mb-4 h-40 w-40 flex items-center justify-center mx-auto rounded-full hover:shadow-md transition bg-red-50">
                            <img src={step.icon} alt={step.title} className="w-16 h-16 mx-auto" />
                        </div>


                        <div className="flex flex-col items-center text-center px-3">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {step.title}
                            </h3>

                            <p className="text-gray-500 text-sm leading-relaxed font-medium">
                                {step.desc}
                            </p>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default Working;
