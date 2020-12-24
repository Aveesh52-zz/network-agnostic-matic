import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import Web3 from 'web3'
import Token from '../abi/erc20.json';
import Biconomy from "@biconomy/mexa";
import { Button, Form , Input,Card, Icon, Image } from 'semantic-ui-react';
let sigUtil = require("eth-sig-util");

const domainType = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "chainId", type: "uint256" },
  { name: "verifyingContract", type: "address" }
];

const metaTransactionType = [
  { name: "nonce", type: "uint256" },
  { name: "from", type: "address" },
  { name: "functionSignature", type: "bytes" }
];

let domainData = {
  name: "erc20",
  version: "1",
  chainId:"80001",
  verifyingContract:"0x26507AbcE1C604a8116896FA44B823E74f6c9533"
  
};

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
   
  }

  async loadWeb3() {
    
    
    const biconomy = new Biconomy(window.ethereum,{dappId:"c1536486-660e-45e3-9afc-0204787ebc01",apiKey:"2_nlU66Fd.56497743-f42d-4f05-be11-e2eef6f911cb", debug:true});
   const web3 = new Web3(biconomy);
   this.setState({web3:web3});
    console.log(biconomy);

    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    console.log(this.state.account);

    // const ethBalance = await web3.eth.getBalance(this.state.account)
    // this.setState({ ethBalance })
    // console.log(ethBalance);

    // // Load Token
    // const networkId =  await web3.eth.net.getId()
 
   
    biconomy.onEvent(biconomy.READY, () => {
      const ethSwap = this.state.web3.eth.Contract(Token, "0x26507AbcE1C604a8116896FA44B823E74f6c9533");
      this.setState({ ethSwap:ethSwap });
      console.log(this.state.ethSwap);

    console.log(this.state.ethSwap);
    console.log("Sending meta transaction");
    let userAddress = this.state.account;
    console.log(this.state.ethSwap);
    let nonce =  this.state.ethSwap.methods.getNonce(this.state.account).call();
    console.log(nonce);
    // let nonce = 1;
    let functionSignature = this.state.ethSwap.methods.transfer(this.state.accounts,this.state.amount).encodeABI();
    console.log(functionSignature);
    let message = {};
    message.nonce = parseInt(nonce);
    message.from = userAddress;
    message.functionSignature = functionSignature;
    const dataToSign = JSON.stringify ({
      types: {
        EIP712Domain: domainType,
        MetaTransaction: metaTransactionType
      }, 
      domain: domainData,
      primaryType: "MetaTransaction",
      message: message
    });
    console.log(domainData);
    console.log();  
    this.state.web3.currentProvider.send(
      {
        jsonrpc: "2.0",
        id: 999999999999,
        method: "eth_signTypedData_v4",
        params: [userAddress, dataToSign]
      },
      function(error, response) {
        console.info(`User signature is ${response.result}`);
        if (error || (response && response.error)) {
          console.log("Could not get user signature");
        } else if (response && response.result) {
          let { r, s, v } = this.getSignatureParameters(response.result);
          console.log(userAddress);
          console.log(JSON.stringify(message));
          console.log(message);
          console.log(this.getSignatureParameters(response.result));

          const recovered = sigUtil.recoverTypedSignature_v4({
            data: JSON.parse(dataToSign),
            sig: response.result
          });
          console.log(`Recovered ${recovered}`);
          this.sendSignedTransaction(userAddress, functionSignature, r, s, v);
        }
      }
    );


      


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
      loading: true,
      accounts:"0xFbFdFBD11049907276F15cd1DCB94A47A62D6074",
      accounts1:"",
      amount:"1",
      amount1:"",
      web3:{}
    }

      this.onSubmit = this.onSubmit.bind(this);
      
      this.onSubmit1 = this.onSubmit1.bind(this);

      this.handleChange = this.handleChange.bind(this);
     this.getSignatureParameters = this.getSignatureParameters.bind(this);
     this.sendSignedTransaction = this.sendSignedTransaction.bind(this);
  }



  async onSubmit() {
      
      if (1) {
        console.log("Sending meta transaction");
        let userAddress = this.state.account;
        let nonce = await this.state.ethSwap.methods.getNonce("0x720E1fa107A1Df39Db4E78A3633121ac36Bec132").call();
        console.log(nonce);
        let functionSignature = this.state.ethSwap.methods.transfer(this.state.accounts,this.state.amount).encodeABI();
        console.log(functionSignature);
        let message = {};
        message.nonce = parseInt(nonce);
        message.from = userAddress;
        message.functionSignature = functionSignature;

        const dataToSign = JSON.stringify({
          types: {
            EIP712Domain: domainType,
            MetaTransaction: metaTransactionType
          }, 
          domain: domainData,
          primaryType: "MetaTransaction",
          message: message
        });
        console.log(domainData);
        console.log();  
        this.state.web3.currentProvider.send(
          {
            jsonrpc: "2.0",
            id: 999999999999,
            method: "eth_signTypedData_v4",
            params: [userAddress, dataToSign]
          },
          function(error, response) {
            console.info(`User signature is ${response.result}`);
            if (error || (response && response.error)) {
              console.log("Could not get user signature");
            } else if (response && response.result) {
              let { r, s, v } = this.getSignatureParameters(response.result);
              console.log(userAddress);
              console.log(JSON.stringify(message));
              console.log(message);
              console.log(this.getSignatureParameters(response.result));

              const recovered = sigUtil.recoverTypedSignature_v4({
                data: JSON.parse(dataToSign),
                sig: response.result
              });
              console.log(`Recovered ${recovered}`);
              this.sendSignedTransaction(userAddress, functionSignature, r, s, v);
            }
          }
        );
      } else {
        console.log("Sending normal transaction");
        // contract.methods
        //   .setQuote(newQuote)
        //   .send({ from: selectedAddress })
        //   .on("transactionHash", function(hash) {
        //     showInfoMessage(`Transaction sent to blockchain with hash ${hash}`);
        //   })
        //   .once("confirmation", function(confirmationNumber, receipt) {
        //     setTransactionHash(receipt.transactionHash);
        //     showSuccessMessage("Transaction confirmed");
        //     getQuoteFromNetwork();
        //   });
      }
    
  };

 async getSignatureParameters(signature){
    if (!this.state.web3.utils.isHexStrict(signature)) {
      throw new Error(
        'Given value "'.concat(signature, '" is not a valid hex string.')
      );
    }
    var r = signature.slice(0, 66);
    var s = "0x".concat(signature.slice(66, 130));
    var v = "0x".concat(signature.slice(130, 132));
    v = this.state.web3.utils.hexToNumber(v);
    if (![27, 28].includes(v)) v += 27;
    return {
      r: r,
      s: s,
      v: v
    };
  };


  async sendSignedTransaction(userAddress, functionData, r, s, v) {
    if (this.state.web3 && this.state.ethSwap) {
      try {
        let gasLimit = await this.state.ethSwap.methods
          .executeMetaTransaction(userAddress, functionData, r, s, v)
          .estimateGas({ from: userAddress });
        let gasPrice = await this.state.web3.eth.getGasPrice();
        console.log(gasLimit);
        console.log(gasPrice);
        let tx = this.state.ethSwap.methods
          .executeMetaTransaction(userAddress, functionData, r, s, v)
          .send({
            from: userAddress,
            gasPrice:gasPrice,
            gasLimit:gasLimit
          });

        tx.on("transactionHash", function(hash) {
          console.log(`Transaction hash is ${hash}`);
          console.log(`Transaction sent by relayer with hash ${hash}`);
        }).once("confirmation", function(confirmationNumber, receipt) {
          console.log(receipt);
          console.log(receipt.transactionHash);
          console.log("Transaction confirmed on chain");
    
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  // async onSubmit() {
  //   console.log(this.state.accounts);

  //   console.log(this.state.amount);
  // }
  async onSubmit1() {

    console.log(this.state.accounts1);

    console.log(this.state.amount1);
  }

  handleChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value })
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
      name="accounts1">
      <label>Address</label>
      <input placeholder='Name' />
    </Form.Field>
    <Form.Field
      control={Input}
      onChange={this.handleChange}
      name="amount1">
      <label>Amount</label>
      <input placeholder='Amount' />
    </Form.Field>
          <Button variant="contained" color="primary" onClick={this.onSubmit1}>
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
