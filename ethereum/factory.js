import web3 from "./web3";
import compiledFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  compiledFactory.abi,
  "0x63496eedAD400DDaEa4138B8A31859425732bbF5" // NOTE: 暫時使用第一次 deploy 的合約地址
);

export default instance;
