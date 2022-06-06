import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import {useWeb3React} from "@web3-react/core";
import { InjectedConnector } from '@web3-react/injected-connector'
import { Contract } from "@ethersproject/contracts";
import counterAbi from './contracts/counter.abi.json';
const counterContractAddress = '0x8Dc3082125f8ec58dc10b66A8a229bDc5Fb5b381';

function App() {
  const { active, activate, library, account } = useWeb3React()
  const [count, setCount] = useState(0)
  const [contract, setContract] = useState(null)


  const MetaMask = new InjectedConnector({ supportedChainIds: [44787, 4] })

  useEffect(() => {
    if (!active) {
      connectWeb3AndConnectContract()
    }
  }, [active, library, activate])

  useEffect(() => {
    fetchCount()
  }, [contract])

  // connect the user to metamask
  const connectWeb3AndConnectContract = async () => {
    await activate(MetaMask, handleError)
    const contract = new Contract(counterContractAddress, counterAbi, library)
    setContract(contract)
  }

  const handleError =(err) => {
    // handle error here
    console.log({err})
  }


  //smart contract calls

  const incrementCounter = async () => {
    const writeContract = new Contract(counterContractAddress, counterAbi, library.getSigner())
   const tx = await writeContract.incrementCounter()
   await tx.wait()
    fetchCount()
  }

  const decrementCounter = async () => {
    const writeContract = new Contract(counterContractAddress, counterAbi, library.getSigner())
    const tx =await writeContract.decrementCounter()
    await tx.wait()
    fetchCount()
  }

  const fetchCount = async () => {
    const newContract = new Contract(counterContractAddress, counterAbi, library)
    const count = await newContract.get()

    //set count and change from big number
    setCount(count.toString())
  }

  const resetCounter = async () => {

    const writeContract = new Contract(counterContractAddress, counterAbi, library.getSigner())
    const tx = await writeContract.reset()
    await tx.wait()
    fetchCount()

  }



  return (
    <div className="App">
    {!active ? (
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
            <p>
              Connect to MetaMask .
            </p>
            <a
                className="App-link"
                href={null}
                style={{
                  cursor: 'pointer',
                }}
                rel="noopener noreferrer"
                onClick={connectWeb3AndConnectContract}
            >
              Connect
            </a>
          </header>

      ) : (
          <>
          <h1>Welcome to Celo 101</h1>
            <p>Your Address: {account}</p>

            <div>
              <p>Count : {count}</p>
            </div>


            <div style={{ margin : '5px'}}>

              <button onClick={incrementCounter}> Increment Count</button>
              <button onClick={decrementCounter}> Decrement Count</button>
            </div>
            <div>

              <button onClick={resetCounter}> Reset Count</button>
            </div>
          </>


      )
      }
    </div>
  );
}

export default App;
