// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

import "./SortitionSumTreeFactory.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract Lottery is VRFConsumerBase {
    /* Storage */

    using SortitionSumTreeFactory for SortitionSumTreeFactory.SortitionSumTrees;
    SortitionSumTreeFactory.SortitionSumTrees internal lotteries;

    uint lottery_count;
    uint current_game;

    bytes32 internal keyHash;
    uint256 internal fee;

    address private owner;
    address public winner;
    uint256 public randomResult;

    constructor() 
        VRFConsumerBase(
            0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9, // VRF Coordinator
            0xa36085F69e2889c224210F603D836748e7dC0088  // LINK Token
        ) public {
        owner = 0x7b61947Ea4655625D572011B918975E005Fa58D9;
        keyHash = 0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4;
        fee = 0.1 * 10 ** 18; // 0.1 LINK
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Lottery: sender isn't the Owner");
        _;
    }

    event GameStarted(uint indexed gameIndex);
    event ReturnWinner(address indexed winner);

    function CreateLottery(uint256 _duration) public onlyOwner {
        lotteries.createTree(++ lottery_count, 2, _duration);
        LINK.transferFrom(msg.sender, address(this), fee);
        emit GameStarted(lottery_count);
    }

    function AddWager(uint _key, uint256 _amount) public {
        if(lotteries.isGameOver(_key)) {
            ChooseWinner(_key);
            return;
        }
        lotteries.set(_key, _amount, msg.sender);
    }

    function ChooseWinner(uint _key) public onlyOwner {
        require(lotteries.isGameOver(_key), "Lottery not finished yet");
        require(!lotteries.isWinnerSelected(_key), "Already Selected");

        current_game = _key;
        getRandomNumber();
    }
    
    function getRandomNumber() public returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
        return requestRandomness(keyHash, fee);
    }

    /**
     * Callback function used by VRF Coordinator
     */
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        randomResult = randomness;
        uint256 total = lotteries.total(current_game);
        uint256 _value = (randomness % total) + 1;
        winner = lotteries.draw(current_game, _value);
        lotteries.setWinner(current_game, winner);
        emit ReturnWinner(winner);
    }

    function getWinner(uint _key) public {
        winner = lotteries.getWinner(_key);
        emit ReturnWinner(winner);
    }
    
    function withdrawLink() external {
        require(LINK.transfer(msg.sender, LINK.balanceOf(address(this))), "Unable to transfer");
    }
}