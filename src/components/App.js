import React, { Component } from 'react';

import './App.css';
import Web3 from 'web3'
import Token from '../abi/erc20.json';
import Biconomy from "@biconomy/mexa";
import { Button, Form , Input,Card, Icon, Image } from 'semantic-ui-react';
import { use } from 'chai';
import logo from '../../src/logos.png';
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
           const networkId =  await web3.eth.net.getId()
           this.setState({ networkId });

          
         


        biconomy.onEvent(biconomy.READY, () => {
          // Initialize your dapp here like getting user accounts etc
          const ethSwap =  this.state.web3.eth.Contract(Token, "0x6690C139564144b27ebABA71F9126611a23A31C9");
          this.setState({ ethSwap:ethSwap });
          console.log(this.state.ethSwap);
         
     
          
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
      web3:{},
      networkId:"",
      bal:"",
      functionSignature:"",
      sign:"",
      functionSignature1:"",
      sign1:"",
      tokenadd:"0x6690C139564144b27ebABA71F9126611a23A31C9"
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
        this.setState({
          functionSignature1:functionSignature
        });
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
        this.setState({
          sign1:sign
        });

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

    //   let bal =  await this.state.ethSwap.methods
    //   .totalSupply(this.state.account).call();
    //   this.setState({bal:bal.toString()})
    //  console.log(bal.toString());

     let bal1 =  await this.state.ethSwap.methods
     .balanceOf(this.state.account).call();
    this.setState({bal:bal1.toString().substr(0,8)});
    console.log(bal1);
    console.log(bal1.toString().substr(0,8));
    
      // const ethSwap =  new this.state.web3.eth.Contract(Token, "0x26507AbcE1C604a8116896FA44B823E74f6c9533");
      let nonce = await this.state.ethSwap.methods.getNonce(this.state.account).call({from:this.state.account});
      console.log(nonce);
      // let nonce = 1;
      let functionSignature = this.state.ethSwap.methods.transfer(this.state.accounts , this.state.amount).encodeABI();
      console.log(functionSignature);
      await this.setState({functionSignature});
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

      await this.setState({sign});

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
       console.log(tx.transactionHash);
       this.setState({output:tx.transactionHash});
       

      } catch (error) {
        console.log(error);
      }
    

  handleChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value })
  }

  render() {
    return (
      <div>
         <nav className="navbar navbar-light" style={{backgroundColor:"#0B1647"}}>
                    <div className=" col-0 navbar-brand" position="inline-block">
                      <div to={{
                            pathname: '/',
                      }}><img src={logo} style = {{width: "40px" , height: "40px"}} />
                      <b style={{
                        position: "absolute",
                        color: "white",
                        top: "22px",
                        marginLeft:"500px",
                        fontSize: "20px",
                        fontFamily: "arial"}}>NETWORK AGNOSTIC DEMO </b>
                      </div> 
                    </div>
                  

                
                    
                    {/* <div className= "col-1" style={{fontSize:"17px",color:"white", visibility: "hidden"}}>
                        <NavLink to={{
                            pathname: '/CreatePolicyDash',
                        }}>My Policies</NavLink>
                    </div>
                    <div className= "col-1" style={{fontSize:"17px",color:"white",  visibility: "hidden" }}>
                        <NavLink to={{
                            pathname: '/vendor',
                        }}>Customers' Policies</NavLink>
                    </div> */}
                    
                    <div className= "col-7" style={{fontSize:"15px", position:"right", color:"white", visibility: this.state.copyVis}} align="right">
                        {this.state.email} 
                    </div>
                    <div className= "col-1" style={{fontSize:"17px"}} align = "Right">
                        
                        
                    </div>
                </nav>
                <div className="container-fluid mt-5">

<div style={{ backgroundColor:"#9fdfed",padding:"10px", marginTop:"-40px" }}> 
<p  class="text-sm">Connected Network - <p style={{color:"#d92e75"}}>{this.state.account}</p></p>
</div>
<div style={{padding:"5px"}}>
</div>
<div style={{backgroundColor:"#cfd672",padding:"10px"}}>
<div style={{backgroundColor:"white",padding:"10px"}}>

<p class="text-sm">Network id - <p style={{color:"#d92e75"}}>{this.state.networkId}</p></p>
<p class="text-sm">Token Address - <p style={{color:"#d92e75"}}>{this.state.tokenadd}</p></p>

                  <p class="text-sm">Token Balance - <p style={{color:"#d92e75"}}>{this.state.bal}</p></p>
</div>

</div>
<p>
      👉
      You'll be prompted for a signature, and then a simple-relayer server will relay your signature to Matic network
    </p>


        
      
          
         
            
       <div className="row" style={{padding:"20px"}}>

       <div className="row">


          <div className="col">     
        
       <p>TRANSFER</p>
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
          <button variant="contained" color="primary" class="btn btn-primary btn-sm" onClick={this.onSubmit1}>
              Submit
            </button>
            </div>
            </div>


            <div className="col">
            <p>Function Signature - <p style={{color:"#d92e75"}}>{this.state.functionSignature.substr(1,50)}</p></p>
           <p>Signed data - <p style={{color:"#d92e75"}}>{this.state.sign.substr(1,50)}</p></p>
            </div>


        </div>
        
       
           
    
           <div className="row" style={{padding:"20px"}}>

<div className="row">


   <div className="col">     
 
<p>APPROVE</p>
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
   <button variant="contained" class="btn btn-primary btn-sm" onClick={this.onSubmit}>
       Submit
     </button>
     </div>


     </div>


     <div className="col">
     <p>Function Signature - <p style={{color:"#d92e75"}}>{this.state.functionSignature1.substr(1,50)}</p></p>
    <p>Signed data - <p style={{color:"#d92e75"}}>{this.state.sign1.substr(1,50)}</p></p>
     </div>


 </div>
 <p class="text-sm">Transaction hash - <a href={`https://explorer-mumbai.maticvigil.com//tx/${this.state.output}/token-transfers`} target="_blank">{this.state.output}</a></p>
            
          </div>
        </div>
    
    );
  }
}

export default App;
