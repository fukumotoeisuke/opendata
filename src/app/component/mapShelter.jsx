'use client'; 
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const CircleMarker = dynamic(() => import('react-leaflet').then(mod => mod.CircleMarker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

export default function MapComponent() {
    const [locations, setLocations] = useState([]);
    const [mounted, setMounted] = useState(false);
    const [address, setAddress] = useState('');
    const mapRef = useRef(null);
    const [userCoords, setUserCoords] = useState(null);

    useEffect(() => {
        setMounted(true);
        const fetchData = async () => {
            try {
                const res = await fetch('/api/item/shelter'); 
                if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
                const jsonData = await res.json();

                const extractedLocations = jsonData.result.records.map(record => ({
                    name: record.名称,
                    lat: record.緯度,
                    lng: record.経度,
                    address: record.住所,
                    tel: record.電話番号,
                    url: record.URL,
                }));

                setLocations(extractedLocations);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchData();
    }, []);


    const getCoordinates = async (address) => {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
            const data = await res.json();
            if (data.length > 0) {
                const newCoords = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
                console.log("取得した座標:", newCoords); // デバッグ用
                setUserCoords(newCoords);
            }
        } catch (err) {
            console.error('住所の取得に失敗しました', err);
        }
    };

    
    const handleSearch = async () => {
        await getCoordinates(address);
    };

    useEffect(() => {
        if (userCoords && mapRef.current) {
            console.log("マップをズーム:", userCoords);
            mapRef.current.setView([userCoords.lat, userCoords.lng], 30); 
        }
    }, [userCoords]);

    if (!mounted) return <p>Loading map...</p>;

    return (
        <div>
            <MapContainer center={[34.85, 135.58]} zoom={13} style={{ height: '550px', width: '100%' }} ref={mapRef}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="© OpenStreetMap contributors"
                />
                {locations.map((loc, index) => (
                    <CircleMarker 
                        key={index} 
                        center={[loc.lat, loc.lng]} 
                        radius={7} 
                        color="darkslategray" 
                        fillColor="lightsteelblue" 
                        fillOpacity={0.6}
                        eventHandlers={{
                            mouseover: (e) => e.target.openPopup(),
                            mouseout: (e) => e.target.closePopup(),
                            click: () => window.open(loc.url, "_blank"),
                        }}
                    >
                        <Popup>
                            <strong>{loc.name}</strong><br />
                            住所: {loc.address},<br /> 電話番号: {loc.tel}<br />
                            クリックすると詳細ページに飛びます。
                        </Popup>
                    </CircleMarker>
                ))}
            </MapContainer>
            <div className='form'>
                <input 
                    type='text'
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder='住所を入力するとズームされます。'
                    className='inputForm'
                    required
                />
                <button className='inputButton' onClick={handleSearch}>検索</button>
            </div>
        </div>
    );
}