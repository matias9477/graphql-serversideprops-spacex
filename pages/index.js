import Head from 'next/head'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home({ launches }) {
  console.log('launches', launches)
  return (
    <div className={styles.container}>
      <Head>
        <title>SpaceX Launches</title>
        <meta name="description" content="Spacex Launches using GraphQL and server side props." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          SpaceX Launches
        </h1>

        <p className={styles.description}>
          Lastest launches from SpaceX using server side props.
        </p>

        <div className={styles.grid}>
          {
            launches.map( launch => {
              return (
                <a key={launch.id} href={launch.links.video_link} className={styles.card} target="_blank">
                <h3>{ launch.mission_name}</h3>
                <p><strong>Launch Time: </strong>{new Date(launch.launch_date_local).toLocaleDateString("es-AR")}</p>
                <br/>
                <img src={launch.links.mission_patch} width='50px'/>
                </a>
              )
            })
          }
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: 'https://api.spacex.land/graphql/',
    cache: new InMemoryCache()
  });

  const {data} = await client.query({
    query: gql`
      query GetLaunches
      {
        launchesPast(limit: 10) {
          id
          mission_name
          launch_date_local
          launch_site {
            site_name_long
          }
          links {
            article_link
            video_link
            mission_patch
          }
          rocket {
            rocket_name
            }
        }
      }
    `
  });

  return {
    props: {
      launches: data.launchesPast
    }
  }
}
