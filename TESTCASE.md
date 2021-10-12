## Fixed Price Selling Testcase

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


## First Price Auction Testcase 

> Seller         

* SignIn to metamask with `seller account`. We can check balance on top-right. It will be 100 eth (or near that value) depending on the account selected.
* Navigate to Seller-Portal > Add Item.
* Enter item name, description. Select auction type as : **FIRST PRICE** Auction. Press Submit.

> Bidder 1      
* Sign in to metamask with `bidder 1 account`. We can check balance on top-right.
* Move to Market-Place and select the item.
* Add a bid value and password. Notice that this detail is not revealed by sending to blockchain, but it's hashed value is sent to the blockchain. This maintains secrecy of bid value. Press Submit.

> Bidder 2      
* Sign in to metamask with `bidder 2 account`. We can check balance on top-right.
* Move to Market-Place and select the item.
* Add a bid value and password. Notice that this detail is not revealed by sending to blockchain, but it's hashed value is sent to the blockchain. This maintains secrecy of bid value. Press Submit.

> Bidder 3      
* Sign in to metamask with `bidder 3 account`. We can check balance on top-right.
* Move to Market-Place and select the item.
* Add a bid value and password. Notice that this detail is not revealed by sending to blockchain, but it's hashed value is sent to the blockchain. This maintains secrecy of bid value. Press Submit.


*Suppose bid from bidder 1 is 100Wei, from bidder 2 is 200Wei and from bidder 3 is 300Wei*.

> Seller        
* After appropriate time, close the bidding round by going to `Seller-Portal > View Active bid` and selecting `Stop Bidding` button. Now the bidders will move to the verification round. 

> Bidder 1      
* Bidder 1 will go to `My Bids` and select the `verify bid` button for the item. 
* He'll be prompted to enter the password and bid amount. He enters the value and bid amount. 
* `TRANSACTION HAPPENS` equal to value in bid-amount to the escrow contract. 
* The bidder also gets a private key to save. He should save this to decrypt delivered item in case he wins the bid. 


> Bidder 2 & 3      
* Same process

> Seller 
* Now seller will (after some random / enough) time end verification round and show the winner. 
* For this they should go to `Seller-Portal > Reveal Bid / Deliver Item` and give the delivery string (netflix screen password).
* At this time, winner will be revealed and all loosing parties will be refunded their bid value from the escrow contract.
* Seller gets the `payment` that the winning bidder has to pay.

> Winner buyer ( Buyer 3)
* Buyer 3 will go to `Orders`. He will see option to access item. 
* They should enter the private key to decrypt the item, and they will see the decrypted string and thus the `DELIVERY PROCESS` is complete.

## Second Price Auction TestCase

> Seller         

* SignIn to metamask with `seller account`. We can check balance on top-right. It will be 100 eth (or near that value) depending on the account selected.
* Navigate to Seller-Portal > Add Item.
* Enter item name, description. Select auction type as : **Second PRICE** Auction. Press Submit.

> Bidder 1      
* Sign in to metamask with `bidder 1 account`. We can check balance on top-right.
* Move to Market-Place and select the item.
* Add a bid value and password. Notice that this detail is not revealed by sending to blockchain, but it's hashed value is sent to the blockchain. This maintains secrecy of bid value. Press Submit.

> Bidder 2      
* Sign in to metamask with `bidder 2 account`. We can check balance on top-right.
* Move to Market-Place and select the item.
* Add a bid value and password. Notice that this detail is not revealed by sending to blockchain, but it's hashed value is sent to the blockchain. This maintains secrecy of bid value. Press Submit.

> Bidder 3      
* Sign in to metamask with `bidder 3 account`. We can check balance on top-right.
* Move to Market-Place and select the item.
* Add a bid value and password. Notice that this detail is not revealed by sending to blockchain, but it's hashed value is sent to the blockchain. This maintains secrecy of bid value. Press Submit.


*Suppose bid from bidder 1 is 100Wei, from bidder 2 is 200Wei and from bidder 3 is 300Wei*.
**In this case, winner is bidder 3 as he has the highest bid. However, he pays the second highest amount which is 200Wei.**

