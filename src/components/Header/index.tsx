import { SignInButton } from '../SignInButton';
import styles from './styles.module.scss';
import { ActiveLink } from './ActiveLink';
import { FiMenu } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export function Header() {

    const [menuIsOpen, setMenuIsOpen] = useState(false);

    const router = useRouter()

    console.log(router.asPath)

    useEffect(() => {
        setMenuIsOpen(false)
    }, [router.asPath])

    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <img src="/images/logo.svg" alt="ig.news" />

                <FiMenu size={32} cursor={"pointer"} onClick={() => menuIsOpen ? setMenuIsOpen(false) : setMenuIsOpen(true)} />
                {
                   menuIsOpen && (
                        <nav>
                            <ActiveLink activeClassName={styles.active} href="/">
                                <a>Home</a>
                            </ActiveLink>
                            <ActiveLink activeClassName={styles.active} href="/posts">
                                <a>Posts</a>
                            </ActiveLink>
                            <SignInButton />
                        </nav>
                   ) 
                }

                <nav>
                    <ActiveLink activeClassName={styles.active} href="/">
                        <a>Home</a>
                    </ActiveLink>
                    <ActiveLink activeClassName={styles.active} href="/posts">
                        <a>Posts</a>
                    </ActiveLink>
                    <SignInButton />
                </nav>
            </div>
        </header>
    )
}