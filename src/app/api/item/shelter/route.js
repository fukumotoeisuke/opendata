export async function GET() {
    try {
        const response = await fetch('https://data.bodik.jp/api/3/action/datastore_search?resource_id=991d916c-29fe-45a0-8ed6-847df5a4100c');
        
        if(!response.ok) {
            throw new Error("接続に失敗しました。");
        }
        const data = await response.json();
        return Response.json(data,{status:200});
    } catch (error) {
        return Response.json({message: error.message },{status:200});
    }
}