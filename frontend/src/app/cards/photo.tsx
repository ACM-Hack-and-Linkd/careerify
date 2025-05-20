import Image from "next/image";
import styles from "./cards.module.css";

export type PhotoProps = {
    imgUrl: string,
};

export default function Photo(props: PhotoProps) {
    return (
        <div className={styles.photo}>
            <div className={styles.shadow}></div>
            <Image
                src={props.imgUrl}
                alt="Placeholder image"
                fill
            ></Image>
            <div className={styles.shadow}></div>
        </div>
    )
}
