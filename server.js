 const express = require('express');
 const app = express();
 const PORT = process.env.PORT || 8081;

 app.listen(PORT, () => {
     console.log(`Server listening on port ${PORT}...`);
 });

 app.get('/cron', (req, res) => {

     if (!(req.get('X-Appengine-Cron') == 'true' || req.query.token == process.env.PUBSUB_VERIFICATION_TOKEN)) {
         return res.status(401).end();
     }

     const data = JSON.stringify({ message: 'cron', timestamp: Date.now() });




     return publishMessage(process.env.PUBSUB_TOPIC, data).then(messageId => {
             res.status(200);
             res.send(messageId);
         })
         .catch(err => {
             res.status(400);
             res.send(err);
         });
 });



 function publishMessage(topicName, data, res) {

     const PubSub = require(`@google-cloud/pubsub`);



     var pubsub = new PubSub({
         projectId: process.env.GOOGLE_CLOUD_PROJECT
     });

     const dataBuffer = Buffer.from(data);
     return pubsub
         .topic(topicName)
         .publisher()
         .publish(dataBuffer)


 }
