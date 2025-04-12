
import Image from "next/image";
import LocationList from "./component/mapShelter"

export default function Home() {
  return (
    <div>
      <h1 className="title">高槻市 避難所マップ</h1>
      <LocationList />
      <footer>
        <p className="footerItem">Powered By </p>
        <Image src="/next.svg" width={80} height={80} alt="next-logo" />
        <p className="footerItem">Mapped By </p>
        <Image src="/leaflet.png" width={100} height={40} alt="leaflet-logo" />
      </footer>
      <p className="explain">マップには高槻市のオープンデータを使用しています。</p>
    </div>
  );
}
