import EthCrypto from 'eth-crypto';
const keccak256 = require('keccak256')

App = {
    loading: false,
    contracts: {},

    load: async() => {
        await App.loadWeb3()
        web3.eth.defaultAccount = web3.eth.accounts[0]
        await App.loadAccount()
        await App.loadContract()
    },

    // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
    loadWeb3: async() => {
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider
            web3 = new Web3(web3.currentProvider)
        } else {
            window.alert("Please connect to Metamask.")
        }
        // Modern dapp browsers...
        if (window.ethereum) {
            window.web3 = new Web3(ethereum)
            try {
                // Request account access if needed
                await ethereum.enable()
                    // Acccounts now exposed
                web3.eth.sendTransaction({ /* ... */ })
            } catch (error) {
                // User denied account access...
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = web3.currentProvider
            window.web3 = new Web3(web3.currentProvider)
                // Acccounts always exposed
            web3.eth.sendTransaction({ /* ... */ })
        }
        // Non-dapp browsers...
        else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    },

    loadAccount: async() => {
        // Set the current blockchain account
        App.account = web3.eth.accounts[0]
        console.log(web3.eth.accounts)
    },

    loadContract: async() => {
        // Create a JavaScript version of the smart contract
        const auction = await $.getJSON('Auction.json')
        App.contracts.auction = TruffleContract(auction)
        App.contracts.auction.setProvider(App.web3Provider)

        // Hydrate the smart contract with values from the blockchain
        App.auction = await App.contracts.auction.deployed()
        console.log(App.auction.itemsCount())
    },

    /**
     * 
     * @param {string} item_name name of the item 
     * @param {string} item_description description of the item 
     * @param {uint} asking_price price (no need) 
     */
    addItem: async(item_name, item_description, asking_price) => {
        // seller use case to add an item
        let index_id = (await App.auction.addItem(item_name, item_description, { from: web3.eth.accounts[0] })).toNumber();
        return index_id;
    },

    /**
     * 
     * @param {uint} bid_id id of the item_auction whose bidding round is to be closed
     */
    closeBiddingRound: async(bid_id) => {
        await App.auction.closeBid(bid_id, { from: web3.eth.accounts[0] });
    },

    /**
     * 
     * @param {uint} bid_id id of the bid you want to complete
     * @param {string} secret_string secret string (which will be encrypted and then sent)
     */
    revealBid: async(bid_id, secret_string) => {
        (await App.auction.revealBid(bid_id, { from: web3.eth.accounts[0] }));
        let pk = (await App.auction.getKey(bid_id));
        let encoded_string = (await EthCrypto.encryptWithPublicKey(pk, item_string));
        while (!confirm('Are you sure ' + secret_string + ' is the message you want to send?')) {
            var inp = prompt('Enter the secret string');
            encoded_string = (await EthCrypto.encryptWithPublicKey(pk, item_string));
        }
        await App.auction.giveAccess(bid_id, encoded_string, { from: web3.eth.accounts[0] });
    },

    /**
     * 
     * @param {uint} item_id id of the item-listing whose name is to be changed
     * @param {string} new_name new name of the item
     */
    changeItemName: async(item_id, new_name) => {
        await App.auction.changeName(item_id, new_name, { from: web3.eth.accounts[0] });
    },

    /**
     * 
     * @param {uint} item_id id of the item-listing to be bid
     * @param {string} password random string to create bid hash
     * @param {uint} bidValue bid value
     */
    bidItem: async(item_id, password, bidValue) => {
        toHash = web3.eth.accounts[0].toString() +  password + bidValue.toString()
        hashString = createHash(toHash);
        await App.auction.bidItem(item_id, hashString, { from: web3.eth.accounts[0] });
    },

    /**
     * 
     * @param {string} toHash string to be hashed
     * @returns hashedString
     */
    createHash: async(toHash) => {
        return keccak256(toHash);
    },

    /**
     * 
     * @param {uint} item_id id of the item-listing whose bid is to be verified
     * @param {string} password random string entered at time of bidding
     * @param {uint} bidValue bid value proposed at time of bidding
     * @param {string} public_key eth crypto public key
     */
    verifyBid: async(item_id, password, bidValue, public_key) => {
        await App.auction.verifyBid(item_id, password, public_key, { from: web3.eth.accounts[0], value: bidValue });
    }

}

$(() => {
    $(window).load(() => {
        App.load()
    })
})
