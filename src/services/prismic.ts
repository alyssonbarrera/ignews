import * as Prismic from '@prismicio/client';

export const repositoryName = process.env.PRISMIC_ENDPOINT;

export function getPrismicClient() {
    const prismic = Prismic.createClient(repositoryName, {
        accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    });

    return prismic;
}