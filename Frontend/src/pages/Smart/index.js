


import React from 'react' ;
import { useEffect,  useMemo , useState } from 'react';

import { GetGreetString } from '../../redux/actions/greet';
import PropType from 'prop-types' ;
import { connect } from 'react-redux';

import { useWeb3React } from "@web3-react/core";
import { ethers } from 'ethers';
import { ERC20_ADDR , injected , BLOCK_CONFIRMATION_THRESHOLD, LOTTERY_ADDR, PROVIDER } from '../../constants';
import ERC20_ABI from '../../constants/abis/erc20.json' ;
import LOTTERY_ABI from '../../constants/abis/lottery.json';

const useERC20Contract = () => {
    const { library , active } = useWeb3React() ;

    return useMemo(() => {
        if(!active) {
            return null ;
        }

        return new ethers.Contract(ERC20_ADDR , ERC20_ABI , library.getSigner()) ;
    })
}

const useLotteryContract = () => {
    const { library , active } = useWeb3React() ;

    return useMemo(() => {
        if(!active) {
            return null ;
        }

        return new ethers.Contract(LOTTERY_ADDR , LOTTERY_ABI , library.getSigner()) ;
    })
}

const Smart = (props) => {

    const Erc20 = useERC20Contract() ;
    const Lottery = useLotteryContract();

    const { active, account, chainId, library, activate } = useWeb3React();
    const [ethBalance , setEthBalance] = useState(0.0) ;

    const [time, setTime] = useState(0);
    const [amount, setAmount] = useState(0);

    const connectToGreetContract = () => {
        console.log("connect");
        const ethereum = window.ethereum;

        if (!ethereum || typeof ethereum.isMetaMask === "undefined"){
            alert("MetaMask is not installed. Please install MetaMask and try again.");
            return;
        } else {
            console.log("here") ;
            activate(injected);
        }
    }

    const create_lottery = async () => {
        if (!active) {
            return;
        }
        
        try {
            await Erc20.approve(LOTTERY_ADDR,  ethers.utils.parseUnits("0.1").toString(), { nonce: 0, gasLimit:250000 });

            const txReceipt = await Lottery.CreateLottery(time, { nonce: 0, gasLimit:250000});
            await library.waitForTransaction(txReceipt.hash, BLOCK_CONFIRMATION_THRESHOLD);
            // await _fetchTokenBalance()
            console.log(txReceipt);
            let provider = new ethers.providers.JsonRpcProvider(PROVIDER);
            provider.once(txReceipt.hash, async (transaction) => {
                // Emitted when the transaction has been mined
                console.log( transaction.logs[0]);
            });
        } catch (ex) {

            console.log('tx', ex.transaction);
            console.log('tx', ex);
        }
    }

    const add_wager = async () => {
        if (!active) {
            return;
        }
        
        try {
            const txReceipt = await Lottery.AddWager(1, amount, { nonce: 0, gasLimit:250000});
            await library.waitForTransaction(txReceipt.hash, BLOCK_CONFIRMATION_THRESHOLD);
            // await _fetchTokenBalance()
            console.log(txReceipt);
        } catch (ex) {
            console.log('tx', ex.transaction);
            console.log('tx', ex);
        }
    }

    const choose_winner = async () => {
        if (!active) {
            return;
        }
        
        try {
            const txReceipt = await Lottery.ChooseWinner(1, { nonce: 0, gasLimit:2500000});
            await library.waitForTransaction(txReceipt.hash, BLOCK_CONFIRMATION_THRESHOLD);
            // await _fetchTokenBalance()
            console.log(txReceipt);
            let provider = new ethers.providers.JsonRpcProvider(PROVIDER);
            provider.once(txReceipt.hash, async (transaction) => {
                // Emitted when the transaction has been mined
                console.log( transaction);
            });
        } catch (ex) {
            console.log('tx', ex.transaction);
            console.log('tx', ex);
        }
    }
    
    const get_winner = async () => {
        if (!active) {
            return;
        }
        
        try {
            const txReceipt = await Lottery.getWinner(1, { nonce: 0, gasLimit:2500000});
            await library.waitForTransaction(txReceipt.hash, BLOCK_CONFIRMATION_THRESHOLD);
            // await _fetchTokenBalance()
            console.log(txReceipt);
            let provider = new ethers.providers.JsonRpcProvider(PROVIDER);
            provider.once(txReceipt.hash, async (transaction) => {
                // Emitted when the transaction has been mined
                console.log(transaction.logs[0].topics[1]);
            });
        } catch (ex) {
            console.log('tx', ex.transaction);
            console.log('tx', ex);
        }
    }
    const transfer_link = async () => {
        if (!active) {
            return;
        }
        
        try {

            const txReceipt = await Lottery.transferLink({ nonce: 0, gasLimit:2500000});
            await library.waitForTransaction(txReceipt.hash, BLOCK_CONFIRMATION_THRESHOLD);
            // await _fetchTokenBalance()
            console.log(txReceipt);
        } catch (ex) {
            console.log('tx', ex.transaction);
            console.log('tx', ex);
        }
    }
    const get_random_number = async () => {
        if (!active) {
            return;
        }
        
        try {
            const txReceipt = await Lottery.getRandomNumber({ nonce: 0, gasLimit:2500000});
            await library.waitForTransaction(txReceipt.hash, BLOCK_CONFIRMATION_THRESHOLD);
            // await _fetchTokenBalance()
            console.log(txReceipt);
        } catch (ex) {
            console.log('tx', ex.transaction);
            console.log('tx', ex);
        }
    }
    return (
        <>
            <button type="button" onClick={() => connectToGreetContract() } >Connect Lottery</button>
            <br/>
            <br/>
            Time(minites): <input type='text' value={time} onChange={(e) => setTime(e.target.value)} />
            <br/>
            <br/>
            <button type="button" onClick={() => create_lottery() } >Create Lottery </button>
            <br/>
            <br/>
            Amount: <input type='text' value={amount} onChange={(e) => setAmount(e.target.value)} />
            <br/>
            <br/>
            <button type="button" onClick={() => add_wager() } >Add Wager </button>
            <br/>
            <br/>
            <button type="button" onClick={() => choose_winner() } > Choose Winner </button>
            <br/>
            <br/>
            <button type="button" onClick={() => get_winner() } >Get Winner </button>
        </>
    )
}

Smart.propsType = {
    GetGreetString : PropType.func.isRequired ,
    greetStr : PropType.string
}

const mapStateToProps = (state) => {
    return {
        greetStr : state.greet.greetingStr
    }
}
const mapDispatchToProps = {
    GetGreetString
}

export default connect(mapStateToProps , mapDispatchToProps)(Smart) ;