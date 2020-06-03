import { GraphQLClient } from 'graphql-request';

const endpoint = `${process.env.GRAPH_NODE_ENDPOINT}subgraphs/name/${process.env.SUBGRAPH_NAME}`;

export const graphQLClient = new GraphQLClient(endpoint, { headers: {} });

export default async function requestGraph(query, variables) {
  return graphQLClient.request(query, variables);
}

export const voteByQuestion = question => `{
    answers
    (where:
      {question: "${question.toLowerCase()}"}
    ) { id voteTokens votePower votes active question { id } }
  }`;
