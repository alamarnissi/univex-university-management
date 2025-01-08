
import styles from "@/lib/styles"
import FeatureBox from "./FeatureBox/FeatureBox"
import { FeaturesData } from "@/lib/data"


const Features = ({ t }: { t: any }) => {

    return (
        <div id="features" className={`${styles.padding} ${styles.flexStart} relative bg-primary border-t-[128px] border-[#F9F9F9]`}>
            <div className={`${styles.boxWidth}`}>
                <div className={`${styles.gridFour} gap-8 lg:gap-5`}>
                    {FeaturesData && FeaturesData.map(el => (
                        <FeatureBox
                            key={el.id}
                            image={el.image}
                            imgSize={el.imgSize}
                            title={t(el.title)}
                            text={t(el.text)}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Features