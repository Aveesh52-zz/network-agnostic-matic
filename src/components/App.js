import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import Web3 from 'web3'
import Token from '../abi/erc20.json';
import Biconomy from "@biconomy/mexa";

import { Button, Form , Input,Card, Icon, Image } from 'semantic-ui-react'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
   
  }

  async loadWeb3() {
    
    
    const biconomy = new Biconomy(window.ethereum,{apiKey:"2_nlU66Fd.56497743-f42d-4f05-be11-e2eef6f911cb", debug:true});
   const web3 = new Web3(biconomy);
    console.log(biconomy);

    // const accounts = await web3.eth.getAccounts()
    // this.setState({ account: accounts[0] })
    // console.log(accounts[0]);

    // const ethBalance = await web3.eth.getBalance(this.state.account)
    // this.setState({ ethBalance })
    // console.log(ethBalance);

    // // Load Token
    // const networkId =  await web3.eth.net.getId()
 
   
    biconomy.onEvent(biconomy.READY, () => {
      const ethSwap = new web3.eth.Contract(Token, "0x1e8d7CdB4c4Ce199260230E5754764EBC9F36AaF");
      this.setState({ ethSwap })
      console.log(this.state.ethSwap);
    }).onEvent(biconomy.ERROR, (error, message) => {
      // Handle error while initializing mexa
      console.log(error)
    });



    
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      token: {},
      ethSwap: {},
      ethBalance: '0',
      tokenBalance: '0',
      loading: true
    }

    this.onSubmit = this.onSubmit.bind(this);
    // this.getSignatureParameters = this.getSignatureParameters.bind(this);
    // this.sendSignedTransaction = this.sendSignedTransaction.bind(this);
  }



  // async onSubmit(event) {
  //   if (newQuote != "" && contract) {
  //     setTransactionHash("");
  //     if (metaTxEnabled) {
  //       console.log("Sending meta transaction");
  //       let userAddress = selectedAddress;
  //       let nonce = await contract.methods.getNonce(userAddress).call();
  //       let functionSignature = contract.methods.Trasfer(newQuote).encodeABI();
  //       let message = {};
  //       message.nonce = parseInt(nonce);
  //       message.from = userAddress;
  //       message.functionSignature = functionSignature;

  //       const dataToSign = JSON.stringify({
  //         types: {
  //           EIP712Domain: domainType,
  //           MetaTransaction: metaTransactionType
  //         },
  //         domain: domainData,
  //         primaryType: "MetaTransaction",
  //         message: message
  //       });
  //       console.log(domainData);
  //       console.log();
  //       web3.currentProvider.send(
  //         {
  //           jsonrpc: "2.0",
  //           id: 999999999999,
  //           method: "eth_signTypedData_v4",
  //           params: [userAddress, dataToSign]
  //         },
  //         function(error, response) {
  //           console.info(`User signature is ${response.result}`);
  //           if (error || (response && response.error)) {
  //             showErrorMessage("Could not get user signature");
  //           } else if (response && response.result) {
  //             let { r, s, v } = getSignatureParameters(response.result);
  //             console.log(userAddress);
  //             console.log(JSON.stringify(message));
  //             console.log(message);
  //             console.log(getSignatureParameters(response.result));

  //             const recovered = sigUtil.recoverTypedSignature_v4({
  //               data: JSON.parse(dataToSign),
  //               sig: response.result
  //             });
  //             console.log(`Recovered ${recovered}`);
  //             sendSignedTransaction(userAddress, functionSignature, r, s, v);
  //           }
  //         }
  //       );
  //     } else {
  //       console.log("Sending normal transaction");
  //       contract.methods
  //         .setQuote(newQuote)
  //         .send({ from: selectedAddress })
  //         .on("transactionHash", function(hash) {
  //           showInfoMessage(`Transaction sent to blockchain with hash ${hash}`);
  //         })
  //         .once("confirmation", function(confirmationNumber, receipt) {
  //           setTransactionHash(receipt.transactionHash);
  //           showSuccessMessage("Transaction confirmed");
  //           getQuoteFromNetwork();
  //         });
  //     }
  //   } else {
  //     showErrorMessage("Please enter the quote");
  //   }
  // };

  // async getSignatureParameters(signature){
  //   if (!web3.utils.isHexStrict(signature)) {
  //     throw new Error(
  //       'Given value "'.concat(signature, '" is not a valid hex string.')
  //     );
  //   }
  //   var r = signature.slice(0, 66);
  //   var s = "0x".concat(signature.slice(66, 130));
  //   var v = "0x".concat(signature.slice(130, 132));
  //   v = web3.utils.hexToNumber(v);
  //   if (![27, 28].includes(v)) v += 27;
  //   return {
  //     r: r,
  //     s: s,
  //     v: v
  //   };
  // };


  // async sendSignedTransaction(userAddress, functionData, r, s, v) {
  //   if (web3 && contract) {
  //     try {
  //       let gasLimit = await contract.methods
  //         .executeMetaTransaction(userAddress, functionData, r, s, v)
  //         .estimateGas({ from: userAddress });
  //       let gasPrice = await web3.eth.getGasPrice();
  //       console.log(gasLimit);
  //       console.log(gasPrice);
  //       let tx = contract.methods
  //         .executeMetaTransaction(userAddress, functionData, r, s, v)
  //         .send({
  //           from: userAddress,
  //           gasPrice:gasPrice,
  //           gasLimit:gasLimit
  //         });

  //       tx.on("transactionHash", function(hash) {
  //         console.log(`Transaction hash is ${hash}`);
  //         showInfoMessage(`Transaction sent by relayer with hash ${hash}`);
  //       }).once("confirmation", function(confirmationNumber, receipt) {
  //         console.log(receipt);
  //         setTransactionHash(receipt.transactionHash);
  //         showSuccessMessage("Transaction confirmed on chain");
  //         getQuoteFromNetwork();
  //       });
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // };

  async onSubmit() {
    console.log("Hey");
  }


  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
          
            target="_blank"
            rel="noopener noreferrer"
          >
          Network agnostic
          </a>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
            
            <h5>Network agnostic</h5>
            
       <div className="col">
        
       <h5>Transfer</h5>
          <Form.Field
      control={Input}
      onChange={this.handleChange}
      name="accounts">
      <label>Address</label>
      <input placeholder='Name' />
    </Form.Field>
    <Form.Field
      control={Input}
      onChange={this.handleChange}
      name="amount">
      <label>Amount</label>
      <input placeholder='Amount' />
    </Form.Field>
          <Button variant="contained" color="primary" onClick={this.onSubmit}>
              Submit
            </Button>

        </div>
         <div className="col">
    
         <h5>Approve</h5>
          <Form.Field
      control={Input}
      onChange={this.handleChange}
      name="accounts">
      <label>Address</label>
      <input placeholder='Name' />
    </Form.Field>
    <Form.Field
      control={Input}
      onChange={this.handleChange}
      name="amount">
      <label>Amount</label>
      <input placeholder='Amount' />
    </Form.Field>
          <Button variant="contained" color="primary" onClick={this.onSubmit}>
              Submit
            </Button>

           </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
