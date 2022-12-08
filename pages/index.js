import Head from 'next/head';
import { Fragment } from 'react';

import { MongoClient } from 'mongodb';

import MeetupList from '../components/meetups/MeetupList';

// const DUMMY_MEETUPS = [
// 	{
// 		id: 'm1',
// 		title: 'A First Meetup',
// 		image:
// 			'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/1280px-Stadtbild_M%C3%BCnchen.jpg',
// 		address: 'Some address 5, 12345 Some City',
// 		description: 'Some description',
// 	},
// 	{
// 		id: 'm2',
// 		title: 'A First Meetup',
// 		image:
// 			'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/1280px-Stadtbild_M%C3%BCnchen.jpg',
// 		address: 'Some address 5, 12345 Some City',
// 		description: 'Some description',
// 	},
// 	{
// 		id: 'm3',
// 		title: 'A First Meetup',
// 		image:
// 			'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/1280px-Stadtbild_M%C3%BCnchen.jpg',
// 		address: 'Some address 5, 12345 Some City',
// 		description: 'Some description',
// 	},
// ];

const HomePage = (props) => {
	return (
		<Fragment>
			<Head>
				<title>React Meetups</title>
				<meta
					name="description"
					content="Browse a huge list of highly active React meetups!"
				/>
			</Head>
			<MeetupList meetups={props.meetups} />
		</Fragment>
	);
};
// if in needof waaiting data, then getStaticProps() should be exported
// ONLY from page component file! NextJS executes this function during the pre-rendering process
// it will be executed before executing the component function.
// The job of this function is to prepare props for this page.
// The function is run during the build, not on the server, not on the client side
// so client side cannot see it, it is a secure function
export async function getStaticProps() {
	// fetch data from API
	// fetch data from database
	// read data from file system

	const client = await MongoClient.connect(process.env.MONGO_DB);
	const db = client.db();
	const meetupsCollection = db.collection('meetups');

	const meetups = await meetupsCollection.find().toArray();

	client.close();

	// always return object
	return {
		props: {
			meetups: meetups.map((meetup) => ({
				title: meetup.title,
				address: meetup.address,
				image: meetup.image,
				id: meetup._id.toString(),
			})),
		},
		revalidate: 10,
	};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////
// This function will run only on the srver, never on the client
// export async function getServerSideProps(context) {
// 	const req = context.req;
// 	const res = context.res;

// 	return {
// 		props: { meetups: DUMMY_MEETUPS },
// 	};
// }

export default HomePage;
