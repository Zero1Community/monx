module.exports = {
	debug : true,
	api_url: 'http://localhost:3000/api/',
  mongodb: {
    url: 'mongodb://zero1:itrhzzillxqkhmbz@ds031882.mongolab.com:31882/noprod'
  }, 
	email: {
		service: 'Gmail',
		auth: {
          user: 'monx.notifications@gmail.com',
          pass: 'asdayhri7werhvnssadni8as'
        },
        from: 'Monx <monx.notifications@gmail.com>'
	}
}