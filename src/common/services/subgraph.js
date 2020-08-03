import { request } from 'graphql-request';

const endpoint = `${process.env.GRAPH_NODE_ENDPOINT}/subgraphs/name/${process.env.SUBGRAPH_NAME}`;

export default async function requestGraph(query, variables) {
  return await request(endpoint, query, variables);
}

export const answersQuery = () => `{
  answers {
    id
    voteTokens
    votePower
    votes
    question { id }
  }
}`;

export const questionQuery = ({ id }) => `{
  question (id: "${id}") {
    id
    answers {
      id
      voteTokens
      votePower
      votes
    }
  }
}`;

export const adminsQuery = () => `{
  admins {
    id
  }
}`;

export const boothsQuery = () => `{
  votingBooths {
    id inited, deactivated, festival { id }
  }
}`;
