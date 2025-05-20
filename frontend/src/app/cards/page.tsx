"use client";

import Card from "./card";
import styles from "./cards.module.css";

const mockImgUrls = Array(3).fill(0).map((_, i) => `https://picsum.photos/seed/${i + 1}/400/600`);

const mockBlurbs = [
    "What could go wrong?",
];

export default function Page() {
    return (
        <div className={styles.page}>
            <Card
                imgUrls={mockImgUrls}
                name="Jason"
                company="Bruin Plate"
                jobTitle="Student Worker"
                school="University of California, Los Angeles"
                blurbs={mockBlurbs}
            ></Card>
        </div>
    )
};
