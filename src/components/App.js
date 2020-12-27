import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import Web3 from 'web3'
import Token from '../abi/erc20.json';
import Biconomy from "@biconomy/mexa";
import { Button, Form , Input,Card, Icon, Image } from 'semantic-ui-react';
import { use } from 'chai';
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
  verifyingContract:"0x6690C139564144b27ebABA71F9126611a23A31C9"
  
};

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
   
  }

  async loadWeb3() {

    if (
      typeof window.ethereum !== "undefined" &&
      window.ethereum.isMetaMask
    ) {
      // Ethereum user detected. You can now use the provider.
        const provider = window["ethereum"];
        console.log(provider);
        await provider.enable();
        if (provider.networkVersion == "80001") {
          domainData.chainId = 80001;
          const biconomy = new Biconomy(window.ethereum,{apiKey:"dPkAgLK-5.58ceb80e-a15d-407e-b353-0393cbcc128a", debug:true, strictMode:true}  );
  
        const web3 = new Web3(biconomy);
        this.setState({web3:web3});
          const accounts = await web3.eth.getAccounts()
           this.setState({ account: accounts[0] })
           console.log(this.state.account);

        biconomy.onEvent(biconomy.READY, () => {
          // Initialize your dapp here like getting user accounts etc
          const ethSwap =  this.state.web3.eth.Contract(Token, "0x6690C139564144b27ebABA71F9126611a23A31C9");
          this.setState({ ethSwap:ethSwap });
          console.log(this.state.ethSwap);
          let bal =  this.state.ethSwap.methods
          .balanceOf(this.state.account)
         .estimateGas({from:this.state.account});
         console.log(bal);

         console.log(this.state.accounts);

        console.log("Sending meta transaction");
        let userAddress = this.state.account;
        console.log(this.state.ethSwap);
        // let nonce =  this.state.ethSwap.methods.getNonce(this.state.account).call();
        // console.log(nonce);
      //  let nonce = 0;
      //   let functionSignature = this.state.ethSwap.methods.transfer(this.state.accounts,this.state.amount).encodeABI();
      //   console.log(functionSignature);
      //   let message = {};
      //   message.nonce = parseInt(nonce);
      //   message.from = userAddress;
      //   message.functionSignature = functionSignature;
      //   const dataToSign = JSON.stringify ({
      //     types: {
      //       EIP712Domain: domainType,
      //       MetaTransaction: metaTransactionType
      //     }, 
      //     domain: domainData,
      //     primaryType: "MetaTransaction",
      //     message: message
      //   });
      //   console.log(domainData); 
      //   console.log(dataToSign);
      //   this.state.web3.currentProvider.send(
      //     {
      //       jsonrpc: "2.0",
      //       id: 999999999999,
      //       method: "eth_signTypedData_v4",
      //       params: [userAddress, dataToSign]
      //     },
      //      (error, response) => {
      //       console.info(`User signature is ${response.result}`);
      //       if (error || (response && response.error)) {
      //         console.log("Could not get user signature");
      //       } else if (response && response.result) {
      //         let { r, s, v } = this.getSignatureParameters(response.result);
      //         console.log(userAddress);
      //         console.log(JSON.stringify(message));
      //         console.log(message);
      //         console.log(this.getSignatureParameters(response.result));
    
      //         const recovered = sigUtil.recoverTypedSignature_v4({
      //           data: JSON.parse(dataToSign),
      //           sig: response.result
      //         });
      //         console.log(`Recovered ${recovered}`);
      //         this.sendSignedTransaction(userAddress, functionSignature, r, s, v);
      //       }
      //     }
      //   );
    
        }).onEvent(biconomy.ERROR, (error, message) => {
          // Handle error while initializing mexa
        });
      } else {
         console.log("Please change the network in metamask to Mumbai Testnet");
      }
    } else {
      console.log("Metamask not installed");
    }
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
      accounts:"",
      accounts1:"",
      amount:"",
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
        console.log(this.state.ethSwap);
        console.log(this.state.account);
      
        // const ethSwap =  new this.state.web3.eth.Contract(Token, "0x26507AbcE1C604a8116896FA44B823E74f6c9533");
        let nonce = await this.state.ethSwap.methods.getNonce(this.state.account).call({from:this.state.account});
        console.log(nonce);
        // let nonce = 1;
        let functionSignature = this.state.ethSwap.methods.approve(this.state.accounts , this.state.amount).encodeABI();
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
        console.log(dataToSign);  
        console.log(userAddress);
        // let result = await this.state.web3.currentProvider.send(
        //  { 
        //     method: "eth_signTypedData_v4",
        //     params: [userAddress, dataToSign],
        //     id: 999999999999,
        //     jsonrpc: "2.0"
        //     //method:"eth_signTypedData_v3",
        // });
        // console.log(result);

        // const dataToSign = getTypedData({
        //   name: 'prueba',
        //   version: '1',
        //   salt: '0x0000000000000000000000000000000000000000000000000000000000013881',
        //   verifyingContract: tokenAddresses["80001"],
        //   nonce: parseInt(_nonce),
        //   from: accounts[0],
        //   functionSignature: functionSig
        // })
        const msgParams = [userAddress, dataToSign]
        let sign = await window.ethereum.request ({
          method: 'eth_signTypedData_v4', 
          params: msgParams
        });
        console.log(sign);

        let { r, s, v } = await this.getSignatureParameters(sign);
   
        console.log(r);
        console.log(s);
        console.log(v);

     
        let output = await this.sendSignedTransaction(userAddress, functionSignature, r, s, v);
        console.log(output);




        // this.state.web3.currentProvider.send(
        //   {
        //     jsonrpc: "2.0",
        //     id: 999999999999,
        //     method: "eth_signTypedData_v4",
        //     params: [userAddress, dataToSign]
        //   },
        //   function(error, response) {
        //     console.info(`User signature is ${response.result}`);
        //     if (error || (response && response.error)) {
        //       console.log("Could not get user signature");
        //     } else if (response && response.result) {
        //       let { r, s, v } = this.getSignatureParameters(response.result);
        //       console.log(userAddress);
        //       console.log(JSON.stringify(message));
        //       console.log(message);
        //       console.log(this.getSignatureParameters(response.result));

        //       const recovered = sigUtil.recoverTypedSignature_v4({
        //         data: JSON.parse(dataToSign),
        //         sig: response.result
        //       });
        //       console.log(`Recovered ${recovered}`);
        //       this.sendSignedTransaction(userAddress, functionSignature, r, s, v);
        //     }
        //   }
        // );
      } else {
        console.log("Sending normal transaction");
    
      }
    
  };


  async onSubmit1() {
      
    if (1) {
      console.log("Sending meta transaction");
      let userAddress = this.state.account;
      console.log(this.state.ethSwap);
      console.log(this.state.account);
    
      // const ethSwap =  new this.state.web3.eth.Contract(Token, "0x26507AbcE1C604a8116896FA44B823E74f6c9533");
      let nonce = await this.state.ethSwap.methods.getNonce(this.state.account).call({from:this.state.account});
      console.log(nonce);
      // let nonce = 1;
      let functionSignature = this.state.ethSwap.methods.transfer(this.state.accounts , this.state.amount).encodeABI();
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
      console.log(dataToSign);  
      console.log(userAddress);
      // let result = await this.state.web3.currentProvider.send(
      //  { 
      //     method: "eth_signTypedData_v4",
      //     params: [userAddress, dataToSign],
      //     id: 999999999999,
      //     jsonrpc: "2.0"
      //     //method:"eth_signTypedData_v3",
      // });
      // console.log(result);

      // const dataToSign = getTypedData({
      //   name: 'prueba',
      //   version: '1',
      //   salt: '0x0000000000000000000000000000000000000000000000000000000000013881',
      //   verifyingContract: tokenAddresses["80001"],
      //   nonce: parseInt(_nonce),
      //   from: accounts[0],
      //   functionSignature: functionSig
      // })
      const msgParams = [userAddress, dataToSign]
      let sign = await window.ethereum.request ({
        method: 'eth_signTypedData_v4', 
        params: msgParams
      });
      console.log(sign);

      let { r, s, v } = await this.getSignatureParameters(sign);
 
      console.log(r);
      console.log(s);
      console.log(v);

   
      let output = await this.sendSignedTransaction(userAddress, functionSignature, r, s, v);
      console.log(output);




      // this.state.web3.currentProvider.send(
      //   {
      //     jsonrpc: "2.0",
      //     id: 999999999999,
      //     method: "eth_signTypedData_v4",
      //     params: [userAddress, dataToSign]
      //   },
      //   function(error, response) {
      //     console.info(`User signature is ${response.result}`);
      //     if (error || (response && response.error)) {
      //       console.log("Could not get user signature");
      //     } else if (response && response.result) {
      //       let { r, s, v } = this.getSignatureParameters(response.result);
      //       console.log(userAddress);
      //       console.log(JSON.stringify(message));
      //       console.log(message);
      //       console.log(this.getSignatureParameters(response.result));

      //       const recovered = sigUtil.recoverTypedSignature_v4({
      //         data: JSON.parse(dataToSign),
      //         sig: response.result
      //       });
      //       console.log(`Recovered ${recovered}`);
      //       this.sendSignedTransaction(userAddress, functionSignature, r, s, v);
      //     }
      //   }
      // );
    } else {
      console.log("Sending normal transaction");
  
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
    console.log(r);
    console.log(s);
    console.log(v);
    return {
      r: r,
      s: s,
      v: v
    };
  };


  async sendSignedTransaction(userAddress, functionData, r, s, v) {
  console.log(userAddress);
  console.log(functionData);
  console.log(r);
  console.log(s);
  console.log(v);
  console.log(this.state.ethSwap);
  console.log(this.state.ethSwap.methods
    .executeMetaTransaction(userAddress, functionData, r, s, v)
   .estimateGas({from:userAddress}));

        let gasLimit = await this.state.ethSwap.methods
          .executeMetaTransaction(userAddress, functionData, r, s, v)
         .estimateGas({from:userAddress});
         let gasPrice = await this.state.web3.eth.getGasPrice();
         console.log(gasLimit);
        console.log(gasPrice);
        let tx = await this.state.ethSwap.methods
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
      <input placeholder='Address' />
    </Form.Field>
    <Form.Field
      control={Input}
      onChange={this.handleChange}
      name="amount">
      <label>Amount</label>
      <input placeholder='Amount' />
    </Form.Field>
          <Button variant="contained" color="primary" onClick={this.onSubmit1}>
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
      <input placeholder='Address' />
    </Form.Field>
    <Form.Field
      control={Input}
      onChange={this.handleChange}
      name="amount1">
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
