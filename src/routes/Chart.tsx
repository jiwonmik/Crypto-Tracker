import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { fetchCoinHistory } from "../api";
import ApexCharts from "react-apexcharts";

interface IHistoricalData {
    time_open: number;
    time_close: number;
    open: string
    high: string
    low: string
    close: string
    volume: string
    market_cap: number
}

interface CharProps {
    coinId: string;
}
function Chart({coinId}:CharProps) {
    const { isLoading, data } = useQuery<IHistoricalData[]>(["ohlcv", coinId], () => fetchCoinHistory(coinId));
    return (
        <div>
        {isLoading ? (
        "Loading chart..." 
        ) : (
            // @ts-ignore 
            <ApexCharts 
                type="line"
                series={[
                    {
                        name: "price",
                        data: data?.map((price) => parseFloat(price.close))??[]
                    },
                ]}
                options={{
                    theme:{
                        mode: "dark"
                    },
                    chart: {
                        height: 300,
                        width: 500,
                        toolbar: {
                            show: false
                        },
                        background: "transparent"
                    },
                    grid :{
                        show: false
                    },
                    stroke:{
                        curve: "smooth",
                        width: 5
                    },
                    yaxis:{
                        show:false
                    },
                    xaxis:{
                        labels:{
                            show:false
                        }
                    }
            }}
        />
    )}
    </div>
    );
}

export default Chart;

