import { MouseEventHandler, useRef, useState } from "react";
import styles from "./cards.module.css";
import PageIndicator from "./page-indicator";
import Photo from "./photo";

export type CardProps = {
    name: string,
    imgUrls: string[],
    company: string,
    jobTitle: string,
    school: string,
    blurbs: string[],
};

export default function Card(props: CardProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const cardRef = useRef<HTMLDivElement>(null);

    const companyBlurb = `💼 ${props.jobTitle} @ ${props.company}`;
    const schoolBlurb = `🏫 ${props.school}`;

    const blurbs = [
        companyBlurb,
        schoolBlurb,
        ...props.blurbs,
    ];

    const numPages = blurbs.length;

    const handleClick: MouseEventHandler = event => {
        if (cardRef.current == null) {
            return;
        }

        const x = event.clientX;
        const bbox = cardRef.current.getBoundingClientRect();

        if ((x - bbox.x) / bbox.width > 0.5) {
            setCurrentPage(Math.min(currentPage + 1, numPages - 1));
        } else {
            setCurrentPage(Math.max(currentPage - 1, 0));
        }
    };

    return (
        <div className={styles.card} onClick={handleClick} ref={cardRef}>
            <PageIndicator numPages={numPages} currentPage={currentPage}></PageIndicator>
            <Photo imgUrl={props.imgUrls[currentPage]}></Photo>
            <div className={styles.textContainer}>
                <h1>{props.name}</h1>
                <p>{blurbs[currentPage]}</p>
            </div>
        </div>
    )
}
