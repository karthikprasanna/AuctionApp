//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract MyContract {
    enum AuctionStatus {
        ONGOING,
        PROCESSING,
        OVER
    }
    AuctionStatus auctionStatus = AuctionStatus.ONGOING;

    // struct for roles
    struct Manufacturer {
        string name;
        string supplierForTyres;
        string supplierForBody;
        address manufacturerAddress;
        string hashedTyreBid;
        string hashedCarBodyBid;
    }

    struct CarBodySupplier {
        string name;
        //string supplierType;
        address carBodySupplierAddress;
    }

    struct CarTyreSupplier {
        string name;
        //string supplierType;
        string suppliesTo;
        address carTyreSupplierAddress;
    }

    //variables used for actors

    Manufacturer TataManufacturer;
    Manufacturer MaruthiManufacturer;

    CarBodySupplier carBodySupplier;

    CarTyreSupplier MrfCarTyreSupplier;
    CarTyreSupplier CeatCarTyreSupplier;

    //add modifiers to the view functions
    modifier OnlyCarBodySupplier() {
        require(msg.sender == carBodySupplier.carBodySupplierAddress);
        _;
    }

    modifier OnlyTATA() {
        require(
            msg.sender == TataManufacturer.manufacturerAddress,
            "Access is available only to Tata"
        );
        _;
    }

    modifier OnlyMaruti() {
        require(
            msg.sender == MaruthiManufacturer.manufacturerAddress,
            "Access is available only to Maruti"
        );

        _;
    }

    modifier OnlyMrf() {
        require(
            msg.sender == MrfCarTyreSupplier.carTyreSupplierAddress,
            "Access is available only to Mrf"
        );
        _;
    }

    modifier OnlyCeat() {
        require(
            msg.sender == CeatCarTyreSupplier.carTyreSupplierAddress,
            "Access is available only to Ceat"
        );
        _;
    }

    modifier WhenAuctionOngoing() {
        require(
            auctionStatus == AuctionStatus.ONGOING,
            "The auction is not ongoing"
        );
        _;
    }

    modifier WhenAuctionProcessing() {
        require(
            auctionStatus == AuctionStatus.PROCESSING,
            "The auction is not in the processing stage"
        );

        _;
    }

    modifier WhenAuctionOver() {
        require(auctionStatus == AuctionStatus.OVER, "The auction is not over");
        _;
    }

    //variables for setting supply limits-------

    uint256 CarTyreSupplierLimit_MRF;
    uint256 CarTyreSupplierLimit_CEAT;
    uint256 CarBodySupplierLimit_VEDANTHA;

    //uint CarBodySupplierLimit_VEDANTHA;

    uint256 NumberOfCarBodiesNeeded_TATA = numberOfCarBodiesNeeded_TATA();
    uint256 NumberOfCarBodiesNeeded_MARUTHI = numberOfCarBodiesNeeded_MARUTHI();

    //Listing all the manufacturers and suppliers------------------------------------------------------

    function setTataManufacturer(
        string memory Name,
        string memory Tyres,
        string memory Body
    ) public {
        TataManufacturer.name = Name;
        TataManufacturer.supplierForTyres = Tyres;
        TataManufacturer.supplierForBody = Body;
        TataManufacturer.manufacturerAddress = msg.sender;
    }

    function setMaruthiManufacturer(
        string memory Name,
        string memory Tyres,
        string memory Body
    ) public {
        MaruthiManufacturer.name = Name;
        MaruthiManufacturer.supplierForTyres = Tyres;
        MaruthiManufacturer.supplierForBody = Body;
        MaruthiManufacturer.manufacturerAddress = msg.sender;
    }

    function setVedanthaSupplier(string memory Name) public {
        carBodySupplier.name = Name;
        carBodySupplier.carBodySupplierAddress = msg.sender;
    }

    function setMrfSupplier(string memory Name, string memory SuppliesTo)
        public
    {
        MrfCarTyreSupplier.name = Name;
        MrfCarTyreSupplier.suppliesTo = SuppliesTo;
        MrfCarTyreSupplier.carTyreSupplierAddress = msg.sender;
    }

    function setCeatSupplier(string memory Name, string memory SuppliesTo)
        public
    {
        CeatCarTyreSupplier.name = Name;
        CeatCarTyreSupplier.suppliesTo = SuppliesTo;
        CeatCarTyreSupplier.carTyreSupplierAddress = msg.sender;
    }

    // Setting supplier limits for tyres------------------------------------------------------
    // the 6 functions below have been tested

    function setCarTyreSupplierLimit_MRF(uint256 limit) public {
        require(
            msg.sender == MrfCarTyreSupplier.carTyreSupplierAddress,
            "Only MRF supplier can set the limit"
        );
        CarTyreSupplierLimit_MRF = limit;
    }

    function viewCarTyreSupplierLimit_MRF() public view returns (uint256) {
        return CarTyreSupplierLimit_MRF;
    }

    function setCarTyreSupplierLimit_CEAT(uint256 limit) public {
        require(
            msg.sender == CeatCarTyreSupplier.carTyreSupplierAddress,
            "Only CEAT supplier can set the limit"
        );
        CarTyreSupplierLimit_CEAT = limit;
    }

    function viewCarTyreSupplierLimit_CEAT() public view returns (uint256) {
        return CarTyreSupplierLimit_CEAT;
    }

    function SetCarBodySupplyLimit_VEDANTHA(uint256 limit) public {
        require(
            msg.sender == carBodySupplier.carBodySupplierAddress,
            "Only VEDANTHA supplier can set the limit"
        );
        CarBodySupplierLimit_VEDANTHA = limit;
    }

    function viewCarBodySupplyLimit_VEDANTHA() public view returns (uint256) {
        return CarBodySupplierLimit_VEDANTHA;
    }

    // car body counting------------------------------------------------------------
    // two functions below are tested

    function numberOfCarBodiesNeeded_TATA() public view returns (uint256) {
        return CarTyreSupplierLimit_MRF / 4;
    }

    function numberOfCarBodiesNeeded_MARUTHI() public view returns (uint256) {
        return CarTyreSupplierLimit_CEAT / 4;
    }
}

