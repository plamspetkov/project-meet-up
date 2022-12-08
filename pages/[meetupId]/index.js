import { MongoClient, ObjectId } from 'mongodb';
import { Fragment } from 'react';
import Head from 'next/head';

import MeetupDetail from '../../components/meetups/MeetupDetail';

const MeetupDetails = (props) => {
	return (
		<Fragment>
			<Head>
				<title>{props.meetupData.title}</title>
			</Head>
			<MeetupDetail
				image={props.meetupData.image}
				title={props.meetupData.title}
				address={props.meetupData.address}
				description={props.meetupData.description}
			/>
		</Fragment>
	);
};

export async function getStaticPaths() {
	const client = await MongoClient.connect(process.env.MONGO_DB);
	const db = client.db();
	const meetupsCollection = db.collection('meetups');

	const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

	client.close();

	return {
		fallback: 'blocking',
		paths: meetups.map((meetups) => ({
			params: { meetupId: meetups._id.toString() },
		})),

		// [
		// 	{
		// 		params: {
		// 			meetupId: 'm1',
		// 		},
		// 	},
		// 	{
		// 		params: {
		// 			meetupId: 'm2',
		// 		},
		// 	},
		// ],
	};
}

export async function getStaticProps(context) {
	// fetch data for single meetup

	const meetupId = context.params.meetupId;

	const client = await MongoClient.connect(process.env.MONGO_DB);
	const db = client.db();
	const meetupsCollection = db.collection('meetups');

	const selectedMeetup = await meetupsCollection.findOne({
		_id: ObjectId(meetupId),
	});

	client.close();

	console.log(meetupId);

	return {
		props: {
			meetupData: {
				id: selectedMeetup._id.toString(),
				title: selectedMeetup.title,
				address: selectedMeetup.address,
				image: selectedMeetup.image,
				description: selectedMeetup.description,
			}, //{
			// 	image:
			// 		'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/',
			// 	id: 'm1',
			// 	title: 'A First Meetup',
			// 	address: 'Some Street 5, Some City',
			// 	description: 'The meetup description',
			// },
		},
	};
}

export default MeetupDetails;
