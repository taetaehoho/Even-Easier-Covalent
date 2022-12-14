import Dropdown from "./Dropdown";
import React, { useState, useEffect } from "react"
import ReactJson from 'react-json-view'
import "./styles.css";

export default function App() {
  const [chainId, setChainId] = useState("")
  const [endpoint, setEndpoint] = useState("")
  const [broadEndpoint, setBroadEndpoint] = useState("")
  const [apikey, setApiKey] = useState("")
  const [address, setAddress] = useState("")
  const [jsonResponse, setJsonResponse] = useState("")
  const [tokenId, setTokenId] = useState("")

  const chainIds = [
    { value: "1", label: "1: Mainnet" },
    { value: "137", label: "137: Polygon" },
    { value: "43114", label: "43114: Avax C" },
    { value: "56", label: "56: BSC Mainnet" },
    { value: "250", label: "250: Phantom Mainnet" },
    { value: "2020", label: "2020: Ronin" },
    { value: "42161", label: "42161: Arbitrum" },
    { value: "288", label: "288: Boba!" }
  ];

  const broadendpoints = [
    {value: "address", label: "Balances"},
    {value: "tokens", label: "NFT"},
    {value: "address1", label: "Transactions"}
  ]

  const BalancesEndpoints = [
    { value: "balances_v2", label: "Token Balances for Address" },
    { value: "portfolio_v2", label: "Historical portfolio value over time" },
    { value: "transfers_v2", label: "ERC20 Token Transfers" }
  ];

  const NFTEndpoints = [
    { value: "nft_token_ids", label: "Get NFT token Ids for contract" },
    { value: "nft_transactions", label: "Get NFT transactions for contract"},
    { value: "nft_metadata", label: "Get NFT Metadata"}
  ]

  const TransactionsEndpoints = [
    { value: "transaction_v2", label: "Get a transaction" },
  ]

  const broadendpointstoendpoints = {
    address: BalancesEndpoints,
    tokens: NFTEndpoints,
    address1: TransactionsEndpoints
  }

  const apicall = async () => {
    const baseURL = 'https://api.covalenthq.com/v1'

    let url = ""
    if (broadEndpoint.value=="address"){
      url = new URL(`${baseURL}/${chainId.value}/address/${address}/${endpoint.value}/?key=${apikey}`);
    } else if (broadEndpoint.value=="tokens") {
      if (endpoint.value == "nft_token_ids") {
        url = new URL(`${baseURL}/${chainId.value}/tokens/${address}/${endpoint.value}/?key=${apikey}`);
      } else {
        url = new URL(`${baseURL}/${chainId.value}/tokens/${address}/${endpoint.value}/${tokenId}/?key=${apikey}`);
      }
    } else if (broadEndpoint.value=="address1") {
      url = new URL(`${baseURL}/${chainId.value}/address/${address}/${endpoint.value}/?key=${apikey}`);
    }

    console.log(endpoint)
    
    const response = await fetch(url);
    if(response.status != 200) {
      setJsonResponse("Something went wrong")
      console.log(response.status)
    } else {    
      const result = await response.json();
      const data = result.data;
      console.log(response.status)
      setJsonResponse(data);
    }
  }

  let options = [];

  if(broadEndpoint.value=="address") {
    options = BalancesEndpoints
  } else if (broadEndpoint.value=="tokens") {
    options = NFTEndpoints
  } else if (broadEndpoint.value=="address1"){
    options=TransactionsEndpoints
  }

  useEffect(() => {
    console.log(chainId, broadEndpoint, endpoint)
    console.log("")
  }, [chainId, endpoint, broadEndpoint])
  
  return (
    <div>
      <img src="../public/covalent_logo.jpeg" width="100px" className="logo"/>
      <h1 className="title">Even Easier Covalent</h1>
      <div className="App">
        <Dropdown
          isSearchable
          placeHolder="Select..."
          options={chainIds}
          onChange={(value) => setChainId(value)}
        />

        <Dropdown
          isSearchable
          placeHolder="Select..."
          options={broadendpoints}
          onChange={(value) => setBroadEndpoint(value)}
        />  

        <Dropdown
          isSearchable
          placeHolder="Select..."
          options={options}
          onChange={(value) => setEndpoint(value)}
        />

        <input placeholder="apikey" required onChange={(value) => setApiKey(value.target.value)}>
        </input>
        <input placeholder="address" onChange={(value) => setAddress(value.target.value)}>
        </input>
        <input placeholder="tokenId" onChange={(value) => setTokenId(value.target.value)}>
        </input>
        <button onClick={apicall}>Submit</button>
      </div>
      <div>
        <h1>JSON Response</h1>
        <ReactJson src={jsonResponse} />
      </div>
    </div>

  );
}
