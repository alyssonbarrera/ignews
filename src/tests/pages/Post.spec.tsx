import { render, screen } from '@testing-library/react'
import { getSession } from 'next-auth/react'
import Post, { getServerSideProps } from '../../pages/posts/[slug]'
import { getPrismicClient } from '../../services/prismic'

const post = {
        slug: 'my-new-post',
        title: 'My New Post',
        content: '<p>Post excerpt</p>',
        updatedAt: '22 de julho de 2022'
    }

jest.mock('next-auth/react')
jest.mock('../../services/prismic')

describe('Posts page', () => {
    
    it('renders correctly', () => {
        render(<Post post={post} />)
        expect(screen.getByText("My New Post")).toBeInTheDocument()
        expect(screen.getByText("Post excerpt")).toBeInTheDocument()
    })

    it('redirects user if no subscription is found', async () => {

        const getSessionMocked = jest.mocked(getSession)

        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: null
        } as any)

        const response = await getServerSideProps( {params: { slug: 'my-new-post' }} as any)

        expect(response).toEqual(
            expect.objectContaining({
                redirect: expect.objectContaining({
                    destination: '/posts/preview/my-new-post'
            })
        }))
    })

    it('loads initiconst data', async () => {
        const getSessionMocked = jest.mocked(getSession)
        const getPrismicClientMocked = jest.mocked(getPrismicClient)

        getPrismicClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                data: {
                    title: [{ type: 'heading', text: 'My New Post' }],
                    content: [{ type: 'paragraph', text: 'Post content' }],
                },
                last_publication_date: '07-22-2022'
            })
        } as any)

        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: 'fake-active-subscription'
        } as any)

        const response = await getServerSideProps( {params: { slug: 'my-new-post' }} as any)

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    post: {
                        slug: 'my-new-post',
                        title: 'My New Post',
                        content: '<p>Post content</p>',
                        updatedAt: '22 de julho de 2022'
                    }
                }
            })
        )
    })
})