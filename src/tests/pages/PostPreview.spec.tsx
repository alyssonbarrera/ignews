import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import { getSession, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Post, { getStaticProps } from '../../pages/posts/preview/[slug]'
import { getPrismicClient } from '../../services/prismic'

const post = {
        slug: 'my-new-post',
        title: 'My New Post',
        content: '<p>Post excerpt</p>',
        updatedAt: '22 de julho de 2022'
    }

jest.mock('next-auth/react')
jest.mock('next/router', () => ({
    useRouter: jest.fn().mockReturnValue({
      push: jest.fn(),
    }),
}))
jest.mock('../../services/prismic')

describe('Posts preview page', () => {
    
    it('renders correctly', () => {
        const useSessionMocked = jest.mocked(useSession)

        useSessionMocked.mockReturnValueOnce({ data: null, loading: false } as any)

        render(<Post post={post} />)
        
        expect(screen.getByText("My New Post")).toBeInTheDocument()
        expect(screen.getByText("Post excerpt")).toBeInTheDocument()
        expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument()
    })

    it('redirects user to full post when user is subscribed', async () => {

        const useSessionMocked = jest.mocked(useSession)
        const useRouterMocked = jest.mocked(useRouter)
        const pushMock = jest.fn()

        useSessionMocked.mockReturnValueOnce({ data: {activeSubscription: 'fake-active-subscription'}} as any)

        useRouterMocked.mockReturnValueOnce({
            push: pushMock
        } as any)

        render(<Post post={post} />)

        expect(pushMock).toHaveBeenCalledWith('/posts/my-new-post')
    })

    it('loads initiconst data', async () => {
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

        const response = await getStaticProps({ params: { slug: 'my-new-post' } })

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