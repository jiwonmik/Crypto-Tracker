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
    const { isLoading, data } = useQuery<IHistoricalData[]>(
        ["ohlcv", coinId], 
        () => fetchCoinHistory(coinId));
    return (
        <div>
        {isLoading ? (
        "Loading chart..." 
        ) : (
            // @ts-ignore 
            <ApexCharts 
                type="candlestick"
                series={[
                    {
                        data: data?.map((price)=>[
                            price.time_close*1000,
                            Number(price.open),
                            Number(price.high)??[],
                            Number(price.low)??[],
                            Number(price.close)??[]
                        ])??[],
                    }
                ]}
                options={{
                    chart:{
                        height: 500,
                        width: 500,
                        toolbar :{
                            show:false
                        }
                    },
                    yaxis:{
                        show: false
                    },
                    xaxis:{
                        categories: data?.map((price)=>
                        new Date(price.time_close*1000).toUTCString()),
                        type:"datetime",
                        labels:{
                            style:{
                                colors: "#fff"
                            }
                        }
                    }
                }}
        />
    )}
    </div>
    );
}

export default Chart;

