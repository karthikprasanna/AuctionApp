## Fixed Price Selling

* Sigin to metmask with account1. You can check the account balance on top right of screen. It is not 100 Eth because of amount deducted in deploying the contract.
* Navigate to seller portal and add some item with *direct sell* option.
* Now sigin to metamask with account2. You can check the account balance on top right as 100Eth.
* Navigate to MarketPlace and click on buy option for that same item.
* Copy the hashed delivery key popped up and buy the product.
* Account balance on top right of screen will decrease as money is transferred to Escrow account.
* You can see that product in your Orders Section with status as *Processing Delivery*.
* Now log in back to account1. The account balance on top right is same and not increased because money will be transferred to seller's account only after successfull delievery of product.
* Navigate to seller portal, then *deliver items* section.
* Click on Deliver item and type some secret string. You can notice increase in accounts balance on successfull delievery.
* Now got back to account2 and then to orders section.
* Click on Access item and pasted the copied hashed delivery key while buying the item.
* You can see the secret string and hence the item is delivered successfully.
