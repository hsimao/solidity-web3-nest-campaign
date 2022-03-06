import React from "react";
import { Card, Button } from "semantic-ui-react";
import factory from "../ethereum/factory";

const renderCampaigns = (campaigns) => {
  const items = campaigns.map((address) => ({
    header: address,
    description: <a>View Campaign</a>,
    fluid: true
  }));

  return <Card.Group items={items} />;
};

function Index({ campaigns }) {
  return (
    <div>
      <h2>Open Campaigns</h2>
      <Button
        floated="right"
        content="Create Campaign"
        icon="add circle"
        primary
      />
      {renderCampaigns(campaigns)}
    </div>
  );
}

Index.getInitialProps = async (ctx) => {
  const campaigns = await factory.methods.getDeployedCampaigns().call();
  return { campaigns };
};

export default Index;
