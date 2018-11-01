const auction = artifacts.require('./QuizApp.sol')
const assert = require('assert')

let contractInstance

  contract('quizapp',  (accounts) => {
    beforeEach(async () => {
      contractInstance = await auction.deployed()
    })
    for(i=1;i<5;i++){
      const z = i;
      it('Check if participant is getting registered', async() => {
        var prevcnt  = await contractInstance.get_current_participant_count()      
        try{
          await contractInstance.regester_as_participant({from: accounts[z], value: web3.toWei(0.000000000000000010,'ether')})
        }
        catch(err){
          // console.log(err)
        }
        var newcnt  = await contractInstance.get_current_participant_count()            
        assert.equal(prevcnt.c[0]+1,newcnt.c[0], 'Participant is not registered')
    
      })
    }
    it('Check if same participant is not getting registered again', async() => {
      var prevcnt  = await contractInstance.get_current_participant_count()
      try{
        await contractInstance.regester_as_participant({from: accounts[1], value: web3.toWei(0.000000000000000010,'ether')})
      }
      catch(err){
        // console.log(err)
      }
      var newcnt  = await contractInstance.get_current_participant_count()
      assert.equal(prevcnt.c[0],newcnt.c[0], 'Duplicate participant is registered')
    })
    it('Check if participant is not organizer', async() => {
      var prevcnt  = await contractInstance.get_current_participant_count()
      try{
        await contractInstance.regester_as_participant({from: accounts[0], value: web3.toWei(0.000000000000000010,'ether')})
      }
      catch(err){
        // console.log(err)
      }
      var newcnt  = await contractInstance.get_current_participant_count()
      assert.equal(prevcnt.c[0],newcnt.c[0], 'Organizer registered as participant')
    })
    it('Check if participant is not getting registered on paying less than participation fees', async() => {
      var prevcnt  = await contractInstance.get_current_participant_count()
      try{
        await contractInstance.regester_as_participant({from: accounts[5], value: web3.toWei(0.000000000000000007,'ether')})
      }
      catch(err){
        // console.log(err)
      }
      var newcnt  = await contractInstance.get_current_participant_count()
      assert.equal(prevcnt.c[0],newcnt.c[0], 'participant registered with less than participation fees')
    })
    it('Check if organizer receives the participation fees on participant registration', async() => {
      var prev_balance  = await contractInstance.getBalance({from: accounts[0]})
      try{
        await contractInstance.regester_as_participant({from: accounts[5], value: web3.toWei(0.000000000000000010,'ether')})
      }
      catch(err){
        // console.log(err)
      }
      var new_balance  = await contractInstance.getBalance({from: accounts[0]})
      assert.equal(new_balance.c[0],prev_balance.c[0]+10, 'Organizer didnt receive the participation fees')
    })
    it('Check if participant can answer a question', async() => {
      var check_flag = 0
      try{
        await contractInstance.play_game_question_answer(1,1,{from: accounts[1]})
        check_flag = 1;
      }
      catch(err){
        console.log(err)
      }
      assert.equal(check_flag,1, 'participant could not answer question')
    })
    it('Check if non participant cannot answer a question', async() => {
      var check_flag = 0;
      try{
        await contractInstance.play_game_question_answer(1,1,{from: accounts[6]})
        check_flag = 1;
      }
      catch(err){
        // console.log(err)
      }
      assert.equal(check_flag,0, 'Non participant answered a question')
    })
    it('Check if organizer cannot answer a question', async() => {
      var check_flag = 0;
      try{
        await contractInstance.play_game_question_answer(1,1,{from: accounts[0]})
        check_flag = 1;
      }
      catch(err){
        // console.log(err)
      }
      assert.equal(check_flag,0, 'Organizer answered a question')
    })

    it('Check if answered question list of participant is updated on correctly answering', async() => {
      try{
        await contractInstance.play_game_question_answer(1,1,{from: accounts[1]})
      }
      catch(err){
        // console.log(err)
      }
      var questions_answered = await contractInstance.get_answered_questions({from: accounts[1]})
      var bit = 1;
      var temp = questions_answered.c[0] & bit;
      assert.equal(temp,bit, 'Answered questions list not updated')
    })
    it('Check if answered question list of participant is updated on correctly answering', async() => {
      try{
        await contractInstance.play_game_question_answer(3,3,{from: accounts[1]})
      }
      catch(err){
        // console.log(err)
      }
      var questions_answered = await contractInstance.get_answered_questions({from: accounts[1]})
      var bit = 4;
      var temp = questions_answered.c[0] & bit;
      assert.equal(temp,bit, 'Answered questions list not updated')
    })
    it('Check if answered question list of participant is not updated on incorrectly answering', async() => {
      try{
        await contractInstance.play_game_question_answer(4,2,{from: accounts[1]})
      }
      catch(err){
        // console.log(err)
      }
      var questions_answered = await contractInstance.get_answered_questions({from: accounts[1]})
      var bit = 8;
      var temp = questions_answered.c[0] & bit;
      assert.equal(temp,0, 'Answered questions list updated')
    })
    it('Check if same question is not answered twice', async() => {
      var check_flag = 0;
      try{
        await contractInstance.play_game_question_answer(1,1,{from: accounts[1]})
        check_flag = 1;
      }
      catch(err){
        // console.log(err)
      }
      assert.equal(check_flag,0, 'Same question answered twice')
    })
    it('Check if no of correct attempts of a question are updated on a correct answer', async() => {
      var correct_attempts = await contractInstance.get_no_of_correct_attempts(1);
      try{
        await contractInstance.play_game_question_answer(1,1,{from: accounts[2]})
      }
      catch(err){
        // console.log(err)
      }
      var updated_correct_attempts = await contractInstance.get_no_of_correct_attempts(1);
      assert.equal(updated_correct_attempts.c[0],correct_attempts.c[0]+1, 'No of correct attempts of the question not updated')
    })
    it('Check if no of correct attempts of a question are not updated on an incorrect answer', async() => {
      var correct_attempts = await contractInstance.get_no_of_correct_attempts(1);
      try{
        await contractInstance.play_game_question_answer(2,3,{from: accounts[2]})
      }
      catch(err){
        // console.log(err)
      }
      var updated_correct_attempts = await contractInstance.get_no_of_correct_attempts(1);
      assert.equal(updated_correct_attempts.c[0],correct_attempts.c[0], 'No of correct attempts of the question updated')
    })
})