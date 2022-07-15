require('dotenv').config();

const axios = require('axios');
const nodemailer = require('nodemailer');

const status = {
	ghostBan: false,
	replyDeboost: false,
	searchSuggestBan: false,
	userName: '',
};

const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 587,
	secure: false,
	requireTLS: true,
	pool: true,
	auth: {
		user: process.env.USER_NAME,
		pass: process.env.PASS,
	},
	tls: {
		ciphers: 'SSLv3',
	},
});

const getStatus = () => {
	axios
		.get(
			'https://taishin-miyamoto.com/ShadowBan/API/JSON?screen_name=0xj0hnj0hn'
		)
		.then((res) => {
			status.ghostBan = res.data.ghost_ban;
			status.replyDeboost = res.data.reply_deboosting;
			status.searchSuggestBan = res.data.search_suggestion_ban;
			status.userName = res.data.user.name;

			if (status.replyDeboost || status.ghostBan || status.searchSuggestBan) {
				const mailOptions = {
					from: '"Personal Ban Bot" <from@example.com>',
					to: 'kirtleyj16@gmail.com',
					subject: 'Twitter Shadowban Update - Still Banned',
					html: `<div><p>Reply Deboost: ${status.replyDeboost}</p><p>Ghost Ban: ${status.ghostBan}</p><p>Search Suggestion Ban: ${status.searchSuggestBan}</p></div>`,
				};

				transporter.sendMail(mailOptions, function (error, info) {
					if (error) {
						console.log(error);
						transporter.close();
					} else {
						console.log('Email sent: ' + info.response);
						transporter.close();
					}
				});
			}

			if (!status.replyDeboost) {
				const mailOptions = {
					from: '"Personal Ban Bot" <from@example.com>',
					to: 'kirtleyj16@gmail.com',
					subject: 'Twitter Shadowban Update - Resolved',
					text: 'Reply boosting removed',
				};

				transporter.sendMail(mailOptions, function (error, info) {
					if (error) {
						console.log(error);
						transporter.close();
					} else {
						console.log('Email sent: ' + info.response);
						transporter.close();
					}
				});
			}
		})
		.catch((err) => console.log(err));
};

getStatus();
