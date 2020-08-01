import httpStatus from 'http-status';

import artworksData from './data/artworks';
import festivalsData from './data/festivals';
import propertyData from './data/properties';
import createSupertest from './helpers/supertest';
import { initializeDatabase } from './helpers/database';
import { put } from './helpers/requests';

describe('Voting booth', () => {
  let artistData;
  let artworkIds;
  let artworkQuestionData;
  let festivalData;
  let festivalQuestionData;
  let propertyIds;

  beforeAll(async () => {
    await initializeDatabase();

    // Add test data
    artistData = await put('/api/artists', {
      name: 'Ein',
      bio: 'Magical dog',
      consentToDataReveal: true,
      images: [],
    });

    artworkIds = await Promise.all(
      [
        { ...artworksData.davinci, artistId: artistData.id },
        { ...artworksData.rothko, artistId: artistData.id },
        { ...artworksData.goya, artistId: artistData.id },
        { ...artworksData.bourgeois, artistId: artistData.id },
      ].map(async (artwork) => {
        const data = await put('/api/artworks', artwork);
        return data.id;
      }),
    );

    propertyIds = await Promise.all(
      [propertyData.aProperty, propertyData.anotherProperty].map(
        async (property) => {
          const data = await put('/api/properties', property);
          return data.id;
        },
      ),
    );

    festivalData = await put('/api/festivals', festivalsData.barbeque);

    // Set up question contracts
    festivalQuestionData = await put('/api/questions', {
      title: 'What do you think about dogs?',
      festivalId: festivalData.id,
    });

    // Set up question contract
    artworkQuestionData = await put('/api/questions', {
      title: 'What and how much?',
      festivalId: festivalData.id,
      artworkId: artworkIds[0], // Create artwork question for Davinci
    });

    // Add answers to API
    const festivalAnswerIds = [];
    for await (let artworkId of artworkIds) {
      // Create answer in local database
      const answerData = await put('/api/answers', {
        artworkId,
        questionId: festivalQuestionData.id,
      });

      // Store answer id
      festivalAnswerIds.push(answerData.id);
    }

    const artworkAnswerIds = [];
    for await (let propertyId of propertyIds) {
      // Create answer in local database
      const answerData = await put('/api/answers', {
        propertyId,
        questionId: artworkQuestionData.id,
      });

      // Store answer id
      artworkAnswerIds.push(answerData.id);
    }
  });

  describe('GET /api/festivals/:id/questions', () => {
    it('should return all artworks needed to set up a booth', async () => {
      const authRequest = await createSupertest();

      await authRequest
        .get(`/api/festivals/${festivalData.chainId}/questions`)
        .expect(httpStatus.OK)
        .expect((response) => {
          const { data } = response.body;

          artworkIds.forEach((artworkId) => {
            const found = !!data.questions.find((question) => {
              return !!question.answers.find((answer) => {
                return answer.artwork && answer.artwork.id === artworkId;
              });
            });

            expect(found).toBe(true);
          });

          propertyIds.forEach((propertyId) => {
            const found = !!data.questions.find((question) => {
              return !!question.answers.find((answer) => {
                return answer.property && answer.property.id === propertyId;
              });
            });

            expect(found).toBe(true);
          });

          data.questions.forEach((question) => {
            expect(question.chainId).toBeDefined();

            question.answers.forEach((answer) => {
              expect(answer.chainId).toBeUndefined();

              if (answer.artwork) {
                expect(answer.artwork.barcode).toBeDefined();
              }
            });
          });
        });
    });
  });
});
