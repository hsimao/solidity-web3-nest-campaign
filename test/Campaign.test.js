const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider({ gasLimit: 10000000 }));

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;

// const { abi, evm } = require("../compile");

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: "10000000" });

  await factory.methods.createCampaign("100").send({
    from: accounts[0],
    gas: "1000000"
  });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

  campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
});

describe("Campaigns", () => {
  it("deploys a factory and a campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("marks caller as the campaign manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it("allows people to contribute money and marks them as approvers", async () => {
    await campaign.methods.contribute().send({
      value: "200",
      from: accounts[1]
    });

    const isContributor = await campaign.methods.approvers(accounts[1]).call();

    assert.ok(isContributor);
  });

  it("requires a minimum contribution", async () => {
    try {
      await campaign.methods.contribute().send({
        value: "5",
        from: accounts[1]
      });
      throw false;
    } catch (err) {
      assert.ok(err);
    }
  });

  it("allows a manager to make a payment request", async () => {
    const description = "Buy batteries";
    const value = "100";
    const recipient = accounts[1];

    await campaign.methods.createRequest(description, value, recipient).send({
      from: accounts[0],
      gas: "1000000"
    });

    const request = await campaign.methods.requests(0).call();

    assert.equal(description, request.description);
    assert.equal(value, request.value);
    assert.equal(recipient, request.recipient);
  });
});
