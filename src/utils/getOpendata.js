export default async function getOpendata(req,res) {
    try {
        const response = await fetch("https://data.bodik.jp/api/3/action/datastore_search?resource_id=53e3c191-36bf-4d19-9c58-7f498f28f8a3")
        const data = await response.json();
        res.json(data);
    } catch (e) {
        res.status(500).json({message: e.message});
    }
}

