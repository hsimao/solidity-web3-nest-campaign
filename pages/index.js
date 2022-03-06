import React from "react";
import factory from "../ethereum/factory";

function Index({ campaigns }) {
  return <h1>{campaigns}</h1>;
}

Index.getInitialProps = async (ctx) => {
  const campaigns = await factory.methods.getDeployedCampaigns().call();
  return { campaigns };
};

export default Index;
