'use server';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  BatchGetCommand,
  DynamoDBDocumentClient,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { captureException } from '@sentry/nextjs';
import { headers as nextHeaders } from 'next/headers';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

const dynamoDb = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.REACTIONS_TABLE_NAME;

const MAX_ALLOWED_REACTIONS_PER_IP = 16;

// We only support one reaction type for now
const REACTION_TYPE = 'love';

export const getIpAddress = async () => {
  let ipAddress;

  const defaultIpAddress = '127.0.0.1';

  const headers = await nextHeaders();

  if (process.env.NODE_ENV === 'development') {
    ipAddress = defaultIpAddress;
  } else {
    const xForwardedFor = headers.get('x-forwarded-for');
    const xRealIp = headers.get('x-real-ip');
    ipAddress = xForwardedFor || xRealIp;
  }

  return ipAddress || defaultIpAddress;
};

export async function getReactionsForPageId({
  pageId,
  ipAddress,
}: {
  pageId: string;
  ipAddress: string;
}): Promise<{
  total: {
    [reactionType: string]: number;
  };
  current: {
    [reactionType: string]: number;
  };
}> {
  const params = {
    RequestItems: {
      [TABLE_NAME as string]: {
        Keys: [
          { PK: pageId, SK: 'totals' },
          { PK: pageId, SK: `entries#${ipAddress}` },
        ],
      },
    },
  };

  try {
    const data = await dynamoDb.send(new BatchGetCommand(params));

    const items = data?.Responses?.[TABLE_NAME as string];

    if (!items) {
      return {
        total: {},
        current: {},
      };
    }

    // Parse the results to separate totals and specific IP entry
    const result = {
      total: {},
      current: {},
    };

    for (const item of items) {
      if (item.SK === 'totals') {
        result.total = item.reactionTotals;
      } else if (item.SK === `entries#${ipAddress}`) {
        result.current = item.reactions;
      }
    }

    return result;
  } catch (error) {
    captureException(error);
    return {
      total: {},
      current: {},
    };
  }
}

export async function incrementReaction({
  pageId,
  increment,
}: {
  pageId: string;
  increment: number;
}) {
  const ipAddress = await getIpAddress();

  // Helper function to initialize and increment a reaction map
  async function updateReactionMap({
    sk,
    mapName,
  }: {
    sk: string;
    mapName: string;
  }) {
    // Initialize map if it doesn't exist
    const initParams = {
      TableName: TABLE_NAME,
      Key: {
        PK: pageId,
        SK: sk,
      },
      UpdateExpression: `SET #map = if_not_exists(#map, :emptyMap)`,
      ExpressionAttributeNames: {
        '#map': mapName,
      },
      ExpressionAttributeValues: {
        ':emptyMap': {},
      },
    };

    try {
      await dynamoDb.send(new UpdateCommand(initParams));
    } catch (error) {
      console.error(`Error initializing ${mapName} map:`, error);
      throw error;
    }

    // Increment the reaction count
    const incrementParams = {
      TableName: TABLE_NAME,
      Key: {
        PK: pageId,
        SK: sk,
      },
      UpdateExpression: `SET #map.#type = if_not_exists(#map.#type, :zero) + :increment`,
      ExpressionAttributeNames: {
        '#map': mapName,
        '#type': REACTION_TYPE,
      },
      ExpressionAttributeValues: {
        ':zero': 0,
        ':increment': increment,
      },
    };

    try {
      await dynamoDb.send(new UpdateCommand(incrementParams));
      console.log(`Successfully incremented ${mapName} for ${sk}`);
    } catch (error) {
      console.error(`Error updating ${mapName}:`, error);
      throw error;
    }
  }

  // Update individual IP entry
  await updateReactionMap({
    sk: `entries#${ipAddress}`,
    mapName: 'reactions',
  });

  // Update totals entry
  await updateReactionMap({
    sk: 'totals',
    mapName: 'reactionTotals',
  });
}

export async function reactToResource(pageId: string, increment: number) {
  const currentReactionsForPage = await getReactionsForPageId({
    pageId,
    ipAddress: await getIpAddress(),
  });

  if (
    currentReactionsForPage.current[REACTION_TYPE] >=
    MAX_ALLOWED_REACTIONS_PER_IP
  ) {
    return {
      error: 'Max reactions reached',
      total: {
        [REACTION_TYPE]: currentReactionsForPage.total[REACTION_TYPE],
      },
      current: {
        [REACTION_TYPE]: currentReactionsForPage.current[REACTION_TYPE],
      },
    };
  }

  await incrementReaction({ pageId, increment });

  // We could probably also refetch the latest data here, but this saves
  // an extra call to the database
  return {
    total: {
      [REACTION_TYPE]: currentReactionsForPage.total[REACTION_TYPE] + increment,
    },
    current: {
      [REACTION_TYPE]:
        currentReactionsForPage.current[REACTION_TYPE] + increment,
    },
  };
}