> Seller        
* After appropriate time, close the bidding round by going to `Seller-Portal > View Active bid` and selecting `Stop Bidding` button. Now the bidders will move to the verification round. 

> Bidder 1      
* Bidder 1 will go to `My Bids` and select the `verify bid` button for the item. 
* He'll be prompted to enter the password and bid amount. He enters the value and bid amount. 
* `TRANSACTION HAPPENS` equal to value in bid-amount to the escrow contract. 
* The bidder also gets a private key to save. He should save this to decrypt delivered item in case he wins the bid. 


> Bidder 2 & 3      
* Same process

> Seller 
* Now seller will (after some random / enough) time end verification round and show the winner. 
* For this they should go to `Seller-Portal > Reveal Bid / Deliver Item` and give the delivery string (netflix screen password).
* At this time, winner will be revealed and all loosing parties will be refunded their bid value from the escrow contract.
* Seller gets the `payment` that the winning bidder has to pay, and the winner gets the difference between his bid amount and the 2nd largest bid amount. (Bid value and the payable value). 

> Winner buyer ( Bidder 3)
* Bidder 3 will go to `Orders`. He will see option to access item. 
* They should enter the private key to decrypt the item, and they will see the decrypted string and thus the `DELIVERY PROCESS` is complete.

## Average Price Auction TestCase

> Seller         

* SignIn to metamask with `seller account`. We can check balance on top-right. It will be 100 eth (or near that value) depending on the account selected.
* Navigate to Seller-Portal > Add Item.
* Enter item name, description. Select auction type as : **Average PRICE** Auction. Press Submit.

> Bidder 1      
* Sign in to metamask with `bidder 1 account`. We can check balance on top-right.
* Move to Market-Place and select the item.
* Add a bid value and password. Notice that this detail is not revealed by sending to blockchain, but it's hashed value is sent to the blockchain. This maintains secrecy of bid value. Press Submit.

> Bidder 2      
* Sign in to metamask with `bidder 2 account`. We can check balance on top-right.
* Move to Market-Place and select the item.
* Add a bid value and password. Notice that this detail is not revealed by sending to blockchain, but it's hashed value is sent to the blockchain. This maintains secrecy of bid value. Press Submit.

> Bidder 3      
* Sign in to metamask with `bidder 3 account`. We can check balance on top-right.
* Move to Market-Place and select the item.
* Add a bid value and password. Notice that this detail is not revealed by sending to blockchain, but it's hashed value is sent to the blockchain. This maintains secrecy of bid value. Press Submit.


*Suppose bid from bidder 1 is 100Wei, from bidder 2 is 200Wei and from bidder 3 is 300Wei*.
**In this case, winner is bidder 2 as the average is (100+200+300)/3 = 200. This is exactly the bid from bidder 2.**

> Seller        
* After appropriate time, close the bidding round by going to `Seller-Portal > View Active bid` and selecting `Stop Bidding` button. Now the bidders will move to the verification round. 

> Bidder 1      
* Bidder 1 will go to `My Bids` and select the `verify bid` button for the item. 
* He'll be prompted to enter the password and bid amount. He enters the value and bid amount. 
* `TRANSACTION HAPPENS` equal to value in bid-amount to the escrow contract. 
* The bidder also gets a private key to save. He should save this to decrypt delivered item in case he wins the bid. 


> Bidder 2 & 3      
* Same process

> Seller 
* Now seller will (after some random / enough) time end verification round and show the winner. 
* For this they should go to `Seller-Portal > Reveal Bid / Deliver Item` and give the delivery string (netflix screen password).
* At this time, winner will be revealed and all loosing parties will be refunded their bid value from the escrow contract.
* Seller gets the `payment` that the winning bidder has to pay. 

> Winner buyer ( Bidder 2)
* Bidder 2 will go to `Orders`. He will see option to access item. 
* They should enter the private key to decrypt the item, and they will see the decrypted string and thus the `DELIVERY PROCESS` is complete.







