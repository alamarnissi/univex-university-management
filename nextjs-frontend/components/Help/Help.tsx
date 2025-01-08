import styles from "@/lib/styles"
import CardSection from "./CardSection/CardSection"
import { HelpData } from "@/lib/data"

const Help = ({ t }: { t: any }) => {

  return (
    <div id="help" className={`${styles.padding} ${styles.flexStart} relative`}>
      <div className={`${styles.boxWidth}`}>
        <h2 className={`${styles.heading2} text-center mb-12`}>{t("HelpSection.heading")}</h2>
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-center justify-center`}>
          {HelpData && HelpData.map((card) => (
            <CardSection
              key={card.id}
              image={card.image}
              title={t(card.title)}
              list={[t(card.list[0]), t(card.list[1])]}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Help