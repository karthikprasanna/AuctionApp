import React, { useState, useEffect } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

import "./App.css";

const App = (props) =>  {
  const [commonState, setCommonState] = useState({ storageValue: 0, web3: null, accounts: null, contract: null });

  const [inputValue, setInputValue] = useState(0);

  useEffect(() => {
    const init = async () => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = SimpleStorageContract.networks[networkId];
        const instance = new web3.eth.Contract(
          SimpleStorageContract.abi,
          deployedNetwork && deployedNetwork.address,
        );
        const response = await instance.methods.get().call();
        console.log(response)

        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        setCommonState({  storageValue: response, web3, accounts, contract: instance });
        console.log({ storageValue: response, web3, accounts, contract: instance })
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }
    }
    init();
  }, []);


  const updateVal = async () => {
    const { accounts, contract } = commonState;
    console.log(inputValue)
    await contract.methods.set(inputValue).send({ from: accounts[0] });

    const response = await contract.methods.get().call();
    console.log(response)
    setCommonState({ ...commonState, storageValue: response });
  }

  
  if (commonState.web3 === null) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }
  return (
    <div className="App">
      <input type="number" value={inputValue} onChange={(e) => setInputValue(parseInt(e.target.value))} />
      <button onClick={()=>updateVal()}>Click to update value in smart contract</button>
      <div>The stored value is: {commonState.storageValue}</div>
    </div>
  );
}

export default App;
