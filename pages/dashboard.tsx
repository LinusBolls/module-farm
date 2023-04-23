import axios from "axios";
import { useQuery } from "react-query";

export default function Page() {

    const { data, isLoading, error } = useQuery(['user-me'], async () => {
        const res = await axios.get("/api/me")

        return res.data.data
    });
    if (isLoading) return "loading..."

    return <div className="bg-gray-900" style={{ height: "100vh", display: "flex" }}>

        <div className="flex flex-col">
            {/* {data.organizations.map(i => <div>{i.displayName}</div>)} */}



            <div className="flex flex-col border-gray-800 border" style={{
                width: "22.4rem",
                overflow: "hidden",
                borderRadius: "8px"
            }}>


                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",

                    height: "14rem",
                    width: "22.4rem",
                }}>
                    <img src="https://picsum.photos/200/300" style={{minWidth: "100%", minHeight: "100%"}}/>
                </div>
                <div style={{
                    display:"flex",
                    flexDirection:"column",

                    padding: "0.5rem",
                    paddingLeft: "1rem",
                    paddingRight: "1rem",

                    gap: "4px",
                }}>
                <h2 style={{ color: "white", fontWeight: "bold", fontSize: "13px" }}>Instagram A-B-Test to Notion</h2>
                <p style={{ color: "#999", fontWeight: 600, fontSize: "11px" }}>Publishing a set of ads and putting the metrics into a Notion database.</p>
                </div>
            </div>
            <button className="flex flex-col border-gray-800 border" style={{
                width: "22.4rem",
                overflow: "hidden",
                borderRadius: "8px",
                height: "12rem",

                alignItems: "center",
                justifyContent: "center",
            }}>
                <h2 style={{color: "white", fontWeight: "bold"}}>Create a new flow</h2>
            </button>
        </div>
    </div>
}