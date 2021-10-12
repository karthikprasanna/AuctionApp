pragma solidity ^0.5.0;

/**
 * @title   Screen Selling Platform
 * @notice  This contract abstracts the screen selling
 * marketplace and provides functions to perform
 * transactions
 * @author  Team Block-Daggers
 *
 */
contract Auction {
    /**
     * This enum defines status of screen (item) present in the
     * marketplace
     *
     */
    enum ITEM_STATUS {
        LOCKED, /// Item is being processed, hence is not listed in marketplace
        OPEN, /// Item is being sold at marketplace
        BUYING, /// Buyer has paid for the item, but hasn't received it yet
        BOUGHT /// Buyer received the item
    }

    enum AUCTION_STATUS {
        ONGOING,
        VERIFICATION,
        REVEALED
    }

    enum AUCTION_TYPE {
        FIRST_PRICE,
        SECOND_PRICE,
        AVG_PRICE,
        FIXED
    }

    /**
     * This struct defines the blueprint of each screen (item)
     * present in the marketplace
     *
     */
    struct Listing {
        address payable seller;
        ITEM_STATUS status;
        string item_name;
        string item_desc;
        string secret_string;
        uint256 asking_price;
        uint256 final_price;
        mapping(bytes32 => bool) hashedBids;
        uint256 biddersCount;
        mapping(address => bool) bidders;
        mapping(address => bool) isVerified;
        Bidder[] verifiedBids;
        Bidder bidWinner;
        AUCTION_STATUS auctionStatus;
        AUCTION_TYPE auctionType;
    }

    struct Bidder {
        address payable buyer;
        uint256 price;
        string public_key;
    }

    uint256 private itemsCount;
    mapping(uint256 => Listing) private itemsList;

    /**
     * Initialising smart contract to the scenario when no item
     * is present in the marketplace
     *
     */
    constructor() public {
        itemsCount = 0;
    }

    /**
     * Allows only seller of item to access the function
     *
     * @param index unique id of item
     */
    modifier onlyItemSeller(uint256 index) {
        require(index <= itemsCount && index > 0, "Item not present in list");
        require(
            msg.sender == itemsList[index].seller,
            "You are not seller of item"
        );
        _;
    }

    /**
     * Allows only buyer or seller to access the function
     *
     * @param index unique id of item
     */
    modifier onlyItemOwnerOrSeller(uint256 index) {
        require(index <= itemsCount && index > 0, "Item not present in list");

        require(
            msg.sender == itemsList[index].seller ||
                (msg.sender == itemsList[index].bidWinner.buyer &&
                    itemsList[index].status == ITEM_STATUS.BOUGHT),
            "You are not owner or seller of item"
        );
        _;
    }

    /**
     * Checks empty string
     * 
     * @param str string
     */
    modifier nonEmpty(string memory str){
        require(bytes(str).length > 0, "String should be non empty");
        _;
    }

    /**
     * Checks empty array
     * 
     * @param item_id id of the item
     */
    modifier nonEmptyBidders(uint256 item_id){
        require(true, "No bidders found");
        _;
    }

    /**
     * Adds an item in the marketplace
     * Used by: Seller
     *
     * @param _item_name name of item
     * @param _item_desc description of item
     * @param _asking_price asking price of item
     */
    function addItem(
        string memory _item_name,
        string memory _item_desc,
        uint256 _asking_price,
        uint256 _auction_type
    ) 
    public 
    nonEmpty(_item_name)
    nonEmpty(_item_desc)
    returns (uint256) {
        itemsCount++;
        itemsList[itemsCount].status = ITEM_STATUS.LOCKED;
        itemsList[itemsCount].item_desc = _item_desc;
        itemsList[itemsCount].seller = msg.sender;
        itemsList[itemsCount].item_name = _item_name;
        itemsList[itemsCount].asking_price = _asking_price;
        itemsList[itemsCount].status = ITEM_STATUS.OPEN;
        itemsList[itemsCount].auctionStatus = AUCTION_STATUS.ONGOING;
        if (_auction_type == 0) {
            itemsList[itemsCount].auctionType = AUCTION_TYPE.FIRST_PRICE;
        } else if (_auction_type == 1) {
            itemsList[itemsCount].auctionType = AUCTION_TYPE.SECOND_PRICE;
        } else if (_auction_type == 2) {
            itemsList[itemsCount].auctionType = AUCTION_TYPE.AVG_PRICE;
        } else {
            itemsList[itemsCount].auctionStatus = AUCTION_STATUS.VERIFICATION;
            itemsList[itemsCount].auctionType = AUCTION_TYPE.FIXED;
        }
        return itemsCount;
    }

    function bidItem(uint256 item_id, bytes32 hashString) public {
        require(
            item_id <= itemsCount && item_id > 0,
            "Item not present in list"
        );
        require(
            itemsList[item_id].auctionStatus == AUCTION_STATUS.ONGOING,
            "Auction not ongoing"
        );
        require(
            itemsList[item_id].bidders[msg.sender] == false,
            "Already bidded"
        );
        itemsList[item_id].hashedBids[hashString] = true;
        itemsList[item_id].biddersCount += 1;
        itemsList[item_id].bidders[msg.sender] = true;
    }

    function closeBid(uint256 item_id) public nonEmptyBidders(item_id) {
        require(
            msg.sender == itemsList[item_id].seller || msg.sender == address(this),
            'Access denied'
        );
        require(
            item_id <= itemsCount && item_id > 0,
            "Item not present in list"
        );
        require(
            itemsList[item_id].auctionStatus == AUCTION_STATUS.ONGOING,
            "Auction not ongoing"
        );
        require(
            itemsList[item_id].biddersCount != 0,
            "No Bidder"
        );
        if(itemsList[item_id].auctionType == AUCTION_TYPE.SECOND_PRICE) {
            require(
                itemsList[item_id].biddersCount >= 2,
                "Atleast two people should bid for vickery auction"
            );  
        }
        itemsList[item_id].auctionStatus = AUCTION_STATUS.VERIFICATION;
    }

    function verifyBid(
        uint256 item_id,
        string memory password,
        string memory public_key
    ) public payable {
        require(
            item_id <= itemsCount && item_id > 0,
            "Item not present in list"
        );
        require(
            itemsList[item_id].auctionStatus == AUCTION_STATUS.VERIFICATION,
            "Bid verification not in progress"
        );
        if(itemsList[item_id].auctionType == AUCTION_TYPE.FIXED){
            if(msg.value == itemsList[item_id].asking_price){
                itemsList[item_id].final_price = msg.value;
                itemsList[item_id].bidWinner = Bidder(msg.sender, msg.value, public_key); 
                itemsList[item_id].status = ITEM_STATUS.BUYING;
                itemsList[item_id].auctionStatus = AUCTION_STATUS.REVEALED;   // everything is done 
            }
            else{
                revert("Invalid Price");
            }
        }
        else{
            bytes32 hashValue = keccak256(
                abi.encodePacked(password, uintToStr(msg.value))
            );
            if(itemsList[item_id].hashedBids[hashValue] != true){
                revert("Invalid details");
            }

            itemsList[item_id].verifiedBids.push(
                Bidder(msg.sender, msg.value, public_key)
            );
            itemsList[item_id].isVerified[msg.sender] = true;
        }

    }

    function abs(uint256 a, uint256 b) private pure returns (uint256) {
        if (a >= b) {
            return a - b;
        } else {
            return b - a;
        }
    }

    function revealBid(uint256 item_id) public payable onlyItemSeller(item_id){
        require(
            item_id <= itemsCount && item_id > 0,
            "Item not present in list"
        );
        require(
            itemsList[item_id].auctionStatus == AUCTION_STATUS.VERIFICATION,
            "Bid verification not in progress"
        );
        require(
            itemsList[item_id].verifiedBids.length > 0,
            "No one verified bid"
        );

        if(itemsList[item_id].auctionType == AUCTION_TYPE.SECOND_PRICE) {
            require(
                itemsList[item_id].verifiedBids.length >= 2,
                "Atleast two people should verify for vickery auction"
            );  
        }

        uint256 maxBid = 0;
        Bidder memory maxBidder;
        uint256 secondMaxBid = 0;
        uint256 totalBid = 0;

        for (uint256 i = 0; i < itemsList[item_id].verifiedBids.length; i++) {
            uint256 currentBidPrice = itemsList[item_id].verifiedBids[i].price;
            totalBid += currentBidPrice;
            if (currentBidPrice > maxBid) {
                secondMaxBid = maxBid;
                maxBid = currentBidPrice;
                maxBidder = itemsList[item_id].verifiedBids[i];
            } else if (currentBidPrice > secondMaxBid) {
                secondMaxBid = currentBidPrice;
            }
        }

        if (itemsList[item_id].auctionType == AUCTION_TYPE.FIRST_PRICE) {
            itemsList[item_id].bidWinner = maxBidder;
            itemsList[item_id].final_price = maxBid;
        } else if (
            itemsList[item_id].auctionType == AUCTION_TYPE.SECOND_PRICE
        ) {
            itemsList[item_id].bidWinner = maxBidder;
            itemsList[item_id].final_price = secondMaxBid;
        } else if(itemsList[item_id].auctionType == AUCTION_TYPE.AVG_PRICE) {
            uint256 minDiff = uint256(-1);
            Bidder memory avgBidder;
            uint256 n = itemsList[item_id].verifiedBids.length;
            for (uint256 i = 0; i < n; i++) {
                uint256 currentBidPrice = itemsList[item_id]
                    .verifiedBids[i]
                    .price * n;
                if (abs(currentBidPrice, totalBid) < minDiff) {
                    avgBidder = itemsList[item_id].verifiedBids[i];
                    minDiff = abs(currentBidPrice, totalBid); 
                }

                itemsList[item_id].bidWinner = avgBidder;
                itemsList[item_id].final_price = avgBidder.price;
            }
        } else{
            // normal purchase, do nothing
        }

        itemsList[item_id].status = ITEM_STATUS.BUYING;
        itemsList[item_id].auctionStatus = AUCTION_STATUS.REVEALED;
        returnNonWinnerMoney(item_id);
    }

    /**
     * Gets public key of the buyer from the item being bought
     * Used by: Seller
     *
     * @param item_id unique id of item
     */
    function getKey(uint256 item_id)
        public
        view
        onlyItemSeller(item_id)
        returns (string memory)
    {
        require(
            itemsList[item_id].status == ITEM_STATUS.BUYING,
            "KEY NOT AVAILABLE"
        );
        return itemsList[item_id].bidWinner.public_key;
    }

    /**
     * Assigns encrypted password to the item which can be only decrypted
     * by the buyer
     * Thus, it simulates delivery of the screen (item) from the seller
     * Item is marked as BOUGHT
     * Used by: Seller
     *
     * @param item_id unique id of item
     * @param secret_string Encrypted password of the screen (i.e.
     *                           item) along with the public key of the buyer
     */
    function giveAccess(uint256 item_id, string memory secret_string)
        public
        payable
        onlyItemSeller(item_id)
    {
        require(
            itemsList[item_id].status == ITEM_STATUS.BUYING,
            "Item not purchased yet"
        );
        itemsList[item_id].secret_string = secret_string;
        itemsList[item_id].status = ITEM_STATUS.BOUGHT;
        itemsList[item_id].seller.transfer(itemsList[item_id].final_price);
        // return pending money of bid winner like in case of auction type 2
        returnWinnerPendingMoney(item_id);
    }

    function returnWinnerPendingMoney(uint256 item_id) private {
        uint256 pendingMoney = itemsList[item_id].bidWinner.price -
            itemsList[item_id].final_price;
        itemsList[item_id].bidWinner.buyer.transfer(pendingMoney);
    }

    function returnNonWinnerMoney(uint256 item_id) private {
        for (uint256 i = 0; i < itemsList[item_id].verifiedBids.length; i++) {
            if (
                itemsList[item_id].verifiedBids[i].buyer ==
                itemsList[item_id].bidWinner.buyer
            ) {
                continue;
            }

            uint256 returnPrice = itemsList[item_id].verifiedBids[i].price;
            itemsList[item_id].verifiedBids[i].buyer.transfer(returnPrice);
        }
    }

    /**
     * @dev View pending balance in escrow account
     * Used by: Developer
     *
     */
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    /**
     * Returns encrypted password of the delivered item
     * Used by: Buyer, (optional) Seller
     *
     * @param item_id unique id of item
     */
    function accessItem(uint256 item_id)
        public
        view
        onlyItemOwnerOrSeller(item_id)
        returns (string memory)
    {
        return itemsList[item_id].secret_string;
    }

    /**
     * Updates the name of the item listed in the marketplace
     * Used by: Seller
     *
     * @param item_id unique id of item
     * @param item_name name of item
     */
    function changeName(uint256 item_id, string memory item_name)
        public
        onlyItemSeller(item_id)
    {
        require(
            itemsList[item_id].status == ITEM_STATUS.OPEN,
            "Item is already sold"
        );
        itemsList[item_id].status = ITEM_STATUS.LOCKED;
        itemsList[item_id].item_name = item_name;
        itemsList[item_id].status = ITEM_STATUS.OPEN;
    }

    /**
     * Updates the price of the item listed in the marketplace
     * Used by: seller
     *
     * @param item_id unique id of item
     * @param price item price
     */
    function changePrice(uint256 item_id, uint256 price)
        public
        onlyItemSeller(item_id)
    {
        require(
            itemsList[item_id].status == ITEM_STATUS.OPEN,
            "Item is already sold"
        );
        itemsList[item_id].status = ITEM_STATUS.LOCKED;
        itemsList[item_id].asking_price = price;
        itemsList[item_id].status = ITEM_STATUS.OPEN;
    }

    /**
     * Converts an unsigned integer to its equivalent string
     *
     * @param _i number
     */
    function uintToStr(uint256 _i)
        private
        pure
        returns (string memory _uintAsString)
    {
        uint256 number = _i;
        if (number == 0) {
            return "0";
        }
        uint256 j = number;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len - 1;
        while (number != 0) {
            bstr[k--] = bytes1(uint8(48 + (number % 10)));
            number /= 10;
        }
        return string(bstr);
    }

    /**
     * Converts address to string
     * Source: https://ethereum.stackexchange.com/a/58341
     *
     * @param account address of account
     */
    function toString(address account) private pure returns (string memory) {
        return toString(abi.encodePacked(account));
    }

    function toString(bytes memory data) private pure returns (string memory) {
        bytes memory alphabet = "0123456789abcdef";

        bytes memory str = new bytes(2 + data.length * 2);
        str[0] = "0";
        str[1] = "x";
        for (uint256 i = 0; i < data.length; i++) {
            str[2 + i * 2] = alphabet[uint256(uint8(data[i] >> 4))];
            str[3 + i * 2] = alphabet[uint256(uint8(data[i] & 0x0f))];
        }
        return string(str);
    }

    function printHelper(uint i, bool firstItem) public view returns (string memory) {
        string memory str = "";
        uint at = 0;
        if(itemsList[i].auctionType == AUCTION_TYPE.SECOND_PRICE){
            at=1;
        }
        else if(itemsList[i].auctionType == AUCTION_TYPE.AVG_PRICE){
            at = 2;
        }
        else if(itemsList[i].auctionType == AUCTION_TYPE.FIXED){
            at = 3;
        }

        uint ast = 0;
        if(itemsList[i].auctionStatus == AUCTION_STATUS.VERIFICATION){
            ast = 1;
        }
        else if(itemsList[i].auctionStatus == AUCTION_STATUS.REVEALED)
        {
            ast = 2;
        }
        
        uint ist = 0;
        if(itemsList[i].status == ITEM_STATUS.OPEN){
            ist = 1;
        }
        else if(itemsList[i].status == ITEM_STATUS.BUYING){
            ist = 2;
        }
        else if(itemsList[i].status == ITEM_STATUS.BOUGHT){
            ist = 3;
        }
        
        if(!firstItem){
            str = string(abi.encodePacked(str, ','));    
        }

        str = string(abi.encodePacked(str, '{"itemId":'));
        str = string(abi.encodePacked(str, uintToStr(i)));
        str = string(abi.encodePacked(str, ',"itemName":"'));
        str = string(abi.encodePacked(str, itemsList[i].item_name));
        str = string(abi.encodePacked(str, '","itemDescription": "'));
        str = string(abi.encodePacked(str, itemsList[i].item_desc));
        str = string(abi.encodePacked(str, '","itemStatus":'));
        str = string(abi.encodePacked(str, uintToStr(ist)));
        str = string(abi.encodePacked(str, ',"askingPrice":'));
        str = string(abi.encodePacked(str, uintToStr(itemsList[i].asking_price)));
        str = string(abi.encodePacked(str, ',"auctionType":'));
        str = string(abi.encodePacked(str, uintToStr(at)));
        str = string(abi.encodePacked(str, ',"auctionStatus":'));
        str = string(abi.encodePacked(str, uintToStr(ast)));
        str = string(abi.encodePacked(str, ',"sellerId": "'));
        str = string(abi.encodePacked(str,toString(abi.encodePacked(itemsList[i].seller))));
        str = string(abi.encodePacked(str, '","alreadyBid": "'));
        str = string(abi.encodePacked(str,toString(abi.encodePacked(itemsList[i].bidders[msg.sender]))));
        str = string(abi.encodePacked(str, '","bidWinner": "'));
        str = string(abi.encodePacked(str,toString(abi.encodePacked(itemsList[i].bidWinner.buyer))));
        str = string(abi.encodePacked(str, '","isVerified": "'));
        str = string(abi.encodePacked(str,toString(abi.encodePacked(itemsList[i].isVerified[msg.sender]))));
        str = string(abi.encodePacked(str, '"}'));
        return str;
    }

    /**
     * Returns the items present in the marketplace, which are
     * ready to be sold
     * Used by: public
     *
     */
    function viewActiveListings(bool allItems) public view returns (string memory) {
        string memory str = "[";
        bool firstItem = true;

        for (uint256 i = 1; i <= itemsCount; i++) {
            if (allItems || itemsList[i].auctionStatus == AUCTION_STATUS.ONGOING || 
                (itemsList[i].auctionStatus == AUCTION_STATUS.VERIFICATION && itemsList[i].auctionType == AUCTION_TYPE.FIXED)) {
                str = string(abi.encodePacked(str, printHelper(i, firstItem)));
                firstItem = false;
            }
        }
        str = string(abi.encodePacked(str, "]"));
        return str;
    }

    function viewSellerListings(address seller_id) public view returns (string memory) {
        string memory str = "[";
        bool firstItem = true;
        for (uint256 i = 1; i <= itemsCount; i++) {
            if (itemsList[i].seller == seller_id) {
                str = string(abi.encodePacked(str, printHelper(i, firstItem)));
                firstItem = false;
            }
        }
        str = string(abi.encodePacked(str, "]"));
        return str;
    }    
}