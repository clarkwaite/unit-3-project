var express = require('express');
// line 3 was needed in order to merge both studyGuide and users route
var router = express.Router({ mergeParams: true });
var StudyGuide = require('../models/studyGuide');
var User = require('../models/user');
var Question = require('../models/question');

// ADD A NEW ITEM
router.post('/', function (request, response) {

    // grab the user ID we want to create a new item for
    var userId = request.params.userId;
    var studyGuideId = request.params.studyGuideId;

    // then grab the new Item that we created using the form
    var newQuestionQuestion = request.body.question;
    var newQuestionAnswer = request.body.answer;
    var newQuestionTopic = request.body.topic;
    var newQuestionDifficulty = request.body.difficulty

    // Find the User in the database we want to save the new Item for
    User.findById(userId)
        .exec(function (err, user) {
            // console.log(userId);
            //console.log(studyGuide);
            // var userToSearch = (User.findById(userId));

            var newQuestion = new Question(({
                question: newQuestionQuestion,
                answer: newQuestionAnswer,
                topic: newQuestionTopic,
                difficulty: newQuestionDifficulty,
            }));

            newQuestion.save(function (err) {
                if (err) {
                    console.log(err);
                    // return;
                }
                var studyGuideSearchResult = user && user.studyGuide.find(function (sg, idx) {
                    return sg._id == studyGuideId;
                });
                studyGuideSearchResult.questions.push(newQuestion);
                studyGuideSearchResult.save(function (err) {
                    if (err) console.log(err);

                    response.json({
                        user: user,
                        usersStudyGuide: user.studyGuide,
                        studyGuide: studyGuideSearchResult,
                        studyGuideQuestions: studyGuideSearchResult.questions
                    });
                    user.save(function (err) {
                        if (err) console.log(err);


                    })
                });
            });
        });
})

router.get('/', (request, response) => {

    var userId = request.params.userId;
    var studyGuideId = request.params.studyGuideId;

    User.findById(userId)
        .exec(function (err, user) {
            // console.log(userId);
            //console.log(studyGuide);
            // var userToSearch = (User.findById(userId));

            var studyGuideSearchResult = user && user.studyGuide.find(function (sg, idx) {
                return sg._id == studyGuideId;
            });
                response.json({
                    // user: user,
                    // usersStudyGuide: user.studyGuide,
                    // studyGuide: studyGuideSearchResult,
                    studyGuideQuestions: studyGuideSearchResult
                });
    
        });
});


module.exports = router;