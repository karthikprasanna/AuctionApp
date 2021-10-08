import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import getWeb3 from "./getWeb3";
import AuctionContract from "./contracts/Auction.json";
import Routes from "./pages/Routes";

import "./App.css";

export const BlkContext = createContext();

const App = (props) => {
  const [blockchain, setBlockchain] = useState({
    web3: null,
    accounts: null,
    contract: null,
  });

  useEffect(() => {
    const init = async () => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = AuctionContract.networks[networkId];
        const contract = new web3.eth.Contract(
          AuctionContract.abi,
          deployedNetwork && deployedNetwork.address
        );

        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        setBlockchain({ web3, accounts, contract });
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }
    };
    init();
  }, []);

  if (blockchain.web3 === null) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }
  return (
    <BlkContext.Provider value={blockchain}>
      <Routes />
    </BlkContext.Provider>
  );
};

export default App;
