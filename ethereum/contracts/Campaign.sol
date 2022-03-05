// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract CampaignFactory {
  address[] public deployedCampaigns;

  function createCampaign(uint256 minimum) public {
    address newCampaign = address(new Campaign(minimum, msg.sender));
    deployedCampaigns.push(newCampaign);
  }

  function getDeployedCampaigns() public view returns (address[] memory) {
    return deployedCampaigns;
  }
}

contract Campaign {
  struct Request {
    string description;
    uint256 value;
    address payable recipient;
    bool complete;
    uint256 approvalCount;
    mapping(address => bool) approvals;
  }

  Request[] public requests;
  address public manager;
  uint256 public minimumContribution;
  mapping(address => bool) public approvers;
  uint256 public approversCount;

  constructor(uint256 minimum, address creator) {
    manager = creator;
    minimumContribution = minimum;
  }

  modifier onlyManager() {
    require(msg.sender == manager);
    _;
  }

  function contribute() public payable {
    require(msg.value > minimumContribution);
    approvers[msg.sender] = true;
    approversCount++;
  }

  function createRequest(
    string calldata description,
    uint256 value,
    address payable recipient
  ) public onlyManager {
    Request storage newRequest = requests.push();

    newRequest.description = description;
    newRequest.value = value;
    newRequest.recipient = recipient;
    newRequest.complete = false;
    newRequest.approvalCount = 0;
  }

  function approveRequest(uint256 index) public {
    Request storage request = requests[index];

    require(approvers[msg.sender]);
    require(!request.approvals[msg.sender]);

    request.approvals[msg.sender] = true;
    request.approvalCount++;
  }

  function finalizeRequest(uint256 index) public payable onlyManager {
    Request storage requset = requests[index];

    require(!requset.complete);
    require(requset.approvalCount > (approversCount / 2));

    requset.recipient.transfer(requset.value);
    requset.complete = true;
  }
}