//Bidding contract------------------------------------------------------------------

contract BidForCarBodies is MyContract {
    enum BidResult {
        WON,
        LOST
    }

    BidResult tataResult;
    BidResult maruthiResult;

    struct Bid {
        uint256 quantity;
        uint256 amount;
    }

    uint256 carBodiesWonInAuction_TATA = 0;
    uint256 carBodiesWonInAuction_MARUTHI = 0;

    //placing for bids

    Bid CarBodySupplierBid_VEDANTHA;
    Bid CarTyreSupplierBid_MRF;
    Bid CarTyreSupplierBid_CEAT;
    Bid CarBodyManufacturerBid_TATA;
    Bid CarBodyManufacturerBid_MARUTHI;
    Bid CarTyreManufacturerBid_TATA;
    Bid CarTyreManufacturerBid_MARUTHI;

    //Supplier Bid Functions --------------------- Input ---------------------- And Outputs -----------------------
    function carBodySupplierBid(uint256 amount) public OnlyCarBodySupplier {
        CarBodySupplierBid_VEDANTHA = Bid(
            CarBodySupplierLimit_VEDANTHA,
            amount
        );
    }

    function viewCarBodySupplierBid() public view returns (Bid memory) {
        return CarBodySupplierBid_VEDANTHA;
    }

    function carTyreSupplierBid_MRF(uint256 amount) public {
        CarTyreSupplierBid_MRF = Bid(CarTyreSupplierLimit_MRF, amount);
    }

    function viewCarTyreSupplierBid_MRF() public view returns (Bid memory) {
        return CarTyreSupplierBid_MRF;
    }

    function carTyreSupplierBid_CEAT(uint256 amount) public {
        CarTyreSupplierBid_CEAT = Bid(CarTyreSupplierLimit_CEAT, amount);
    }

    function viewCarTyreSupplierBid_CEAT() public view returns (Bid memory) {
        return CarTyreSupplierBid_CEAT;
    }

    //Manufacturer Bid Functions --------------------- Input ---------------------- And Outputs -----------------------

    function carBodyManufacturerBid_TATA(string memory hashedTyreBid, string memory hashedCarBodyBid)
        public
        OnlyTATA
    {
        TataManufacturer.hashedCarBodyBid = hashedCarBodyBid;
        TataManufacturer.hashedTyreBid = hashedTyreBid;
    }

    function viewCarBodyManufacturerBid_TATA()
        public
        view
        returns (Bid memory)
    {
        return CarBodyManufacturerBid_TATA;
    }

    function carBodyManufacturerBid_MARUTHI(uint256 quantity, uint256 amount)
        public
        OnlyMaruti
    {
        CarBodyManufacturerBid_MARUTHI = Bid(quantity, amount);
    }

    function viewCarBodyManufacturerBid_MARUTHI()
        public
        view
        returns (Bid memory)
    {
        return CarBodyManufacturerBid_MARUTHI;
    }

    //Tyre Manufacturer Bid Functions --------------------- Input ---------------------- And Outputs -----------------------

    function carTyreManufacturerBid_TATA(uint256 quantity, uint256 amount)
        public
        OnlyTATA
    {
        CarTyreManufacturerBid_TATA = Bid(quantity, amount);
    }

    function viewCarTyreManufacturerBid_TATA()
        public
        view
        returns (Bid memory)
    {
        return CarTyreManufacturerBid_TATA;
    }

    function carTyreManufacturerBid_MARUTHI(uint256 quantity, uint256 amount)
        public
        OnlyMaruti
    {
        CarTyreManufacturerBid_MARUTHI = Bid(quantity, amount);
    }

    function viewCarTyreManufacturerBid_MARUTHI()
        public
        view
        returns (Bid memory)
    {
        return CarTyreManufacturerBid_MARUTHI;
    }

    //Bidding Function ---------------------------------------------
    function biddingForCarBody() public {
        uint256 carBodiesLeftForSupplier_VEDANTHA;

        if (
            CarBodyManufacturerBid_TATA.quantity >
            CarBodySupplierBid_VEDANTHA.quantity &&
            CarBodyManufacturerBid_MARUTHI.quantity >
            CarBodySupplierBid_VEDANTHA.quantity
        ) {
            tataResult = BidResult.LOST;
            maruthiResult = BidResult.LOST;
            carBodiesWonInAuction_TATA = 0;
            carBodiesWonInAuction_MARUTHI = 0;
        } else {
            if (
                CarBodyManufacturerBid_MARUTHI.quantity >
                CarBodySupplierBid_VEDANTHA.quantity &&
                CarBodyManufacturerBid_TATA.quantity <=
                CarBodySupplierBid_VEDANTHA.quantity
            ) {
                tataResult = BidResult.WON;
                maruthiResult = BidResult.LOST;
                carBodiesWonInAuction_TATA = CarBodyManufacturerBid_TATA
                    .quantity;
                carBodiesWonInAuction_MARUTHI = 0;
            } else if (
                CarBodyManufacturerBid_MARUTHI.quantity <=
                CarBodySupplierBid_VEDANTHA.quantity &&
                CarBodyManufacturerBid_TATA.quantity >
                CarBodySupplierBid_VEDANTHA.quantity
            ) {
                tataResult = BidResult.LOST;
                maruthiResult = BidResult.WON;
                carBodiesWonInAuction_TATA = 0;
                carBodiesWonInAuction_MARUTHI = CarBodyManufacturerBid_MARUTHI
                    .quantity;
            } else if (
                CarBodyManufacturerBid_MARUTHI.quantity <
                CarBodySupplierBid_VEDANTHA.quantity &&
                CarBodyManufacturerBid_TATA.quantity <
                CarBodySupplierBid_VEDANTHA.quantity
            ) {
                if (
                    CarBodyManufacturerBid_MARUTHI.quantity >
                    NumberOfCarBodiesNeeded_MARUTHI &&
                    CarBodyManufacturerBid_TATA.quantity >
                    NumberOfCarBodiesNeeded_TATA
                ) {
                    //check the algorithm for this-------------------------------------------------------------------------------------------------------
                    if (
                        CarBodyManufacturerBid_MARUTHI.quantity +
                            CarBodyManufacturerBid_TATA.quantity <=
                        CarBodySupplierBid_VEDANTHA.quantity
                    ) {
                        tataResult = BidResult.WON;
                        maruthiResult = BidResult.WON;
                        carBodiesWonInAuction_TATA = CarBodyManufacturerBid_TATA
                            .quantity;
                        carBodiesWonInAuction_MARUTHI = CarBodyManufacturerBid_MARUTHI
                            .quantity;
                    } else if (
                        NumberOfCarBodiesNeeded_MARUTHI +
                            NumberOfCarBodiesNeeded_TATA <=
                        CarBodySupplierBid_VEDANTHA.quantity
                    ) {
                        tataResult = BidResult.WON;
                        maruthiResult = BidResult.WON;
                        carBodiesWonInAuction_TATA = NumberOfCarBodiesNeeded_TATA;
                        carBodiesWonInAuction_MARUTHI = NumberOfCarBodiesNeeded_MARUTHI;

                        carBodiesLeftForSupplier_VEDANTHA =
                            CarBodySupplierBid_VEDANTHA.quantity -
                            NumberOfCarBodiesNeeded_TATA -
                            NumberOfCarBodiesNeeded_MARUTHI;

                        if (carBodiesLeftForSupplier_VEDANTHA != 0) {
                            if (
                                CarBodyManufacturerBid_MARUTHI.amount >
                                CarBodyManufacturerBid_TATA.quantity
                            ) {
                                carBodiesWonInAuction_MARUTHI += carBodiesLeftForSupplier_VEDANTHA;
                            } else {
                                carBodiesWonInAuction_TATA += carBodiesLeftForSupplier_VEDANTHA;
                            }
                        } else {
                            tataResult = BidResult.WON;
                            maruthiResult = BidResult.LOST;
                            carBodiesWonInAuction_TATA = CarBodyManufacturerBid_TATA
                                .quantity;
                            carBodiesWonInAuction_MARUTHI =
                                CarBodySupplierBid_VEDANTHA.quantity -
                                CarBodyManufacturerBid_TATA.quantity;
                        }
                    }
                } else {
                    if (
                        CarBodyManufacturerBid_MARUTHI.amount >
                        CarBodyManufacturerBid_TATA.quantity
                    ) {
                        tataResult = BidResult.LOST;
                        maruthiResult = BidResult.WON;
                        carBodiesWonInAuction_TATA =
                            CarBodySupplierBid_VEDANTHA.quantity -
                            CarBodyManufacturerBid_MARUTHI.quantity;
                        carBodiesWonInAuction_MARUTHI = CarBodyManufacturerBid_MARUTHI
                            .quantity;
                    } else {
                        tataResult = BidResult.WON;
                        maruthiResult = BidResult.LOST;
                        carBodiesWonInAuction_TATA = CarBodyManufacturerBid_TATA
                            .quantity;
                        carBodiesWonInAuction_MARUTHI =
                            CarBodySupplierBid_VEDANTHA.quantity -
                            CarBodyManufacturerBid_TATA.quantity;
                    }
                }
            } else if (
                CarBodyManufacturerBid_MARUTHI.quantity >
                NumberOfCarBodiesNeeded_MARUTHI &&
                NumberOfCarBodiesNeeded_TATA == NumberOfCarBodiesNeeded_TATA
            ) {
                tataResult = BidResult.WON;
                maruthiResult = BidResult.LOST;
                carBodiesWonInAuction_TATA = CarBodyManufacturerBid_TATA
                    .quantity;
                carBodiesWonInAuction_MARUTHI =
                    CarBodySupplierBid_VEDANTHA.quantity -
                    CarBodyManufacturerBid_TATA.quantity;
            } else if (
                CarBodyManufacturerBid_MARUTHI.quantity ==
                NumberOfCarBodiesNeeded_MARUTHI &&
                CarBodyManufacturerBid_TATA.quantity >
                NumberOfCarBodiesNeeded_TATA
            ) {
                tataResult = BidResult.LOST;
                maruthiResult = BidResult.WON;
                carBodiesWonInAuction_TATA =
                    CarBodySupplierBid_VEDANTHA.quantity -
                    CarBodyManufacturerBid_MARUTHI.quantity;
                carBodiesWonInAuction_MARUTHI = CarBodyManufacturerBid_MARUTHI
                    .quantity;
            } else if (
                (CarBodyManufacturerBid_MARUTHI.quantity ==
                    NumberOfCarBodiesNeeded_MARUTHI &&
                    CarBodyManufacturerBid_TATA.quantity ==
                    NumberOfCarBodiesNeeded_TATA) ||
                (CarBodyManufacturerBid_MARUTHI.quantity <
                    NumberOfCarBodiesNeeded_MARUTHI &&
                    CarBodyManufacturerBid_TATA.quantity ==
                    NumberOfCarBodiesNeeded_TATA) ||
                (CarBodyManufacturerBid_MARUTHI.quantity ==
                    NumberOfCarBodiesNeeded_MARUTHI &&
                    CarBodyManufacturerBid_TATA.quantity <
                    NumberOfCarBodiesNeeded_TATA) ||
                (CarBodyManufacturerBid_MARUTHI.quantity <
                    NumberOfCarBodiesNeeded_MARUTHI &&
                    CarBodyManufacturerBid_TATA.quantity <
                    NumberOfCarBodiesNeeded_TATA)
            ) {
                if (
                    CarBodyManufacturerBid_MARUTHI.amount >
                    CarBodyManufacturerBid_TATA.quantity
                ) {
                    tataResult = BidResult.LOST;
                    maruthiResult = BidResult.WON;
                    carBodiesWonInAuction_TATA =
                        CarBodySupplierBid_VEDANTHA.quantity -
                        CarBodyManufacturerBid_MARUTHI.quantity;
                    carBodiesWonInAuction_MARUTHI = CarBodyManufacturerBid_MARUTHI
                        .quantity;
                } else {
                    tataResult = BidResult.WON;
                    maruthiResult = BidResult.LOST;
                    carBodiesWonInAuction_TATA = CarBodyManufacturerBid_TATA
                        .quantity;
                    carBodiesWonInAuction_MARUTHI =
                        CarBodySupplierBid_VEDANTHA.quantity -
                        CarBodyManufacturerBid_TATA.quantity;
                }
            }
        }
    }

    function viewBidResult() public view returns (BidResult, BidResult) {
        return (tataResult, maruthiResult);
    }
}
