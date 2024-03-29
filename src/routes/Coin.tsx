import { Helmet } from "react-helmet";
import { Switch, Route, useLocation, useParams } from "react-router";
import { Link, useRouteMatch } from "react-router-dom";
import { useQuery } from "react-query";
import styled from "styled-components";

import Chart from "./Chart";
import Price from "./Price";
import { fetchCoinInfo, fetchCoinTickers } from "../api";

import Fab from '@mui/material/Fab';
import HomeIcon from '@mui/icons-material/Home';


const Container = styled.div`
    padding: 10px 20px;
    max-width: 480px;
    margin: 0 auto;
`;
const Header = styled.header`
    height: 15vh;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;
const Title = styled.h1`
    font-size: 48px;
    color: ${(props) => props.theme.accentColor}
`;
const Loader = styled.span`
    text-align: center;
    display: block;    
`;
const Overview = styled.div`
    display: flex;
    justify-content: space-between;
    background-color: rgb(0,0,0,0.5);
    padding: 10px 20px;
    border-radius: 10px;
`;
const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;  

  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;
const Description = styled.p`
    margin: 20px 0px;
`
const Tabs = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    margin: 25px 0px;
    gap: 10px;
`;

const Tab = styled.span<{ isActive: boolean }>`
    text-align: center;
    text-transform: uppercase;
    font-size: 12px;
    font-weight: 400;
    background-color: rgba(0,0,0,0.5);
    padding: 7px 0px;
    border-radius: 10px;
    color: ${(props) => props.isActive ? props.theme.accentColor : props.theme.textColor};
    a {
        display: block;
    }
`
const BackBtn = styled.span`
    width: 40px;
    height: 40px;
    display: flex;
    background-color: ${(props) => props.theme.bgColor};
    border: 1px solid ${(props) => props.theme.textColor};
    justify-content: center;
    align-items: center;
    font-size: 12px;
    font-weight: 400;
    padding: 13px 13px;
    border-radius: 13px;
    a {
        display: block;
    }
`
const BtnContainer = styled.div`
    width: 30%;
`

interface RouteParams {
    coinId: string;
}

interface RouteState {
    state: string;
    name: string;
}

interface IInfoData {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    is_new: boolean;
    is_active: boolean;
    type: string;
    logo: string;
    description: string;
    message: string;
    open_source: boolean;
    started_at: string;
    development_status: string;
    hardware_wallet: boolean;
    proof_type: string;
    org_structure: string;
    hash_algorithm: string;
    first_data_at: string;
    last_data_at: string;
}

interface IPriceData {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
    beta_value: number;
    first_data_at: string;
    last_updated: string;
    quotes: {
        USD: {
            ath_date: string;
            ath_price: number;
            market_cap: number;
            market_cap_change_24h: number;
            percent_change_1h: number;
            percent_change_1y: number;
            percent_change_6h: number;
            percent_change_7d: number;
            percent_change_12h: number;
            percent_change_15m: number;
            percent_change_24h: number;
            percent_change_30d: number;
            percent_change_30m: number;
            percent_from_price_ath: number;
            price: number;
            volume_24h: number;
            volume_24h_change_24h: number;
        }
    };
}

function Coin() {
    const { coinId } = useParams<RouteParams>();
    const { state } = useLocation<RouteState>();
    const priceMatch = useRouteMatch(`/${coinId}/price`);
    const chartMatch = useRouteMatch(`/${coinId}/chart`);
    const {isLoading: infoLoading, data: infoData } = useQuery<IInfoData>(
        ["info", coinId], 
        () => fetchCoinInfo(coinId),
        /* {
            refetchInterval: 5000,
        } */
    );
    const {isLoading: tickersLoading, data: tickersData } = useQuery<IPriceData>(
        ["tickers", coinId], 
        () => fetchCoinTickers(coinId));

    const loading = infoLoading || tickersLoading;

    console.log(tickersData)

    return (
        <Container>
        <Helmet>
            <title>
                {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
            </title>
        </Helmet>
            <Header>
                <BtnContainer>
                <Fab size="medium" color="secondary" aria-label="home" to="/" component={Link}>
                    <HomeIcon/>
                </Fab>
                </BtnContainer>
                <Title>
                    {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
                </Title>
                <BtnContainer></BtnContainer>
            </Header>
            {loading ? (
                <Loader>Loading...</Loader>
            ) : (
                <>
                    <Overview>
                        <OverviewItem>
                            <span>Rank:</span>
                            <span>{infoData?.rank}</span>
                        </OverviewItem>
                        <OverviewItem>
                            <span>Symbol:</span>
                            <span>{infoData?.symbol}</span>
                        </OverviewItem>
                        <OverviewItem>
                            <span>Price:</span>
                            <span>{tickersData?.quotes.USD.price.toFixed(3)}</span>
                        </OverviewItem>
                    </Overview>
                    <Description>{infoData?.description}</Description>
                    <Overview>
                        <OverviewItem>
                            <span>Total Supply:</span>
                            <span>{tickersData?.total_supply}</span>
                        </OverviewItem>
                        <OverviewItem>
                            <span>Max Supply:</span>
                            <span>{tickersData?.max_supply}</span>
                        </OverviewItem>
                    </Overview>
                    <Tabs>
                        <Tab isActive={chartMatch !== null}>
                            <Link to={`/${coinId}/chart`}>Chart</Link>
                        </Tab>
                        <Tab isActive={priceMatch !== null}>
                            <Link to={`/${coinId}/price`}>Price</Link>
                        </Tab>
                    </Tabs>
                    <Switch>
                        <Route path={`/:coinId/price`}>
                            <Price />
                        </Route>
                        <Route path={`/:coinId/chart`}>
                            <Chart coinId={coinId}/>
                        </Route>
                    </Switch>
                </>
            )}
        </Container>
    );
}

export default Coin