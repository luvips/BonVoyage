import { Data } from "../page";
import React from "react";
import sliderCard from "@/data/sliderCard";

type Props = {
    data: Data[];
};

function Slides({ data }: Props) {
    return (
        <div className=" flex w-full gap-6">
            {data.map((data) => {
                return <SliderCard key={data.img} data={data} />;
            })}
        </div>
    );
}

export default Slides;

          